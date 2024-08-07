---
sidebar_position: 3
title: 'Run the Server'
---

## Run the Ark Server

### Download the latest Docker image

```sh
docker pull ghcr.io/ark-network/ark:latest
```

### Run the Ark Server
  
```sh
docker run -d --name arkd -v ark:/app/wallet-data -v arkd:/app/data --network nigiri -p 6060:6000 \
  -e ARK_NETWORK=regtest \
  -e ARK_TX_BUILDER_TYPE=covenantless \
  -e ARK_ROUND_INTERVAL=5 \
  -e ARK_MIN_RELAY_FEE=200 \
  -e ARK_NEUTRINO_PEER=bitcoin:18444 \
  -e ARK_ESPLORA_URL=http://chopsticks:3000 \
  ghcr.io/ark-network/ark:latest
```

We do suggest to apply these alias to your shell profile to make it easier to run the `ark` container.

```sh
alias ark='docker exec -it arkd ark'
alias arkd='docker exec -it arkd arkd'
```

## Provision the Ark Server

### Create the Wallet

```sh
arkd wallet create --password password
```

### Unlock the Wallet

```sh
arkd wallet unlock --password password
```

### Fund the Wallet

```sh
nigiri faucet $(arkd wallet address)
```

Check the balance with:

```sh
arkd wallet balance
```

Now you Ark Servers is ready to process payments and create round transactions.
