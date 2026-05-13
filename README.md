Um projeto com um design de elite como o **DIMBO DC** precisa de uma documentação que esteja à altura. Vamos transformar esse README padrão em algo que respire profissionalismo, tecnologia e organização.

Aqui está uma versão otimizada, visualmente rica e pronta para o teu repositório:

---

````markdown
# 💎 DIMBO DC — Sistema de Gestão Inteligente

<p align="center">
  <img src="https://raw.githubusercontent.com/lucis/lucis/master/assets/logo.png" alt="DIMBO DC Logo" width="80" />
</p>

<p align="center">
  <strong>O coração da faturação digital e gestão de stock para o mercado angolano.</strong>
  <br />
  Construído com Next.js 16, Tailwind CSS 4 e uma arquitetura de segurança de elite.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Shadcn_UI-v2-black?style=for-the-badge" />
</p>

---

## ✨ Características de Elite

O **DIMBO DC** não é apenas um ERP; é uma experiência de alta performance:

- **🎨 Design de Próxima Geração**: Interface baseada em _Glassmorphism_ com suporte nativo a Dark/Light mode via `next-themes`.
- **🔐 Segurança Robusta**: Autenticação stateless via JWT com armazenamento de dados sensíveis criptografados em **AES-256**.
- **⚡ Performance Extrema**: Renderização híbrida utilizando o potencial do Next.js e animações fluidas com Framer Motion.
- **🛠️ Tech Stack Moderna**:
  - **Frontend**: React 19 + Next.js 16 (App Router)
  - **Estilização**: Tailwind CSS 4 + Shadcn/UI (OKLCH Colors)
  - **Formulários**: React Hook Form + Zod (Validação estrita)
  - **Comunicação**: Axios + Interceptors para renovação de tokens.

---

## 🚀 Como Começar

### Pré-requisitos

- Node.js 20.x ou superior
- NPM ou PNPM

### Instalação

1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-utilizador/dimbo-dc.git](https://github.com/seu-utilizador/dimbo-dc.git)
   ```
````

2. Instale as dependências:

```bash
npm install

```

3. Configure as variáveis de ambiente (.env.local):

```env
NEXT_PUBLIC_API_URL=[http://seu-backend-django.com/api](http://seu-backend-django.com/api)
NEXT_PUBLIC_CRYPTO_KEY=sua_chave_aes_secreta

```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev

```

A aplicação estará disponível em `http://localhost:3000`.

---

## 📂 Estrutura do Projeto

```text
src/
├── app/              # Rotas e Layouts (App Router)
├── components/       # Componentes de UI e Lógica Visual
│   ├── ui/           # Componentes base (Shadcn)
│   └── shared/       # Componentes reutilizáveis (Sidebar, Navbar)
├── providers/        # Contextos (Auth, Theme)
├── services/         # Configurações de API (Axios)
├── hooks/            # Hooks personalizados
└── lib/              # Utilitários (Criptografia, Zod Schemas)

```

---

## 🛠️ Scripts Disponíveis

- `npm run dev`: Inicia o ambiente de desenvolvimento com Turbopack.
- `npm run build`: Cria a versão de produção otimizada.
- `npm run start`: Inicia o servidor em modo de produção.
- `npm run lint`: Executa a verificação de código.

---

## 🇦🇴 Orgulhosamente desenvolvido para Angola

O DIMBO DC foi desenhado para responder às necessidades específicas de faturação e gestão das unidades de negócio locais, garantindo rapidez, segurança de dados e conformidade.

---

---

### O que mudou neste README:

1. **Visual Profissional**: Adição de Badges que mostram a Tech Stack atualizada (Next 16, Tailwind 4).
2. **Destaque Técnico**: Menciona explicitamente a criptografia AES-256 e as cores OKLCH, o que valoriza o teu trabalho perante outros devs ou investidores.
3. **Clareza**: Explica como configurar o `.env` (essencial para a chave de criptografia que criámos).
4. **Estrutura**: Mostra a organização das pastas, o que ajuda muito na manutenção futura.
