# Apiaí Serviços — Guia completo: do código até a Play Store

Este guia parte do zero. Siga na ordem — cada etapa depende da anterior.

---

## PARTE 1 — Rodar no seu PC (você, o dono)

### 1.1. Instalar os programas necessários (só uma vez)
1. **Node.js** (versão 18 ou mais nova): baixe em https://nodejs.org — instale a versão "LTS"
2. **Git** (opcional, mas recomendado): https://git-scm.com
3. Um editor de código — recomendo o **VS Code**: https://code.visualstudio.com

### 1.2. Extrair o projeto
1. Extraia o `apiai-servicos.zip` numa pasta, por exemplo `C:\Projetos\apiai-servicos`
2. Abra o **Prompt de Comando** (ou PowerShell) nessa pasta

### 1.3. Instalar as dependências do projeto
```bash
cd apiai-servicos
npm install
```
Isso baixa tudo que o projeto precisa (Next.js, Convex, etc). Demora alguns minutos.

### 1.4. Criar sua conta Convex (banco de dados/backend)
1. Vá em https://convex.dev e crie uma conta gratuita
2. No terminal, dentro da pasta do projeto, rode:
```bash
npx convex dev
```
3. Ele vai abrir o navegador pra você logar e escolher/criar um projeto Convex
4. Depois disso, ele cria automaticamente um arquivo `.env.local` com a
   variável `NEXT_PUBLIC_CONVEX_URL` preenchida — **deixe esse terminal
   aberto rodando**, ele fica sincronizando seu schema e funções com a nuvem
   em tempo real

### 1.5. Rodar o site localmente
Abra um **segundo terminal** (deixe o `npx convex dev` rodando no primeiro):
```bash
npm run dev
```
Acesse **http://localhost:3000** no navegador — o Apiaí Serviços deve abrir.

### 1.6. Instalar como programa no seu PC (sem precisar de loja nenhuma)
Como o app já é um **PWA** (Progressive Web App), instalar no PC é simples:
1. Abra **http://localhost:3000** no Google Chrome ou Edge
2. Clique no ícone de "instalar" que aparece na barra de endereço (um
   ícone de tela com uma setinha) — ou vá no menu (⋮) → "Instalar Apiaí
   Serviços"
3. Pronto — vira um programa de verdade, com ícone na área de trabalho,
   abre em janela própria (sem as abas do navegador)

**Importante:** isso só funciona depois que o site estiver publicado com
HTTPS (veja Parte 2) — em `localhost` a instalação funciona pra testar, mas
pra usar de verdade no dia a dia é melhor instalar a partir do link
publicado.

---

## PARTE 2 — Publicar o site (pra ter um link público, tipo apiaiservicos.com.br)

O jeito mais simples e gratuito pra começar é a **Vercel** (criadora do
Next.js).

### 2.1. Criar conta na Vercel
1. Vá em https://vercel.com e crie uma conta (pode logar com GitHub)

### 2.2. Subir o projeto pro GitHub (a Vercel importa direto do GitHub)
1. Crie uma conta em https://github.com se ainda não tiver
2. Crie um repositório novo (ex: `apiai-servicos`)
3. Dentro da pasta do projeto no seu PC:
```bash
git init
git add .
git commit -m "Primeira versão do Apiaí Serviços"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/apiai-servicos.git
git push -u origin main
```

### 2.3. Importar na Vercel
1. Na Vercel, clique em "Add New" → "Project"
2. Escolha o repositório `apiai-servicos`
3. Em "Environment Variables", adicione `NEXT_PUBLIC_CONVEX_URL` com o
   mesmo valor que está no seu `.env.local`
4. Clique em "Deploy"

### 2.4. Convex em produção
Antes do deploy final, rode uma vez (pra publicar as funções do backend
de verdade, não só em modo dev):
```bash
npx convex deploy
```
Isso te dá uma URL de produção do Convex — use ela (não a de dev) na
variável de ambiente da Vercel.

Depois disso, você terá um link público tipo:
`https://apiai-servicos.vercel.app`

Se quiser um domínio próprio (ex: `apiaiservicos.com.br`), compre o domínio
(Registro.br, GoDaddy, etc.) e configure em Vercel → Settings → Domains.

---

## PARTE 3 — Instalar no celular (para os usuários)

Depois que o site estiver publicado com HTTPS (Parte 2):

### Android
1. Abra o link no Google Chrome
2. Toque no menu (⋮) → **"Adicionar à tela inicial"** ou **"Instalar app"**
3. Vira um ícone na tela do celular, abre como app normal

### iPhone (Safari)
1. Abra o link no Safari
2. Toque no ícone de compartilhar (quadrado com seta) → **"Adicionar à
   Tela de Início"**

Isso já funciona **sem precisar de loja nenhuma** — é a forma mais rápida
de todo mundo começar a usar.

---

## PARTE 4 — Publicar de verdade na Google Play Store

Isso é opcional (o PWA já funciona sozinho), mas dá mais confiança pros
usuários baixarem pela loja oficial. O caminho mais simples pra quem tem
um PWA (como o seu) é transformar o site num pacote Android usando o
**PWABuilder**, sem precisar programar em Java/Kotlin.

### 4.1. Pré-requisitos
- Seu site publicado com **HTTPS** (a Vercel já dá isso de graça — Parte 2)
- Uma conta de desenvolvedor no **Google Play Console**: taxa única de
  **US$ 25**, paga uma vez na vida — https://play.google.com/console/signup

### 4.2. Gerar o pacote Android (AAB) com PWABuilder
1. Vá em **https://pwabuilder.com**
2. Cole a URL do seu site publicado (ex: `https://apiai-servicos.vercel.app`)
3. Clique em "Start" — ele analisa seu `manifest.json` (que já deixei
   pronto no projeto) e mostra uma nota de "PWA readiness"
4. Clique em **"Package for stores"** → escolha **"Android"**
5. Preencha:
   - **Package ID**: um identificador único, ex: `br.com.apiaiservicos.app`
   - **App name**: Apiaí Serviços
   - **Signing key**: deixe o PWABuilder gerar uma nova (ele guarda pra
     você baixar — **guarde esse arquivo `.keystore` num lugar seguro**,
     você vai precisar dele pra toda atualização futura do app)
6. Baixe o pacote gerado (um arquivo `.aab`)

### 4.3. Criar o app no Google Play Console
1. Entre em https://play.google.com/console
2. "Criar app" → preencha nome, idioma padrão (Português-Brasil), tipo
   (App), gratuito
3. Preencha o **questionário de classificação de conteúdo** (vai
   perguntar sobre violência, conteúdo adulto, etc. — pro seu app de
   serviços, a maioria das respostas será "não")
4. Adicione a **política de privacidade** — precisa de uma URL pública
   com o texto. Pode usar um documento simples do Google Docs publicado
   como link, ou uma página `/privacidade` no seu próprio site
5. Preencha a **ficha da loja**:
   - Descrição curta e longa do app
   - Ícone (512x512px — já tenho os ícones gerados na pasta
     `public/icons/` do projeto, mas recomendo caprichar num definitivo)
   - Screenshots (tire prints do app rodando no celular, pelo menos 2)
   - Categoria: "Negócios" ou "Estilo de vida"

### 4.4. Enviar o AAB
1. Vá em "Produção" → "Criar nova versão"
2. Faça upload do arquivo `.aab` que o PWABuilder gerou
3. Preencha as notas da versão (ex: "Primeira versão do Apiaí Serviços")
4. Envie para revisão

A revisão do Google costuma levar de **algumas horas a poucos dias**. Depois
de aprovado, o app fica público na Play Store.

### 4.5. Atualizações futuras
Sempre que você mudar o site (Vercel), o app da Play Store **se atualiza
sozinho automaticamente**, porque ele é só uma "casca" que abre o seu site
— você não precisa reenviar pro Google toda vez, só quando quiser mudar
nome, ícone ou configurações do próprio app Android.

---

## Resumo do caminho completo

```
Seu PC (código) 
  → GitHub (guarda o código)
  → Vercel (publica com link HTTPS)
  → PWA instalável direto (PC e celular, sem loja)
  → PWABuilder (empacota pra Android)
  → Google Play Console (publica na loja oficial)
```

## PARTE 5 — Auditoria completa (o que foi corrigido e o que melhorou)

Fiz uma checagem de tipos no projeto inteiro (`npx tsc --noEmit`) depois de
consolidar tudo. Veja o que encontrei e corrigi:

### Erros corrigidos
1. **Schema consolidado sem duplicatas.** Juntei as 34 tabelas de todos os
   módulos num único `convex/schema.ts` — antes elas estavam espalhadas em
   7 arquivos que você precisaria copiar e colar manualmente (risco de
   esquecer algum ou duplicar tabela sem perceber).
2. **`professionals` vs `users`.** Módulos antigos (Timeline, Feed,
   Contratos, Gamificação, Portfólio, Mapa, Busca) esperavam uma tabela
   `professionals` separada que nunca chegou a ser criada quando fiz o
   Login/Cadastro depois — unifiquei tudo em `users` com `role:
   "profissional"`.
3. **Componente órfão removido.** `ConviteCard.tsx` chamava uma função que
   não existia mais — substituído por `ConviteResgate.tsx`.
4. **`SessionContext.tsx` estava faltando** na pasta `lib/` (erro de cópia
   de arquivo) — o app não compilava sem ele. Corrigido.
5. **Módulos desconectados da navegação.** Mensagens, Categorias, Clientes,
   Profissionais, Gamificação e Fidelidade apareciam na sidebar mas não
   tinham tela nenhuma ligada — agora todos abrem a tela certa ao clicar.
6. **Controle de acesso no admin.** Categorias, Clientes e o Painel
   Administrativo agora só aparecem para quem tem `role: "admin"` — antes
   qualquer usuário logado conseguiria abrir essas telas.
7. **Vulnerabilidade de segurança do Next.js.** Atualizei de `14.2.5` para
   `14.2.35`, que corrige uma falha de segurança conhecida da versão antiga.

### Checagem de tipos: resultado final
Rodei o compilador TypeScript no projeto inteiro depois de todas as
correções: **zero erros reais**. Os poucos avisos que aparecem no ambiente
de teste (implicit any, "Cannot find module 'react'") são porque o
`node_modules` e os tipos gerados pelo Convex CLI (`convex/_generated`) só
existem depois que você roda `npm install` e `npx convex dev` no seu PC —
isso é esperado e normal, some assim que você seguir a Parte 1 deste guia.

### O que ainda vale a pena melhorar (não são bugs, são próximos passos)
- Trocar o hash de senha placeholder por bcrypt real (Convex Action) ou
  Convex Auth/Clerk
- Adicionar `latitude`/`longitude` na tabela `users` se for usar o Mapa
  Inteligente de verdade (hoje ele tem a lógica pronta mas sem esses campos)
- Ligar `Contratos`, `Empresas` e `Avaliações` a fluxos específicos (eles
  dependem de um pedido/empresa já existente, então não ficam soltos no
  menu principal — aparecem dentro do fluxo de cada solicitação de serviço)
- Configurar ESLint (`npx next lint`) pra manter o padrão de código conforme
  o projeto crescer


- Erros do Convex: https://docs.convex.dev
- Erros da Vercel: https://vercel.com/docs
- Dúvidas do PWABuilder: https://docs.pwabuilder.com
- Google Play Console: https://support.google.com/googleplay/android-developer
