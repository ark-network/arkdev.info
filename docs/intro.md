---
description: Ark is a layer-two protocol designed to scale Bitcoin transactions with a shared UTXO model for cheap, fast and confidential off-chain transactions.
sidebar_position: 1
slug: /
title: Introduction
---

Ark is a scaling solution for Bitcoin that involves **moving transactions off-chain**. Ark executes transactions outside of the Bitcoin main chain but posts transaction data back on-chain in a compressed format.
Ark servers bundle multiple off-chain transactions into large batches before submitting them to the Bitcoin blockchain. This method spreads fixed costs across multiple transactions in each batch, significantly reducing fees for end-users.

### 📜 How Does Ark Work?

Head over to our [Learn](./learn/concepts) section to understand the Ark protocol in detail.

### ⛹️‍♀️ Use cases

- Scaling of other protocols that leverage UTXO model such as tokens, channels or swaps.
- Create a Bitcoin wallet for your users with cheap and fast transactions.
- Rebalance Lightning Network channels.

### 👩‍💻 Integrate Ark

You can [integrate Ark](./developers/get-started.md) into your wallet or application to enable "virtual" bitcoin transactions. Check out our Wallet SDKs for Go and JavaScript, soon also Rust and Python.

### 🏃‍♀️ Running Ark

You can join an existing Ark Server or run your own on Bitcoin or Liquid. To get started, follow the guides below:

- [Sending and receiving funds as client](./user/intro.md)
- [Running an Ark Server and provide liquidity](./provider/intro.md)

### ⌨️ Contributing

We welcome contributions from the community. If you'd like to contribute to the reference implementation, please see the [Ark GitHub](https://github.com/ark-network/ark).

### ➰ Stay in the Loop

- Join the Ark Labs developer chat on [Discord](https://discord.gg/5XwckYtXAG).
- Ask questions or get help on [Stack Exchange](https://bitcoin.stackexchange.com/questions/tagged/ark).
- Join the Ark community on [Telegram](https://t.me/ark_network_community).

### ⚖️ License

By contributing to this repository, you agree to license your work under the MIT license, unless specified otherwise. Contributions not originally authored by you must include a license header with the original author(s) and source.
