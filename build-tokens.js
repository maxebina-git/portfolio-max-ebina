import { execSync } from 'child_process';
import StyleDictionary from 'style-dictionary';
import fs from 'fs';

// 1. Criar a pasta temporária para o JSON limpo se ela não existir
if (!fs.existsSync('./temp')) {
  fs.mkdirSync('./temp');
}

console.log('🧹 Limpando e resolvendo referências globais do Figma JSON...');

try {
  const originalTokens = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));
  const allSets = originalTokens.$metadata?.tokenSetOrder || ["global"];
  const setsString = allSets.join(',');

  execSync(
    `npx token-transformer tokens/tokens.json temp/resolved.json "${setsString}" "" --resolveReferences=true`,
    { stdio: 'inherit' }
  );
} catch (err) {
  console.log('⚠️ Erro ao rodar token-transformer.');
}

console.log('🏭 Iniciando extração avançada de variáveis...');

const rawTokens = JSON.parse(fs.readFileSync('temp/resolved.json', 'utf8'));
let cssLines = [];

制造Tokens(rawTokens);

function 制造Tokens(obj, path = []) {
  if (!obj || typeof obj !== 'object') return;
  
  // Ignora explicitamente as pastas de tema semântico na árvore recursiva geral
  // para que elas não sejam jogadas de forma misturada dentro do :root
  if (
    path[0] === 'shadcn/ui/dark/slate' || 
    path[0] === 'shadcn/ui/dark/zinc' || 
    path[0] === 'shadcn/ui/light/slate' || 
    path[0] === 'shadcn/ui/light/zinc' ||
    path[0] === 'theme-dark-slate' || 
    path[0] === 'theme-dark-zinc'
  ) {
    return;
  }
  
  if (obj.hasOwnProperty('$value') && obj.$value && typeof obj.$value === 'object' && obj.$value.hasOwnProperty('value')) {
    const targetValue = obj.$value.value;
    if (typeof targetValue === 'string' && !targetValue.includes('{')) {
      let cleanPath = path.map(p => p.toLowerCase()).filter((item, index, self) => self.indexOf(item) === index);
      
      let varName = cleanPath.join('-')
        .replace(/^padding-(p[xytrbl]-)/, '$1')
        .replace(/^padding-padding-/, 'padding-')
        .replace(/^gap-gap-/, 'gap-')
        .replace(/^rounded-rounded-/, 'rounded-')
        .replace(/^font-sizes-font-size-/, 'font-size-')
        .replace(/[^a-z0-9_-]/g, '');
      
      cssLines.push(`  --${varName}: ${targetValue};`);
    }
    return;
  }
  
  if (obj.hasOwnProperty('value') && typeof obj.value === 'string' && !obj.value.includes('{') && path[path.length - 1] !== '$extensions') {
    let cleanPath = path.map(p => p.toLowerCase()).filter((item, index, self) => self.indexOf(item) === index);

    let varName = cleanPath.join('-')
      .replace(/^padding-(p[xytrbl]-)/, '$1')
      .replace(/^padding-padding-/, 'padding-')
      .replace(/^gap-gap-/, 'gap-')
      .replace(/^rounded-rounded-/, 'rounded-')
      .replace(/^font-sizes-font-size-/, 'font-size-')
      .replace(/[^a-z0-9_-]/g, '');

    cssLines.push(`  --${varName}: ${obj.value};`);
    return;
  }
  
  for (const key in obj) {
    if (key !== '$extensions' && key !== '$type') {
      制造Tokens(obj[key], [...path, key]);
    }
  }
}

// 🎯 CAPTURA E SEPARAÇÃO DOS TOKENS SEMÂNTICOS (LIGHT VS DARK)
const originalJson = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));

let lightLines = [];
let darkLines = [];

// 1. Processa e isola o Modo Claro (Light Mode)
const lightThemeBlock = originalJson['shadcn/ui/light/slate'] || originalJson['shadcn/ui/light/zinc'];
if (lightThemeBlock) {
  for (const key in lightThemeBlock) {
    const token = lightThemeBlock[key];
    if (token && (token.$value || token.value)) {
      const rawValue = token.$value || token.value;
      const varName = key.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      
      if (typeof rawValue === 'string' && rawValue.includes('{')) {
        let cleanRef = rawValue.replace(/[{}]/g, '').replace(/\./g, '-').replace(/\s+/g, '-');
        lightLines.push(`  --${varName}: var(--${cleanRef.toLowerCase()});`);
      } else if (typeof rawValue === 'string') {
        lightLines.push(`  --${varName}: ${rawValue};`);
      }
    }
  }
}

// 2. Processa e isola o Modo Escuro (Dark Mode)
const darkThemeBlock = originalJson['shadcn/ui/dark/slate'] || originalJson['shadcn/ui/dark/zinc'];
if (darkThemeBlock) {
  for (const key in darkThemeBlock) {
    const token = darkThemeBlock[key];
    if (token && (token.$value || token.value)) {
      const rawValue = token.$value || token.value;
      const varName = key.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      
      if (typeof rawValue === 'string' && rawValue.includes('{')) {
        let cleanRef = rawValue.replace(/[{}]/g, '').replace(/\./g, '-').replace(/\s+/g, '-');
        darkLines.push(`  --${varName}: var(--${cleanRef.toLowerCase()});`);
      } else if (typeof rawValue === 'string') {
        darkLines.push(`  --${varName}: ${rawValue};`);
      }
    }
  }
}

// Organiza as variáveis globais remanescentes
cssLines = [...new Set(cssLines)].sort();

// Estrutura final do CSS organizada com escopos independentes para o Toggle funcionar!
const cssContent = `:root {
${cssLines.join('\n')}
${lightLines.join('\n')}
}

.dark {
${darkLines.join('\n')}
}
`;

if (!fs.existsSync('src/styles')) fs.mkdirSync('src/styles', { recursive: true });
fs.writeFileSync('src/styles/variables.css', cssContent);

console.log(`✨ Sincronização concluída com sucesso! Suporte a Temas (Light e Dark) gerado com ${cssLines.length + lightLines.length + darkLines.length} tokens.`);