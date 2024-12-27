---
sidebar_position: 3
title: 'Run the Server'
---
This guide will walk you through the process of running and provisioning an Ark Server using Docker.

If you don't have **Docker** or **Nigiri** installed and running, please refer back to the [requirements](requirements.md) page for instructions on how to install and set them up before proceeding with the steps mentioned above.

## Running the Ark Server

### 1. Download the Latest Docker Image

First, pull the latest Ark Docker image:

```sh
docker pull ghcr.io/ark-network/ark:latest
```

### 2. Run the Ark Server

Use the following command to run the Ark Server:

```sh
docker run -d --name arkd \
  -v ark-alice:/app/ark-alice \
  -v ark-bob:/app/ark-bob \
  -v arkd:/app/data \
  --network nigiri \
  -p 7070:7070 \
  -e ARK_NETWORK=regtest \
  -e ARK_TX_BUILDER_TYPE=covenantless \
  -e ARK_ROUND_INTERVAL=5 \
  -e ARK_MIN_RELAY_FEE=200 \
  -e ARK_NEUTRINO_PEER=bitcoin:18444 \
  -e ARK_ESPLORA_URL=http://chopsticks:3000 \
  -e ARK_NO_TLS=true \
  -e ARK_NO_MACAROONS=true \
  ghcr.io/ark-network/ark:latest
```

### 3. Set Up Convenient Aliases (Optional)

To simplify running commands in the `ark` container, add these aliases to your shell profile:

```sh
alias ark='docker exec -it arkd ark'
alias arkd='docker exec -it arkd arkd'
```

## Provisioning the Ark Server

### 1. Create the Wallet

Create a new wallet with a password:

```sh
arkd wallet create --password password
```

:::note
If you have already created a wallet in the past, best to clear the default wallet data directory before creating a new one:

Remove the docker container named `arkd`:

```sh
docker rm arkd 
```

Delete the volumes

```sh
docker volume rm ark arkd
```

:::

### 2. Unlock the Wallet

Unlock the wallet using the password:

```sh
arkd wallet unlock --password password
```

### 3. Fund the Wallet

Get the address of the wallet:

```sh
arkd --no-macaroon wallet address
```

Use the Nigiri faucet to fund your wallet:

```sh
nigiri faucet address
```

### 4. Check the Balance

Verify the wallet balance:

```sh
arkd --no-macaroon wallet balance
```

## Conclusion

Your Ark Server is now set up and provisioned. It's ready to process off-chain transactions and create VTXO trees in rounds.
