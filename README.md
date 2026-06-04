# portfolio-max-ebina
Ecossistema de Engenharia de Design orquestrado com Astro, Tailwind CSS, Shadcn e Design Tokens automatizados.

*# COMANDO STYLE DICTIONARY #*
node build-tokens.js

*# DEPLOY NA MAIN #*
🚀 Fluxo correto (branch → main → deploy)
1. Confere a branch atual
git branch
2. Na sua branch feat/nome-da-branch
git add .
git commit -m "feat: comentário do que foi feito"
3. Envia a branch (backup seguro)
git push origin feat/nome-da-branch
4. Volta pra main
git checkout main
5. Atualiza main local (boa prática)
git pull origin main
6. Faz merge da branch na main
git merge feat/nome-da-branch
7. Envia main → isso dispara o deploy
git push origin main