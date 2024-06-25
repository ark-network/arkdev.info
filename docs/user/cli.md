---
sidebar_position: 2
sidebar_label: CLI
title: Wallet CLI for Ark
---

This is a reference implementation of client for the Ark protocol. It allows you to create an Ark wallet on the Liquid Network (or other Elements-compatible blockchains), connect to an Ark service provider (ASP), and make payments off-chain.

## ▶️ Install

Start by downloading a compatible binary from the Latest Releases

### Available binaries

#### Linux

- [Linux amd64](https://install-latest-cli.arkdev.info/latest-release/ark-linux-amd64)
- [Linux arm64](https://install-latest-cli.arkdev.info/latest-release/ark-linux-arm64)

#### MacOS

- [Apple Silicon](https://install-latest-cli.arkdev.info/latest-release/ark-darwin-arm64)
- [Apple Intel](https://install-latest-cli.arkdev.info/latest-release/ark-darwin-amd64)

### Permissions

Move it to somewhere on your PATH:

```bash
mv <binary> /usr/local/bin/ark
chmod +x /usr/local/bin/ark
```

## ⚙️ Create a Wallet & Connect to an ASP

The CLI requires an initial setup to initialize the wallet and connect to the liquidity provider running an `arkd` server

```bash
ark init --network testnet --password <password> --ark-url https://asp.arkdev.info
```

You can also restore a wallet by specifying the hex encoded private key with the `--prvkey` flag.

### View balance

You can see both the onchain and offchain balance of the wallet with:

```bash
ark balance
```

To see your balance with your VTXOs expiration details use `--expiry-details`:

```bash
ark balance --expiry-details
```

### Receive funds

You can print your onchain and offchain receiving addresses with:

```bash
ark receive
```

#### Add funds to the ark wallet

Fund the `onchain_address` from previous command with the [Liquid Testnet faucet](https://liquidtestnet.com/faucet).

### Onboard the ark

```bash
ark onboard --amount <amount>
```

This command will send funds from your onchain balance to your offchain balance.

After confirmation, your ark wallet will be funded and ready to spend offchain.

:::danger Use sats
Amount is always specified in _sats_ unit.
:::

### Make payments

You can make a payment by sending to either one or many receivers:

```bash
ark send --to <address> --amount <amount>
ark send --receivers '[{"to": "<address>", "amount": <amount>}, ...]'
```

:::tip
You can send funds to onchain or offchain addresses:

- funds to onchain addresses will come from your onchain balance
- funds to offchain addresses will come from your offchain balance

:::

### Collaborative redemption

You can redeem your funds onchain collaborating with the ASP:

```bash
ark redeem --address <onchain_address> --amount <amount>
```

This command will send funds from your offchain balance to your onchain balance.

:::info
Any change produced with this operation goes to your offchain address.
:::

### Unilateral redemption

If the ASP is unresponsive you can redeem all your offchain funds unilaterally:

```bash
ark redeem --address <onchain_address> --force
```

:::danger  
The tag `--force` will make ark ignore `--amount` and redeem all funds.
:::

### Help

You can see all available commands with `help`:

```bash
ark help
```

## 🧪 Create a second CLI

To create a second CLI, on a different terminal use a different datadir by exporting the env var `ARK_WALLET_DATADIR`:

```bash
export ARK_WALLET_DATADIR=path/to/custom
ark init --network testnet --password <password> --ark-url https://asp.arkdev.info
```

:::info
By default the CLI uses the following datadir:

- POSIX (Linux/BSD): ~/.Ark-cli
- Mac OS: $HOME/Library/Application Support/Ark-cli
- Windows: %LOCALAPPDATA%\Ark-cli
- Plan 9: $home/Ark-cli

  :::

## 📝 License

This project is licensed under the **MIT License**.
