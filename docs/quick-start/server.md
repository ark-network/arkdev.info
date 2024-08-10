---
sidebar_position: 3
title: 'Run the Server'
---
This guide will walk you through the process of running and provisioning an Ark Server using Docker.

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
  -v ark:/app/wallet-data \
  -v arkd:/app/data \
  --network nigiri \
  -p 6000:6000 \
  -e ARK_NETWORK=regtest \
  -e ARK_TX_BUILDER_TYPE=covenantless \
  -e ARK_ROUND_INTERVAL=5 \
  -e ARK_MIN_RELAY_FEE=200 \
  -e ARK_NEUTRINO_PEER=bitcoin:18444 \
  -e ARK_ESPLORA_URL=http://chopsticks:3000 \
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

### 2. Unlock the Wallet

Unlock the wallet using the password:

```sh
arkd wallet unlock --password password
```

### 3. Fund the Wallet

Use the Nigiri faucet to fund your wallet:

```sh
nigiri faucet $(arkd wallet address)
```

### 4. Check the Balance

Verify the wallet balance:

```sh
arkd wallet balance
```

## Conclusion

Your Ark Server is now set up and provisioned. It's ready to process payments and create round transactions.