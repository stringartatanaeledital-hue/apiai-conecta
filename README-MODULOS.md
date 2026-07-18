# Integração — Linha do Tempo do Serviço + Feed dos Profissionais

## 1. Schema (Convex)
Copie as tabelas de `convex/schema-adicional.ts` para dentro do seu
`convex/schema.ts` existente (dentro de `defineSchema({ ... })`).

Tabelas criadas:
- `serviceTimelineEvents` — histórico de eventos de uma ordem de serviço
- `serviceOrderStatus` — cache do status atual (consulta rápida)
- `professionalPosts` — posts do feed (foto, vídeo, antes/depois, promoção, obra)
- `professionalPostLikes` / `professionalPostComments`
- `professionalStories` — stories com expiração de 24h

Pressupõe que já existam as tabelas `serviceOrders`, `professionals` e `users`
no seu schema. Se os nomes forem diferentes, ajuste as referências `v.id(...)`.

Depois de colar, rode:
```
npx convex dev
```

## 2. Backend
Copie os arquivos para `convex/`:
- `serviceTimeline.ts`
- `professionalFeed.ts`

## 3. Frontend
Copie os arquivos para `components/`:
- `ServiceTimeline.tsx`
- `ProfessionalFeed.tsx`

Dependências necessárias (já devem estar no projeto):
```
npm install lucide-react convex
```

## 4. Uso

### Linha do tempo (dentro da página de uma ordem de serviço)
```tsx
import ServiceTimeline from "@/components/ServiceTimeline";

<ServiceTimeline orderId={order._id} />
```

Para avançar o status (ex: quando o profissional aceita o orçamento):
```tsx
const addEvent = useMutation(api.serviceTimeline.addTimelineEvent);

await addEvent({
  orderId,
  status: "aceito",
  title: "Orçamento aceito pelo cliente",
  actorRole: "cliente",
});
```

### Feed dos profissionais (nova rota, ex: `/feed`)
```tsx
import ProfessionalFeed from "@/components/ProfessionalFeed";

<ProfessionalFeed currentUserId={session.userId} />
```

Para o profissional publicar um post, use `generateUploadUrl` +
`createPost` do jeito padrão do Convex File Storage:
```tsx
const generateUploadUrl = useMutation(api.professionalFeed.generateUploadUrl);
const createPost = useMutation(api.professionalFeed.createPost);

const uploadUrl = await generateUploadUrl();
const result = await fetch(uploadUrl, {
  method: "POST",
  headers: { "Content-Type": file.type },
  body: file,
});
const { storageId } = await result.json();

await createPost({
  professionalId,
  type: "foto",
  caption: "Reforma concluída!",
  mediaStorageIds: [storageId],
});
```

## 6. Marketplace por Departamentos
- Schema: `schema-adicional-2.ts` → tabelas `marketplaceProducts`, `marketplaceOrders`
- Backend: `marketplace.ts`
- Frontend: `Marketplace.tsx`
```tsx
<Marketplace buyerId={session.userId} />
```

## 7. Empresas (cadastro de equipes)
- Schema: `companies`, `companyEmployees`, `companyVehicles`
- Backend: `empresas.ts`
- Frontend: `Empresas.tsx`
```tsx
<EmpresaCard companyId={company._id} />
```

## 8. Contratos (assinatura digital)
- Schema: `contracts`
- Backend: `contratos.ts`
- Frontend: `Contratos.tsx`
- Instale: `npm install qrcode.react`
```tsx
<ContratoCard contractId={contract._id} viewerRole="cliente" />
```
Gere o contrato com `createContract` assim que o orçamento for aceito na
linha do tempo (status "aceito"). O QR Code usa o campo `qrCodeToken` para
validação — escaneie e consulte com `getContractByToken`.

## 9. Gamificação (medalhas)
- Schema: `professionalBadges`
- Backend: `gamificacao.ts`
- Frontend: `Gamificacao.tsx`
```tsx
<BadgesRow professionalId={professional._id} />
<RankingProfissionais />
```
Chame `evaluateAutoBadges` sempre que uma ordem for concluída, passando o
total de serviços concluídos e a nota média do profissional — as medalhas
são concedidas automaticamente pelas regras definidas no backend.

## 11. Página do Profissional (portfólio)
- Schema: `schema-adicional-3.ts` → `professionalPortfolios`
- Backend: `portfolio.ts` · Frontend: `PerfilProfissional.tsx`
```tsx
<PerfilProfissional professionalId={professional._id} />
```

## 12. Área Financeira
- Schema: `financialTransactions` · Backend: `financeiro.ts` · Frontend: `Financeiro.tsx`
- Instale: `npm install recharts`
```tsx
<Financeiro ownerId={session.userId} />
```

## 13. Cursos
- Schema: `courses`, `courseEnrollments` · Backend: `cursos.ts` · Frontend: `Cursos.tsx`
```tsx
<Cursos userId={session.userId} />
```

## 14. Agenda
- Schema: `agendaEvents` · Backend: `agenda.ts` · Frontend: `Agenda.tsx`
```tsx
<Agenda ownerId={session.userId} />
```

## 15. Mapa Inteligente (camadas)
- Backend: `mapa.ts` · Frontend: `MapaInteligente.tsx`
- Plugue seu provedor de mapa real (Mapbox/Google Maps) dentro de
  `LayerMarkers` — o componente já resolve os dados de cada camada.

## 16. Aplicativo do Cliente (tela inicial)
- Frontend: `ClienteHome.tsx` (sem tabelas novas — usa as categorias existentes)
```tsx
<ClienteHome onSelectCategory={(cat) => router.push(`/buscar?categoria=${cat}`)} />
```

## 17. Central de Emergência
- Schema: `emergencyProviders` · Backend: `emergencia.ts` · Frontend: `CentralEmergencia.tsx`
```tsx
<CentralEmergencia />
```

## 18. Sistema de Fidelidade
- Schema: `loyaltyAccounts`, `loyaltyTransactions` · Backend: `fidelidade.ts` · Frontend: `Fidelidade.tsx`
```tsx
<Fidelidade userId={session.userId} />
```
Chame `addPoints` sempre que um serviço for concluído ou uma compra for feita.

## 19. Painel Analítico do Profissional
- Schema: `profileViews` · Backend: `analitico.ts` · Frontend: `PainelAnalitico.tsx`
```tsx
<PainelAnalitico professionalId={professional._id} />
```
Chame `registerView` toda vez que o perfil de um profissional for aberto,
passando a origem (`busca`, `mapa`, `feed` ou `marketplace`).

## 20. Painel Administrativo (cupons e campanhas)
- Schema: `coupons`, `campaigns` · Backend: `admin.ts` · Frontend: `PainelAdmin.tsx`
```tsx
<PainelAdmin />
```

## 21. Dependências gerais dos módulos
```
npm install lucide-react convex recharts qrcode.react
```

## 23. Barra Superior Inteligente (sem IA)
- Frontend: `TopBar.tsx`
- Busca por voz via Web Speech API do navegador (não usa backend de IA)
- Clima: use uma API pública tipo Open-Meteo (exemplo comentado no arquivo)
- CEP/localização: passe a cidade atual do usuário via prop `cityLabel`

**Fora do escopo, por depender de IA:** busca de profissional por foto e o
botão "Pergunte à IA" — ambos exigiriam um modelo de visão/linguagem.

## 24. Shell principal (AppShell) — o programa completo
- Frontend: `AppShell.tsx`
- Sidebar com navegação para os 21 itens (todos os módulos construídos +
  "Segurança do trabalho" como categoria própria)
- Junta `TopBar` + sidebar + área de conteúdo central

```tsx
"use client";
import { useState } from "react";
import AppShell, { NavKey } from "@/components/AppShell";
import Financeiro from "@/components/Financeiro";
import Marketplace from "@/components/Marketplace";
import Agenda from "@/components/Agenda";
import Cursos from "@/components/Cursos";
import CentralEmergencia from "@/components/CentralEmergencia";
import MapaInteligente from "@/components/MapaInteligente";
import PainelAdmin from "@/components/PainelAdmin";
// ...demais imports

export default function App() {
  const [activeKey, setActiveKey] = useState<NavKey>("dashboard");
  return (
    <AppShell activeKey={activeKey} onNavigate={setActiveKey} userName="Atanael Slompo" userRole="Administrador">
      {activeKey === "financeiro" && <Financeiro ownerId={userId} />}
      {activeKey === "marketplace" && <Marketplace buyerId={userId} />}
      {activeKey === "agenda" && <Agenda ownerId={userId} />}
      {activeKey === "cursos" && <Cursos userId={userId} />}
      {activeKey === "emergencia" && <CentralEmergencia />}
      {activeKey === "mapa" && <MapaInteligente />}
      {activeKey === "admin" && <PainelAdmin />}
      {/* ...demais módulos */}
    </AppShell>
  );
}
```

## 25. Visão geral — programa completo (21 módulos)
Dashboard, Clientes, Profissionais, Categorias, Segurança do trabalho,
Mapa inteligente, Agenda, Orçamentos, Contratos, Mensagens, Pagamentos,
Financeiro, Relatórios, Empresas, Marketplace, Cursos, Gamificação,
Fidelidade, Emergência 24h, Avaliações, Administrativo.

Todos sem dependência de IA — prontos para rodar no Nexus Slompo/Convex.

## 27. Taxonomia unificada de profissões (Apiaí Serviços)
- `lib/categoriasProfissoes.ts` é a fonte única de verdade — usada em 3 lugares:
  1. **Tela do cliente** (`ClienteHome.tsx`) — descobrir por categoria
  2. **Cadastro do profissional** (`CadastroProfissional.tsx`) — escolher categoria/profissão
  3. **Busca de profissionais** (`BuscarProfissionais.tsx`) — filtrar por categoria/profissão
  4. **Marketplace** (`Marketplace.tsx`) — filtro "produtos para [profissão]"

- Backend: `profissionaisBusca.ts` (`searchProfessionals`, `countBySubcategory`, `updateCategory`)
- Pressupõe que a tabela `professionals` tenha os campos `category` e
  `subcategory` (string). Se seu schema usa outros nomes, ajuste em
  `profissionaisBusca.ts`.
- No Marketplace, adicione `relatedProfession` opcional ao cadastrar um
  produto (ex: "Pintor") para ele aparecer no filtro por profissão.

Para adicionar novas profissões no futuro, edite só `DEPARTAMENTOS` em
`categoriasProfissoes.ts` — os 4 lugares acima atualizam automaticamente.

## 29. Convites gratuitos — quantidade que você quiser
Duas formas de dar acesso gratuito, sem limite de quantidade:

**A) Link de convite (com ou sem limite de vagas)**
- Schema: `schema-adicional-5.ts` → `inviteLinks`, `inviteRedemptions`
- Backend: `convites.ts` · Frontend: `ConviteCard.tsx`

Para vagas **ilimitadas**, não informe `maxUses`:
```tsx
const createInviteLink = useMutation(api.convites.createInviteLink);
await createInviteLink({
  code: "APIAI",
  benefitDescription: "Acesso Premium grátis",
  // maxUses não informado = ilimitado
});
```
Se um convite já foi criado com limite e você quiser removê-lo depois:
```tsx
await makeInviteUnlimited({ code: "APIAI50" });
```

Link para divulgar: `https://SEU_DOMINIO/convite/APIAI`
```tsx
<ConviteCard code="APIAI" baseUrl="https://apiaiservicos.com.br" currentUserId={userId} />
```

**B) Convidado direto (sem link, sem limite)** — adicione qualquer pessoa
diretamente pelo painel admin, quantas vezes quiser:
- Schema: `guestAccessGrants` · Backend: `convites.ts` (`addGuestAccess`,
  `listGuests`, `revokeGuestAccess`, `hasGuestAccess`)
- Frontend: `PainelConvidados.tsx`
```tsx
<PainelConvidados adminUserId={adminId} />
```
Use `hasGuestAccess` para checar se um usuário tem acesso gratuito antes de
cobrar qualquer taxa/assinatura dele no seu fluxo de pagamento.

## 31. Convite — só o dono decide quem usa o gratuito
Quem clica no link **não** entra sozinho — só cria uma solicitação. A
decisão de aprovar ou negar é sempre sua.

**Fluxo:**
1. Pessoa clica no link → `ConviteResgate.tsx` cria uma solicitação
   (`accessRequests`, status "pendente") e mostra "Aguardando aprovação do
   administrador"
2. Você abre `PainelConvidados.tsx` e vê a lista de solicitações pendentes
3. Clica em **Aprovar** (libera acesso gratuito) ou **Negar**
4. Se aprovado, a pessoa vê "Acesso liberado!" na próxima vez que abrir a tela

```tsx
// Tela pública, ex: /convite/[code]
<ConviteResgate code="APIAI" currentUserId={userId} />

// Painel do dono/admin
<PainelConvidados adminUserId={meuUserId} />
```

O painel também tem um atalho **"Adicionar convidado direto"** — pra quando
você já sabe quem quer liberar e não precisa esperar a pessoa clicar em
nada.

- Schema: `accessRequests` (pendente/aprovado/negado), `guestAccessGrants`
- Backend: `convites.ts` (`requestAccess`, `getMyRequestStatus`,
  `listPendingRequests`, `approveRequest`, `denyRequest`, `addGuestAccess`,
  `listGuests`, `revokeGuestAccess`, `hasGuestAccess`)

## 32. Cadastro de usuário (autenticação básica)
- Schema: `schema-adicional-6.ts` → tabela `users` (com `role`:
  cliente/profissional/empresa/admin)
- Backend: `auth.ts`
- Frontend: `CadastroUsuario.tsx`

**Importante sobre segurança:** o campo `passwordHash` pressupõe que você
gere o hash da senha (ex: bcryptjs) numa **Convex Action** antes de gravar —
nunca grave senha crua. O arquivo `CadastroUsuario.tsx` tem, comentado no
final, o exemplo de uma Action `registerWithPassword` fazendo isso direito.
Para produção, o caminho mais rápido e seguro é usar
[Convex Auth](https://labs.convex.dev/auth), Clerk ou Auth.js integrados —
eles cuidam de hash, sessão e recuperação de senha automaticamente.

```tsx
<CadastroUsuario onRegistered={(userId) => router.push("/dashboard")} />
```

## 33. Mensagens — chat direto entre cliente e profissional
- Schema: `conversations`, `chatMessages`
- Backend: `chat.ts` (conversa, envio de texto/foto, marcar como lida)
- Frontend: `ListaConversas.tsx` + `ChatJanela.tsx`

```tsx
const conversationId = useMutation(api.chat.getOrCreateConversation);
// ao clicar em "falar com profissional":
const id = await conversationId({ clientId, professionalId });

<ListaConversas userId={userId} onSelect={setConversationId} />
<ChatJanela conversationId={conversationId} currentUserId={userId} />
```

## 34. Enviar convite — você decide grátis ou pago na hora
Diferente do fluxo de aprovação (módulo 31, pra quando alguém pede acesso),
aqui é você que escolhe a pessoa e decide o modo de acesso **no ato de
enviar** — ideal pra quando é um amigo seu, por exemplo.

- Backend: `enviarConvite.ts` (`enviarConviteDireto`, `listUsersForInvite`)
- Frontend: `EnviarConvite.tsx`

```tsx
<EnviarConvite adminUserId={meuUserId} />
```
Escolhendo **"Grátis"**, a pessoa vira convidado automaticamente (mesmo
mecanismo do `guestAccessGrants`). Escolhendo **"Pago"**, ela segue o
cadastro e cobrança normal — nada é criado, simplesmente não recebe
nenhum benefício especial.

## 35. Marcenarias e galeria de serviços com fotos
- **Categoria "Marcenaria"** adicionada em `categoriasProfissoes.ts`, com
  serviços específicos: móveis planejados, guarda-roupa sob medida, cozinha
  planejada, portas e janelas de madeira, restauração, marcenaria rústica,
  escadas e corrimãos
- Schema: `serviceGalleryItems` (fotos + título + descrição + preço)
- Backend: `galeriaServicos.ts`
- Frontend: `GaleriaServicos.tsx` — exporta dois componentes:
  - `GaleriaDoProfissional` — trabalhos de UM profissional/marcenaria
    específico (usar na página de perfil dele)
  - `VitrineDaCategoria` — todos os trabalhos de uma categoria (ex: todas
    as marcenarias da região), pra usar numa página de busca/categoria

```tsx
<GaleriaDoProfissional ownerId={marcenariaId} />
<VitrineDaCategoria category="Marcenaria" />
```
Serve pra qualquer profissão que queira mostrar fotos do trabalho, não só
marcenaria — basta usar a mesma categoria ao cadastrar (`addGalleryItem`).

## 37. Login + Sessão
- Backend: `auth.ts` (`getUserForLogin`)
- Contexto: `lib/SessionContext.tsx` — envolva o app uma vez no layout
  principal com `<SessionProvider>`, depois use `useSession()` em qualquer
  componente pra saber quem está logado
- Frontend: `Login.tsx`

```tsx
// app/layout.tsx
import { SessionProvider } from "@/lib/SessionContext";
<SessionProvider>{children}</SessionProvider>

// Qualquer componente
const { user, login, logout } = useSession();
```

**Lembrete de segurança:** a comparação de senha no `Login.tsx` é um
placeholder. Troque pela chamada de uma Convex Action com
`bcrypt.compare()` antes de considerar o login válido (exemplo comentado em
`CadastroUsuario.tsx`).

## 38. Solicitar Serviço (primeiro pedido do cliente)
- Schema: `schema-adicional-7.ts` → `serviceOrders` (a Linha do Tempo já
  existente usa o `_id` desta tabela como `orderId`)
- Backend: `solicitarServico.ts` (criação do pedido + primeiro evento
  "solicitado" na linha do tempo automaticamente)
- Frontend: `SolicitarServico.tsx`

```tsx
<SolicitarServico clientId={userId} onCreated={(orderId) => router.push(`/pedido/${orderId}`)} />
```
Profissionais usam `listOpenOrdersBySubcategory` pra ver pedidos abertos da
profissão deles e `assignProfessional` pra aceitar atender.

## 39. Avaliações
- Schema: `reviews`
- Backend: `avaliacoes.ts`
- Frontend: `Avaliacoes.tsx` — exporta `AvaliarServico` (formulário) e
  `ListaAvaliacoes` (exibição com nota média)

```tsx
<AvaliarServico orderId={orderId} clientId={clientId} professionalId={professionalId} />
<ListaAvaliacoes professionalId={professionalId} />
```

## 40. Categorias (painel admin)
- Schema: `customCategories`
- Backend: `adminCategoriasClientes.ts`
- Frontend: `PainelCategorias.tsx` — adicione profissões extras a qualquer
  departamento sem tocar em código

```tsx
<PainelCategorias adminUserId={adminId} />
```

## 41. Clientes (painel admin)
- Backend: `adminCategoriasClientes.ts` (`listClients`)
- Frontend: `PainelClientes.tsx`

```tsx
<PainelClientes />
```

## 42. Configurações
- Frontend: `Configuracoes.tsx` — editar nome/telefone/cidade e sair da conta
```tsx
<Configuracoes userId={userId} />
```

## 43. Busca conectada
- Frontend: `ResultadosBusca.tsx` — liga a busca do `TopBar` a resultados reais
```tsx
const [searchQuery, setSearchQuery] = useState("");
<TopBar onSearch={setSearchQuery} ... />
{searchQuery && <ResultadosBusca query={searchQuery} />}
```

## 44. Ciclo completo agora fecha assim:
Cadastro → Login → Cliente solicita serviço → Profissional aceita (Linha do
Tempo avança) → Contrato → Serviço concluído → Cliente avalia → Profissional
ganha medalha (Gamificação) se atingir os critérios.

## 45. O que ainda é opcional (não crítico)
- Convex Auth/Clerk de verdade no lugar do hash placeholder
- Pagamento real (você decidiu que por enquanto é tudo gratuito)
- Relatórios em PDF/Excel
- Notificações push

## 47. Auditoria — o que estava errado e foi corrigido
Fiz uma revisão completa de todos os módulos e encontrei 2 problemas reais:

1. **Duas tabelas de profissional conflitando.** Os primeiros módulos
   (Timeline, Feed, Contratos, Gamificação, Portfólio, Painel Analítico,
   Mapa, Busca) foram feitos referenciando uma tabela `"professionals"`
   separada — mas quando construí o Cadastro/Login depois, criei tudo em
   cima de uma única tabela `"users"` (com `role: "profissional"`). Ou
   seja, um profissional cadastrado pelo `CadastroUsuario` não apareceria
   em nenhum desses módulos antigos, porque eles esperavam um ID de uma
   tabela que nunca seria populada. **Corrigido:** unifiquei tudo pra usar
   `"users"` com `role: "profissional"` — adicionei os campos `category` e
   `subcategory` na tabela `users` (schema-adicional-6.ts) e ajustei todas
   as queries afetadas (`profissionaisBusca.ts`, `mapa.ts`, `admin.ts`, e
   os tipos `Id<...>` em vários componentes).

2. **Componente órfão quebrado.** `ConviteCard.tsx` chamava
   `api.convites.redeemInvite`, uma função que não existe mais — ela foi
   substituída pelo fluxo de solicitação/aprovação (`requestAccess` +
   `approveRequest`) quando você pediu pra só o dono decidir quem usa o
   gratuito. Se alguém tentasse usar esse componente, dava erro na hora.
   **Corrigido:** removi o arquivo (o substituto é `ConviteResgate.tsx`,
   que já está correto).

3. **Tabela `inviteRedemptions` órfã no schema**, sem nenhuma função usando
   ela mais (sobrou de uma versão anterior do fluxo de convite).
   **Corrigido:** removida do `schema-adicional-5.ts`.

## 48. Pontos de atenção que ainda merecem seu cuidado (não são bugs, mas pendências de configuração)
- **Hash de senha:** o cadastro/login usam um placeholder
  (`HASH_DE:senha`) só pra mostrar a estrutura. Antes de ir pra produção,
  troque pela Convex Action com bcrypt (exemplo já está comentado em
  `CadastroUsuario.tsx`) ou migre pra Convex Auth/Clerk.
- **Mapa Inteligente:** os profissionais precisam ter `latitude` e
  `longitude` preenchidos (campos opcionais, não adicionei ainda na tabela
  `users` — é só incluir se for usar o mapa de verdade).
- **`sellerId` do Marketplace e `ownerId` da Galeria de Serviços** já usam
  `"users"` desde o início, então não precisaram de ajuste.

## 49. Próximos passos sugeridos
- Adicionar índice `by_professional` + filtro por categoria na Home
- Adicionar notificação push quando um novo evento é criado na timeline
- Adicionar moderação simples de posts (flag de conteúdo impróprio) no painel admin
