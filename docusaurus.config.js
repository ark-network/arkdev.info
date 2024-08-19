// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ARK - Bitcoin Layer-Two Protocol",
  tagline:
    "Ark is a layer-two protocol designed to scale Bitcoin transactions with a shared UTXO model for cheap, fast and confidential off-chain payments.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://arkdev.info",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  organizationName: "ark-network", // Usually your GitHub org/user name.
  projectName: "arkdev.info", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  scripts: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      'data-domain': "arkdev.info",
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
        },
        blog: {
          blogTitle: "ARK - Blog",
          blogDescription:
            "Ark is a layer-two protocol designed to scale Bitcoin transactions with a shared UTXO model for cheap, fast and confidential off-chain payments.",
          postsPerPage: "ALL",
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          path: "./blog", // Add this line
          routeBasePath: "/blog",
          showReadingTime: true,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/ark-banner.png",
      metadata: [
        {
          name: "description",
          content:
            "Ark is a layer-two protocol designed to scale Bitcoin transactions with a shared UTXO model for cheap, fast and confidential off-chain payments.",
        },
        {
          property: "og:description",
          content:
            "Ark is a layer-two protocol designed to scale Bitcoin transactions with a shared UTXO model for cheap, fast and confidential off-chain payments.",
        },
        { property: "og:title", content: "ARK - Bitcoin Layer-Two Protocol" },
      ],
      navbar: {
        title: "Ark",
        logo: {
          alt: "Ark Logo",
          src: "img/ark-logo.png",
          srcDark: "img/ark-logo.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Docs",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/ark-network/ark",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        links: [
          {
            title: "LEARN",
            items: [
              {
                label: "Key Concepts",
                to: "/docs/learn/concepts",
              },
              {
                label: "Board an Ark",
                to: "/docs/learn/boarding",
              },
              {
                label: "Send Payments",
                to: "/docs/learn/payments",
              },
              {
                label: "Leave an Ark",
                to: "/docs/learn/leaving",
              },
            ],
          },
          {
            title: "DOCS",
            items: [
              {
                label: "Overview",
                to: "/docs",
              },
              {
                label: "Join an Ark",
                to: "/docs/user/intro",
              },
              {
                label: "Create an Ark",
                to: "/docs/provider/intro",
              },
            ],
          },
          {
            title: "COMMUNITY",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/5XwckYtXAG",
              },
              {
                label: "Telegram",
                href: "https://t.me/ark_network_community",
              },
              {
                label: "Stack Exchange",
                href: "https://bitcoin.stackexchange.com/questions/tagged/ark",
              },
              {
                label: "Github",
                href: "https://github.com/ark-network/ark",
              },
            ],
          },
        ],
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      prism: {
        theme: prismThemes.vsDark,
        darkTheme: prismThemes.vsDark,
        additionalLanguages: ['bash', 'diff', 'json'],
      },
    }),
};

export default config;
