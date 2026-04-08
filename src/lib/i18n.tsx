"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "pt" | "en";

const translations = {
  header: {
    about: { pt: "Sobre", en: "About" },
    services: { pt: "Serviços", en: "Services" },
    work: { pt: "Trabalhos", en: "Work" },
    contact: { pt: "Contato", en: "Contact" },
    cta: { pt: "Fale comigo", en: "Let's talk" },
    menuLabel: { pt: "Abrir menu", en: "Open menu" },
  },
  hero: {
    tagline: {
      pt: "Enquanto você procura um designer, um dev e um especialista em IA — eu já estou entregando os três.",
      en: "While you're looking for a designer, a dev and an AI specialist — I'm already delivering all three.",
    },
  },
  about: {
    label: { pt: "Sobre", en: "About" },
    heading1: {
      pt: "Diretor de arte de formação,",
      en: "Art director by training,",
    },
    heading2: {
      pt: "desenvolvedor por obsessão.",
      en: "developer by obsession.",
    },
    p1: {
      pt: "Já passei por grandes marcas do varejo, agências e estúdios. Hoje crio projetos do zero ao deploy — marca, sistema, produto digital, inteligência artificial. Tudo junto, uma pessoa só.",
      en: "I've worked with major retail brands, agencies and studios. Today I build projects from zero to deploy — brand, system, digital product, artificial intelligence. All together, one person.",
    },
    p2: {
      pt: "Enquanto o mercado separa design, código e estratégia em profissionais diferentes, eu junto tudo. O resultado é mais rápido, mais coeso e com uma visão que nenhum time fragmentado consegue ter.",
      en: "While the market splits design, code and strategy across different professionals, I bring it all together. The result is faster, more cohesive, and with a vision no fragmented team can match.",
    },
    stat1: { pt: "Projetos Entregues", en: "Projects Delivered" },
    stat2: { pt: "Anos de Experiência", en: "Years Experience" },
    stat3: { pt: "Países Atendidos", en: "Countries Served" },
  },
  services: {
    label: { pt: "Serviços", en: "Services" },
    heading: { pt: "O que eu", en: "What I" },
    headingAccent: { pt: "construo", en: "build" },
    more: { pt: "Mais", en: "More" },
    less: { pt: "Menos", en: "Less" },
    s1: {
      title: { pt: "Marca & Web", en: "Brand & Web" },
      description: {
        pt: "Identidade visual, logos, design systems. Landing pages, sites institucionais, e-commerce. UI/UX que converte.",
        en: "Visual identity, logos, design systems. Landing pages, institutional sites, e-commerce. UI/UX that converts.",
      },
      details: {
        pt: ["Identidade Visual & Logos", "Design Systems", "Landing Pages & Sites", "E-commerce", "UI/UX Design"],
        en: ["Visual Identity & Logos", "Design Systems", "Landing Pages & Sites", "E-commerce", "UI/UX Design"],
      },
    },
    s2: {
      title: { pt: "Sistemas & Apps", en: "Systems & Apps" },
      description: {
        pt: "Dashboards, plataformas SaaS, painéis admin. Integrações com pagamento, WhatsApp, APIs. Frontend + backend + banco + deploy.",
        en: "Dashboards, SaaS platforms, admin panels. Payment, WhatsApp, API integrations. Frontend + backend + database + deploy.",
      },
      details: {
        pt: ["Plataformas SaaS", "Dashboards Admin", "Integração de Pagamentos", "WhatsApp Cloud API", "Desenvolvimento Fullstack"],
        en: ["SaaS Platforms", "Admin Dashboards", "Payment Integration", "WhatsApp Cloud API", "Fullstack Development"],
      },
    },
    s3: {
      title: { pt: "IA & Automação", en: "AI & Automation" },
      description: {
        pt: "Agentes autônomos, chatbots inteligentes, workflows automatizados. Integração de IA em produtos existentes.",
        en: "Autonomous agents, intelligent chatbots, automated workflows. AI integration into existing products.",
      },
      details: {
        pt: ["Agentes IA (Claude, OpenAI)", "Chatbots Inteligentes", "Workflows Automatizados", "Integração de IA em Produtos", "Soluções LLM Customizadas"],
        en: ["AI Agents (Claude, OpenAI)", "Intelligent Chatbots", "Automated Workflows", "AI Product Integration", "Custom LLM Solutions"],
      },
    },
    s4: {
      title: { pt: "Web3 & Crypto", en: "Web3 & Crypto" },
      description: {
        pt: "Launch pages pra projetos crypto, dashboards on-chain, tokenomics UI. Comunidade e marketing visual.",
        en: "Launch pages for crypto projects, on-chain dashboards, tokenomics UI. Community and visual marketing.",
      },
      details: {
        pt: ["Launch Pages Crypto", "Dashboards On-chain", "Tokenomics UI", "Interfaces DeFi", "Marketing de Comunidade"],
        en: ["Crypto Launch Pages", "On-chain Dashboards", "Tokenomics UI", "DeFi Interfaces", "Community Marketing"],
      },
    },
    sales: {
      label: { pt: "05 — TUDO CONVERGE PRA CÁ", en: "05 — EVERYTHING LEADS HERE" },
      title: { pt: "Estratégia &", en: "Strategy &" },
      titleAccent: { pt: "Vendas", en: "Sales" },
      description: {
        pt: "Marca bonita que não vende é portfolio de designer. Sistema incrível que não converte é hobby de programador. Tudo que eu construo tem um único objetivo final:",
        en: "A beautiful brand that doesn't sell is a designer's portfolio piece. An amazing system that doesn't convert is a programmer's hobby. Everything I build has one ultimate goal:",
      },
      descriptionAccent: {
        pt: "fazer o cliente vender mais",
        en: "make the client sell more",
      },
      items: {
        pt: [
          { title: "Plano Estratégico", text: "Análise de mercado, posicionamento, funil de vendas e plano de ação com metas claras." },
          { title: "Treinamento de Equipe", text: "Capacito seu time pra vender usando as ferramentas e sistemas que construí junto." },
          { title: "Funil Completo", text: "Da atração ao fechamento — landing page, automação, CRM, remarketing, tudo integrado." },
          { title: "E-commerce & Conversão", text: "Loja otimizada pra vender, não só pra existir. UX de compra, checkout, upsell." },
          { title: "Marketing Digital", text: "Estratégia de conteúdo, social media, tráfego pago e orgânico alinhados à marca." },
          { title: "Métricas & Dados", text: "Dashboards de performance, analytics customizados, decisões baseadas em dados reais." },
        ],
        en: [
          { title: "Strategic Planning", text: "Market analysis, positioning, sales funnel and action plan with clear goals." },
          { title: "Team Training", text: "I train your team to sell using the tools and systems I built with you." },
          { title: "Full Funnel", text: "From attraction to closing — landing page, automation, CRM, remarketing, all integrated." },
          { title: "E-commerce & Conversion", text: "Store optimized to sell, not just exist. Purchase UX, checkout, upsell." },
          { title: "Digital Marketing", text: "Content strategy, social media, paid and organic traffic aligned with the brand." },
          { title: "Metrics & Data", text: "Performance dashboards, custom analytics, decisions based on real data." },
        ],
      },
      footer: {
        pt: "Design + Código + IA + Estratégia =",
        en: "Design + Code + AI + Strategy =",
      },
      footerAccent: { pt: "Venda", en: "Sales" },
    },
  },
  cases: {
    label: { pt: "Trabalhos Selecionados", en: "Selected Work" },
    heading: { pt: "Cases", en: "Cases" },
    subtitle: {
      pt: "De Londres ao Brasil, de cerveja artesanal a crypto — arte, branding e tecnologia no mesmo lugar.",
      en: "From London to Brazil, from craft beer to crypto — art, branding and technology in one place.",
    },
    viewProject: { pt: "Ver Projeto", en: "View Project" },
    prev: { pt: "Anterior", en: "Previous" },
    next: { pt: "Próxima", en: "Next" },
    projects: [
      {
        title: "Kokokotsu",
        type: { pt: "Branding Completo — Londres", en: "Full Branding — London" },
        description: {
          pt: "Identidade visual completa para marca londrina. Logo, tipografia, sistema de cores, guidelines e aplicações. Direção de arte do conceito à entrega final.",
          en: "Complete visual identity for a London-based brand. Logo, typography, color system, guidelines and applications. Art direction from concept to final delivery.",
        },
      },
      {
        title: "Content Creative Vodka",
        type: { pt: "Branding de Produto — Itália / Reino Unido", en: "Product Branding — Italy / UK" },
        description: {
          pt: "Identidade e packaging para marca premium de vodka. Label, garrafa, sistema visual completo posicionado no mercado luxury europeu.",
          en: "Identity and packaging for a premium vodka brand. Label, bottle, complete visual system positioned in the European luxury market.",
        },
      },
      {
        title: "For F*ck's Shake",
        type: { pt: "Branding Bold — Londres", en: "Bold Branding — London" },
        description: {
          pt: "Marca com atitude e personalidade forte. Direção de arte irreverente que quebra padrões — do conceito visual ao tom de voz.",
          en: "A brand with attitude and strong personality. Irreverent art direction that breaks patterns — from visual concept to tone of voice.",
        },
      },
      {
        title: "Gato Preto",
        type: { pt: "Branding Cervejaria — Brasil", en: "Brewery Branding — Brazil" },
        description: {
          pt: "Identidade visual para cerveja artesanal brasileira. Ilustração, rótulo, packaging e universo visual da marca com personalidade forte.",
          en: "Visual identity for a Brazilian craft beer. Illustration, label, packaging and brand visual universe with strong personality.",
        },
      },
      {
        title: "Moda Fitness",
        type: { pt: "Branding Vestuário — Brasil", en: "Fashion Branding — Brazil" },
        description: {
          pt: "Marca para loja virtual de moda fitness com posicionamento premium. Identidade visual sofisticada para um público refinado.",
          en: "Brand for a premium fitness fashion e-commerce. Sophisticated visual identity for a refined audience.",
        },
      },
      {
        title: "Viralata Finance ($REAU)",
        type: { pt: "Web3 Site + Branding — Brasil / Global", en: "Web3 Site + Branding — Brazil / Global" },
        description: {
          pt: "Site completo para token na BSC. Ilustrações custom, scroll animations, tokenomics interativo, leaderboard, staking, NFTs. Comunidade de milhares de holders.",
          en: "Complete site for a BSC token. Custom illustrations, scroll animations, interactive tokenomics, leaderboard, staking, NFTs. Community of thousands of holders.",
        },
      },
      {
        title: "SABAI (สบาย)",
        type: { pt: "Brand + Cosméticos — Brasil / Tailândia", en: "Brand + Cosmetics — Brazil / Thailand" },
        description: {
          pt: "Marca brasileira de cosméticos importados da Tailândia. Identidade visual completa, design system, direção de packaging e estratégia de e-commerce.",
          en: "Brazilian cosmetics brand imported from Thailand. Complete visual identity, design system, packaging direction and e-commerce strategy.",
        },
      },
      {
        title: "Boteco da Estação",
        type: { pt: "Plataforma Fullstack + Pagamentos", en: "Fullstack Platform + Payments" },
        description: {
          pt: "Plataforma digital para bar/restaurante com pedidos online, integração Mercado Pago e automação via WhatsApp Cloud API.",
          en: "Digital platform for bar/restaurant with online ordering, Mercado Pago integration and WhatsApp Cloud API automation.",
        },
      },
      {
        title: "Caramelo ($CARA)",
        type: { pt: "Agente IA + Web3", en: "AI Agent + Web3" },
        description: {
          pt: "Agente autônomo de IA na Solana com state machine emocional, memória vetorial e monitoramento on-chain. Sucessor do Viralata Finance.",
          en: "Autonomous AI agent on Solana with emotional state machine, vector memory and on-chain monitoring. Successor to Viralata Finance.",
        },
      },
    ],
  },
  stack: {
    label: { pt: "Stack", en: "Stack" },
    heading: { pt: "Ferramentas do", en: "Tools of the" },
    headingAccent: { pt: "ofício", en: "trade" },
  },
  quote: {
    text: {
      pt: "Eu construo seu produto inteiro enquanto sua agência ainda está escrevendo a proposta.",
      en: "I'll build your entire product while your agency is still writing the proposal.",
    },
  },
  contact: {
    label: { pt: "Contato", en: "Contact" },
    heading1: { pt: "Vamos construir", en: "Let's build" },
    heading2: { pt: "algo juntos", en: "something" },
    name: { pt: "Seu nome", en: "Your name" },
    email: { pt: "Seu email", en: "Your email" },
    message: { pt: "Conte sobre seu projeto", en: "Tell me about your project" },
    required: { pt: "Obrigatório", en: "Required" },
    emailError: { pt: "Email válido obrigatório", en: "Valid email required" },
    submit: { pt: "Enviar Mensagem", en: "Send Message" },
    or: { pt: "ou", en: "or" },
    sent: { pt: "Mensagem enviada!", en: "Message sent!" },
    sentSub: { pt: "Retorno em breve.", en: "I'll get back to you soon." },
  },
  footer: {
    tagline: { pt: "Arte × Código × IA", en: "Art × Code × AI" },
    backToTop: { pt: "Voltar ao topo", en: "Back to top" },
    builtWith: { pt: "Feito com Next.js, café e Claude.", en: "Built with Next.js, caffeine, and Claude." },
  },
} as const;

type Translations = typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: "pt",
  setLang: () => {},
  t: translations,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
