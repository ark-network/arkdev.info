---
description: Detailed information about the protocol, guidance on providing liquidity, and instructions on how to efficiently spend your coins off-chain in a secure manner
sidebar_position: 1
slug: /
title: Introduction
---

:::info
🚧 **Work in progress**
The current Ark implementation requires [Elements introspection opcodes](https://github.com/ElementsProject/elements/blob/master/doc/tapscript_opcodes.md).
For the covenant-less version, code-named **clArk**, please check out the [clArk GitHub repository](https://github.com/ark-network/clArk).
:::

<div align="center">
  <img src="/img/ark-banner.png" alt="Noah designing the ark to onboard Bitcoin users"/>
</div>

### 🤔 Why Ark?

Bitcoin is the world's most secure and censorship-resistant blockchain. However, it's not the fastest or the cheapest. Ark is a **second-layer solution** designed to **scale Bitcoin transactions**. It uses a shared UTXO model for confidential and off-chain payments through an intermediary server that cannot access your funds.

### 🧐 Does Ark require covenants?

Yes and No. To better understand the impact of covenants, check out the [Ark vs clArk](./learn/clark) page to see the differences between the two implementations.

### 📜 How Does Ark Work?

Head over our [Learn](./learn/intro.md) section to understand the Ark protocol in detail.

### 🏃‍♀️ Running Ark (on Liquid)

You can join an existing Ark service provider or run your own on the Liquid Network. To get started, follow the guides below:

- [Join an Ark as User](./user/intro.md)
- [Operate an Ark as Liquidity Provider](./provider/intro.md)

### 👩‍💻 Integrate Ark

:::info
🚧 **Work in progress**
The Ark libraries and developer tools are currently under development. Please check back soon for updates.
:::

You ~~can~~ will [integrate Ark](./developers/get-started.md) into your wallet or application to enable your users to send and receive Bitcoin payments off-chain.

### ⌨️ Contributing

We welcome contributions from the community. If you'd like to contribute to the reference implementation, please see the [Ark GitHub](https://github.com/ark-network).

### ➰ Stay in the Loop

- Join our community on [Telegram](https://t.me/ark_network_community).
- Ask questions or get help on [Stack Overflow](https://bitcoin.stackexchange.com/questions/tagged/ark).

### ⚖️ License

By contributing to this repository, you agree to license your work under the MIT license, unless specified otherwise. Contributions not originally authored by you must include a license header with the original author(s) and source.
