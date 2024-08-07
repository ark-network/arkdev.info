---
sidebar_label: Docker
sidebar_position: 2
---

## Get Started with Docker

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="covenant" label="Ark">
### Setup the Ocean wallet

Before starting `oceand`, you need to create Docker volumes named `ocean` and `oceand`. You can do this with the following commands:

```sh
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
ghcr.io/vulpemventures/oceand:latest
```

:::warning
👀 the TLS is disabled for simplicity and the RPCs are not protected. **Do not** expose the ocean's port to the public internet, the `arkd` will connect to `oceand` through the internal docker network for security reasons.
:::

:::info
🏃‍♀️ **non-interactive mode** You can have auto-init and auto-unlock and skip the initial wallet creation as also avoid the need of manually unlock the wallet on startup, you can pass `OCEAN_MNEMONIC` and `OCEAN_PASSWORD` together environment variables to the container
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
-e ARK_VTXO_TREE_SCRIPT_TYPE=covenant \
-e ARK_NETWORK=liquid \
--name arkd \
-v arkd:/app/data \
-v ark:/app/wallet-data \
ghcr.io/ark-network/ark:latest
```

Add the following alias to your bash profile:

```sh
arkd="docker exec -it arkd arkd"
```

Create and unlock the wallet of the ASP:

```sh
arkd wallet create --password <password>
```

**Note:** you can alternatively restore the wallet from an existing mnemonic with:

```sh
arkd wallet create --mnemonic <mnemonic> --password <password>
```

By default, the restoration uses a gap of 100 unused address. You can customize this parameter with the flag `--addr-gap-limit`.

Unlock the wallet:

```sh
arkd wallet unlock --password <password>
```

Get an address to add funds to the ASP:

```sh
arkd wallet address
```

Fund the resulting on-chain address with L-BTC (Liquid Bitcoin) and wait for 2 confirmations.
  </TabItem>
  <TabItem value="covenant-less" label="clArk" default>
### Run arkd

Before starting `arkd`, you need to create Docker volumes named `ark` and `arkd`. You can do this with the following commands:

```sh
docker volume create ark
docker volume create arkd
```

Run `arkd`

```sh
docker run -d \
--name arkd \
-v arkd:/app/data \
-v ark:/app/wallet-data \
ghcr.io/ark-network/ark:latest
```

Add the following alias to your bash profile:

```sh
arkd="docker exec -it arkd arkd"
```

Create and unlock the wallet of the ASP:

```sh
arkd wallet create --password <password>
```

**Note:** you can alternatively restore the wallet from an existing mnemonic with:

```sh
arkd wallet create --mnemonic <mnemonic> --password <password>
```

By default, the restoration uses a gap of 100 unused address. You can customize this parameter with the flag `--addr-gap-limit`.

Unlock the wallet:

```sh
arkd wallet unlock --password <password>
```

Get an address to add funds to the ASP:

```sh
arkd wallet address
```

Fund the resulting on-chain address with BTC and wait for 2 confirmations.
  </TabItem>
</Tabs>