---
sidebar_position: 1
title: 'Introduction'
---

Welcome to the **Ark** quick-start guide! In this guide, you'll learn how to run a **covenant-less** Ark for **Bitcoin** regtest locally with just a few commands. We'll walk you through setting up a local Bitcoin testing environment, running and provisioning the `arkd` server (an ASP implementation), and making off-chain transactions with the `ark` client.

### What is Ark?

- **`ark`**: A simple Ark-enabled Bitcoin wallet in the form of a command-line interface. It connects to an Ark Server to perform off-chain transactions. The `ark` client has both an on-chain and off-chain Bitcoin wallet, allowing you to send and receive Bitcoin on-chain and off-chain through the Ark protocol. If the server is unresponsive or disappears, it can unilaterally exit by unrolling the [VTXO tree](../learn/concepts.md#vtxo-tree).

- **`arkd`**: An always-on server daemon that multiple `ark` clients can connect to. The server has an embedded on-chain wallet to fund the next rounds and acts as a central coordinator to create the next round transactions containing the [VTXO tree](../learn/concepts.md#vtxo-tree). It also receives [forfeit transactions](../learn/concepts.md#forfeit-transaction) from users and serves as a VTXO explorer for light clients.

### Getting Started

Before you begin, refer to the [Requirements](./requirements.md) section to install **Docker** and **Nigiri Bitcoin** for running a local Bitcoin testing environment. If you already have these installed, you can skip the installation steps and go straight to the [Run the Server](./server.md) section.