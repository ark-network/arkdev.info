---
sidebar_label: Docker Setup
sidebar_position: 3
---

# Docker

Here you will learn how to get your Ark server ready for processing offchain transactions. We'll cover everything from initial setup to funding your wallet.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="covenant" label="Ark">

## Setup Covenant Ark Server

This version of the Ark server uses an external wallet called [Ocean](https://github.com/vulpemventures/ocean).

Before setting up the Ark server you must start the Ocean wallet as described below.

### 1.1 Setting up the Ocean wallet

First, we'll create Docker volumes to persist our data:

```sh
docker volume create ocean
docker volume create oceand
```

These volumes will store the Ocean wallet and daemon data, ensuring it persists between container restarts.

Next, we'll start the `oceand` container:

```bash
docker run -d \
 -e OCEAN_DB_TYPE=badger \
 -e OCEAN_NO_TLS=true \
 --name oceand \
 -v oceand:/app/data/oceand \
 -v ocean:/app/data/ocean \
 ghcr.io/vulpemventures/oceand:latest
```

Let's break down this command:
- `-d`: Runs the container in detached mode (in the background)
- `-e`: Sets environment variables:
  - `OCEAN_DB_TYPE=badger`: Specifies the database type
  - `OCEAN_NO_TLS=true`: Disables TLS for simplicity
- `--name oceand`: Names our container for easy reference
- `-v`: Mounts our Docker volumes to persist data

> **⚠️ Warning:** TLS is disabled for simplicity. **Do not** expose Ocean's port to the public internet in a production environment.

> **ℹ️ Note:** For non-interactive mode, you can pass `OCEAN_MNEMONIC` and `OCEAN_PASSWORD` as additional environment variables.

### 1.2 Running arkd

Similar to Ocean, we'll start by creating Docker volumes for Ark:

```bash
docker volume create ark
docker volume create arkd
```

Now, let's run the `arkd` container:

```bash
docker run -d \
 -e ARK_WALLET_ADDR=oceand:18000 \
 -e ARK_VTXO_TREE_SCRIPT_TYPE=covenant \
 -e ARK_NETWORK=liquid \
 --name arkd \
 -v arkd:/app/data \
 -v ark:/app/wallet-data \
 ghcr.io/ark-network/ark:latest
```

This command:
- Sets up environment variables for Ark configuration
- Names the container 'arkd'
- Mounts our volumes for data persistence

To make interacting with the Ark daemon easier, add this alias to your bash profile:

```sh
alias arkd="docker exec -it arkd arkd"
```

This allows you to run `arkd` commands as if it were installed locally.

### 1.3 Creating and unlocking the wallet

Now that our containers are running, let's set up the wallet:

To create a new wallet:
```sh
arkd wallet create --password <your-password>
```

Or, to restore from a mnemonic:
```sh
arkd wallet create --mnemonic <your-mnemonic> --password <your-password>
```

After creation, unlock your wallet:
```sh
arkd wallet unlock --password <your-password>
```

## Funding the Wallet

To interact with the network, you'll need to fund your wallet. Here's how:

1. Get a funding address:
   ```sh
   arkd wallet address
   ```

2. Send some L-BTC (Liquid Bitcoin) to this address.

3. Wait for at least 2 confirmations before proceeding.

By following these steps, you'll have a fully functional Ocean wallet and Ark setup using Docker, ready for further operations on the Liquid network.
  </TabItem>

  <TabItem value="covenant-less" label="clArk" default>

## Setup Covenant-less Ark Server

### 1.1 Run arkd

Create Docker volumes:

```sh
docker volume create ark
docker volume create arkd
```

Run `arkd`:

```sh
docker run -d \
  --name arkd \
  -v arkd:/app/data \
  -v ark:/app/wallet-data \
  ghcr.io/ark-network/ark:latest
```

Add alias to bash profile:

```sh
alias arkd="docker exec -it arkd arkd"
```

### 1.2 Create and unlock wallet

Create wallet:

```sh
arkd wallet create --password <password>
```

Or restore from mnemonic:

```sh
arkd wallet create --mnemonic <mnemonic> --password <password>
```

Unlock wallet:

```sh
arkd wallet unlock --password <password>
```

## Fund the Wallet

Get a funding address:

```sh
arkd wallet address
```

Fund the on-chain address with BTC and wait for 2 confirmations.

  </TabItem>
</Tabs>