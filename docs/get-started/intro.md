---
sidebar_position: 1
title: 'Overview'
---

This is a quick start to run an **convenant-less** Ark server and an Ark client using the **Bitcoin** RegTest for a free and local testing environment. The easiest is to run Ark Server, Ark Client and a local Bitcoin RegTest on your computer using Docker.

- `nigiri` is a CLI tool to run a local Bitcoin RegTest environment with a single command using Docker. It provides a Bitcoin node, an Esplora explorer frontend and backend, and a Bitcoin faucet to fund your wallets. It automatically mines blocks and creates new wallets for you at startup.

- `ark` is a simple Ark-enabled Bitcoin wallet in the form of a command-line interface that connects to an Ark Server to perform off-chain transactions. It has both a Bitcoin on-chain wallet and an Ark off-chain wallet. It can send and receive Bitcoin on-chain and off-chain through the Ark protocol, and it can unilateral exit unrolling the [VTXO tree](../learn/concepts.md#vtxo-tree) if the Server is not responding or disappears.

- `arkd` is an always-on server daemon that multiple `ark` clients can connect to. The Server has an embedded on-chain wallet to be used to fund the next rounds, it acts as central coordinator to create next round transactions containing [VTXO tree](../learn/concepts.md#vtxo-tree) and receive the [forfeit transactions](../learn/concepts.md#forfeit-transaction) form the users, and it serves as VTXO explorer for light-clients.

Refer to the [Requirements](./requirements.md) section to install **Docker** and **Nigiri Bitcoin** to run a Bitcoin local testing environment. You can **skip the installation** steps below if you already have them installed and go straight to the [Run the Server](./server.md) section.
