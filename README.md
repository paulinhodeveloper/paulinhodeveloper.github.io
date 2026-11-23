# paulinhodeveloper.github.io

Currículo online de Paulo Henrique Santos Borges, Analista de QA.

**Acesse:** https://paulinhodeveloper.github.io

## Decisões técnicas

- HTML semântico, sem framework e sem etapa de build
- CSS com design tokens em custom properties, tema claro e escuro e folha de impressão, para o currículo sair pronto em PDF pelo navegador
- JavaScript sem dependências, carregado com `defer`
- Acessibilidade: link para pular navegação, foco visível, contraste AA e respeito a `prefers-reduced-motion`
- SEO: metadados Open Graph e dados estruturados `schema.org/Person`

## Estrutura

```
.
├── index.html
└── assets
    ├── css/styles.css
    ├── js/main.js
    └── img/favicon.svg
```

## Rodar localmente

```bash
npx serve .
```
