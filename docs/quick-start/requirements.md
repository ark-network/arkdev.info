---
sidebar_position: 2
title: 'Requirements'
---

## Setting Up a Bitcoin Testing Environment

:::tip
If you already have `docker` and `nigiri` installed, you can skip this setup process and proceed directly to the [Run the Server](./server.md) section.
:::

The most straightforward way to begin is by using Docker and Nigiri CLI to set up a local Bitcoin, Liquid, and Lightning testing environment. Nigiri is a powerful command-line tool that allows you to launch a complete Bitcoin environment with a single command, leveraging the Docker engine.

### What Nigiri Provides

- A local Bitcoin Core node, defaults to `regtest`, `txindex=1` and `compact block filters` enabled
- An [Electrum](https://github.com/blockstream/electrs) server
- [Esplora](https://github.com/blockstream/esplora) block explorer
- `nigiri faucet` command to fund addresses (HTTP API too!)
- `nigiri rpc` exposes JSON-RPC interface for the Bitcoin Core node
- Automatic block generation when transactions are broadcast through the local block explorer

### Install Instructions

#### 1. Install Docker

- **Mac Users**: Download and install [OrbStack for Mac](https://orbstack.dev/).
- **Linux Users**: Install Docker using the following convenience script:

  ```sh
  curl -fsSL https://get.docker.com -o get-docker.sh | sudo sh
  ```
  
  For alternative installation methods, refer to the [official Docker documentation](https://docs.docker.com/desktop/install/linux-install/).

#### 2. Install Nigiri Bitcoin

Run the following command to install Nigiri:

```sh
curl https://getnigiri.vulpem.com | bash
```

#### 3. Run Bitcoin RegTest with Nigiri

Start the Bitcoin RegTest environment:

```sh
nigiri start
```

When you're finished, stop all containers and clean up the volumes:

```sh
nigiri stop --delete
```

By following these steps, you'll have a fully functional Bitcoin testing environment ready for Ark testing and development.
