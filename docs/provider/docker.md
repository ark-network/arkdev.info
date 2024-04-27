---
sidebar_label: Docker
sidebar_position: 2
---

## Get Started with Docker

### Setup the Ocean wallet

Before starting `oceand`, you need to create Docker volumes named `ocean` and `oceand`. You can do this with the following commands:

```bash
docker volume create ocean
docker volume create oceand
```

Start `oceand` with embedded `badger` database.

```bash
docker run -d \
-e OCEAN_DB_TYPE=badger \
-e OCEAN_NO_TLS=true \
--name oceand \
-v oceand:/app/data/oceand \
-v ocean:/app/data/ocean \
ghcr.io/vulpemventures/ocean:latest
```

:::warning
👀 the TLS is disabled for simplicity and the RPCs are not protected. **Do not** expose the ocean's port to the public internet, the `arkd` will connect to `oceand` through the internal docker network for security reasons.
:::

Initialize `oceand` wallet and unlock:

```bash
alias ocean='docker exec oceand ocean'
ocean config init --no-tls
ocean wallet create --password <password>
ocean wallet unlock --password <password>
```

:::info
🏃‍♀️ **non-interactive mode** You can have auto-init and auto-unlock and skip the initial wallet creation and avoid the need of manually unlock the wallet on startup, you can pass `OCEAN_MNEMONIC` and `OCEAN_PASSWORD` together environment variables to the container
:::

### Run arkd connected to ocean

Before starting `arkd`, you need to create Docker volumes named `ark` and `arkd`. You can do this with the following commands:

```bash
docker volume create ark
docker volume create arkd
```

Run `arkd` connected to `oceand:18000`

```bash
docker run -d \
-e ARK_WALLET_ADDR=oceand:18000 \
--name arkd \
-v arkd:/app/data \
-v ark:/app/wallet-data \
ghcr.io/ark-network/ark:v0.1.0
```

**Note:** On startup `arkd` will create an account `ark` on oceand.

Get an address from Ocean to add funds to the ASP:

```bash
ocean account derive --account-name ark
```

Fund the resulting on-chain address with L-BTC (Liquid Bitcoin) and wait for 2 confirmations.

