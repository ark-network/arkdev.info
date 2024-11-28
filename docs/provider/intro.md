---
sidebar_position: 1
title: Introduction
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`arkd` is the core server component of the Ark ecosystem, designed for Ark Service Providers. It serves as the backbone of the Ark, facilitating off-chain Bitcoin transactions and providing the liquidity to the protocol.

## Key Features

The following roadmap outlines the key features of `arkd`. As the system evolves, more features may be added or existing ones enhanced:

- [x] **Always-On daemon**: Operates as a continuously running gRPC and REST server for 24/7 availability.
- [x] **Embedded On-Chain Wallet**: Includes a Bitcoin wallet for funding future transaction rounds.
- [x] **Central Coordinator**: Manages and creates the next round of transactions with the VTXO tree.
- [x] **VTXO Explorer**: Serves as a query point for light clients to explore Virtual Transaction Outputs.
- [ ] **Advanced Monitoring Tools**: (Coming Soon) Provides detailed insights into server performance, funds allocation and transaction flows.
- [ ] **Automated Backup System**: (In Development) Ensures data integrity with regular, secure backups.
- [ ] **Multi-Network Support**: (Planned) Ability to operate on multiple Bitcoin-like networks (Bitcoin, Liquid, etc.).
- [ ] **Advanced Security Features**: (Planned) Authenticated GRPC and REST interface through macaroons and encrypted transport with TLS, both CA signed and self-signed.

## Role in the Ark protocol

As an Ark Service Provider, running `arkd` allows you to:

- Facilitate fast, off-chain Bitcoin transactions for your users.
- Create and Sweep the VTXO trees, which is crucial for the security and liquidity efficiency of the Ark.
- Provide a non-custodial service that ensures users can always access their funds, even if the server goes down.

## Getting Started

Choose your preferred setup method:

<Tabs>
  <TabItem value="docker" label="Docker" default>
    Follow the [Docker setup guide](./docker.md) to run arkd in a containerized environment.
  </TabItem>
  <TabItem value="standalone" label="Standalone">
    Use the [Standalone setup guide](./standalone.md) to run arkd directly on your system.
  </TabItem>
</Tabs>

:::info
Umbrel App Store support coming soon! Stay tuned for easy one-click installation.
:::

In the following sections, we'll guide you through:

- Setting up `arkd` on your system.
- Funding the capacity of the `arkd` wallet.
- Monitoring and maintaining your `arkd` instance.

Happy arking! 🌊