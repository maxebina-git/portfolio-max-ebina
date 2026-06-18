import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializa o SDK oficial do Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Captura os argumentos passados pelo terminal PowerShell
const [instrucao, arquivoRelativo] = process.argv.slice(2);

if (!instrucao || !arquivoRelativo) {
  console.log('⚠️ Formato incorreto! Use assim: node ai-adjust.js "Sua ordem" "caminho/do/arquivo.astro"');
  process.exit(1);
}

const TARGET_FILE = path.join(process.cwd(), arquivoRelativo);
const RULES_FILE = path.join(process.cwd(), 'ai-rules.json');

async function aplicarAjuste() {
  try {
    // Garante que o arquivo de destino existe
    if (!fs.existsSync(TARGET_FILE)) {
      throw new Error(`Arquivo não encontrado no caminho: ${arquivoRelativo}`);
    }
    
    // Garante que o arquivo de regras existe
    if (!fs.existsSync(RULES_FILE)) {
      throw new Error('Arquivo ai-rules.json não encontrado na raiz do projeto.');
    }

    // Lê os conteúdos locais
    const codigoOriginal = fs.readFileSync(TARGET_FILE, 'utf-8');
    const diretrizesRaw = fs.readFileSync(RULES_FILE, 'utf-8');
    const diretrizes = JSON.parse(diretrizesRaw);

    console.log(`\n🤖 Analisando o arquivo: ${arquivoRelativo}...`);
    console.log('✨ Aplicando regras genéricas de HTML/CSS/JS e Design System...');
    
    // Monta a engenharia de prompt contextualizada
    const prompt = `
      Você é um engenheiro front-end sênior focado em UI/UX.
      Contexto do Projeto: ${diretrizes.project_context}
      
      Você DEVE seguir estritamente estes princípios fundamentais:
      1. Semântica HTML: ${diretrizes.core_principles.html_semantics}
      2. Arquitetura CSS/Tailwind: ${diretrizes.core_principles.css_architecture}
      3. JavaScript & Qualidade: ${diretrizes.core_principles.javascript_clean_code}
      
      Restrições de Automação Globais:
      ${diretrizes.automation_restrictions.map(rule => `- ${rule}`).join('\n')}
      
      ORDEM DE AJUSTE ENVIADA PELO USUÁRIO:
      "${instrucao}"
      
      CÓDIGO ORIGINAL QUE VOCÊ DEVE MODIFICAR:
      \`\`\`astro
      ${codigoOriginal}
      \`\`\`
    `;

    // Dispara a requisição para o modelo Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let codigoLimpo = response.text.trim();
    
    // Limpeza em caso de teimosia do modelo em retornar markdown
    if (codigoLimpo.startsWith('```')) {
      codigoLimpo = codigoLimpo.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
    }

    // Grava as alterações de volta no arquivo original
    fs.writeFileSync(TARGET_FILE, codigoLimpo, 'utf-8');
    console.log('✅ Sucesso! O Gemini alterou o arquivo com precisão de pixel. Confira o resultado no seu navegador!\n');

  } catch (error) {
    console.error('\n❌ Erro durante a execução da automação:');
    console.error(error.message || error);
    console.log('');
  }
}

aplicarAjuste();