---
sidebar_position: 2
title: CLI Guide
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What is the Ark Wallet CLI?

The Ark Wallet CLI (Command Line Interface) is a powerful tool that allows users to interact with the Ark protocol directly from their terminal. It provides a streamlined way to manage your Ark wallet, conduct transactions, and interact with Ark Servers without the need for a graphical interface.

## Key Features and Roadmap

The following roadmap outlines the key features of the Ark Wallet CLI. As development progresses, more features may be added or existing ones enhanced:

- [x] **Wallet Creation and Management**: Create new wallets or restore existing ones with a private key.
- [x] **Server Connection**: Connect to Ark Server for off-chain transactions.
- [x] **Balance**: View both onchain and offchain balances.
- [x] **Offline Fund Reception**: Claim offline payments for pending off-chain transactions before expiration.
- [x] **Onboarding**: Transfer funds from onchain to offchain balance.
- [x] **Off-chain Payments**: Send funds to one or multiple recipients off-chain.
- [x] **Collaborative Redemption**: Work with Servers to redeem funds onchain to an address of your choice.
- [x] **Unilateral Redemption**: Force redemption of all funds if Server is unresponsive.
- [ ] **Determinsitic Wallet**: (Planned) Manage multiple keys from a single BIP39 mnemonic seed.
- [x] **Transaction History**: View detailed history of all transactions.
- [ ] **Advanced Security Features**: (Planned) Implement additional security measures like 2FA.
- [ ] **Use Nostr contacts and Nostr Accounts**: (Planned) Use Nostr contacts and Nostr Account as private key for easy social payments over Nostr DM.
- [ ] **Automated Backups**: (Planned) Set up scheduled backups of wallet data.
- [ ] **Adds automated refresh and notification features.**: (Planned) Automatically refresh the wallet balance and notify the user over the Nostr protocol.

## Installation

Begin by downloading a compatible binary from the latest releases.

### Available Binaries

#### Linux
- [Linux amd64](https://install-latest-cli.arkdev.info/latest-release/ark-linux-amd64)
- [Linux arm64](https://install-latest-cli.arkdev.info/latest-release/ark-linux-arm64)

#### MacOS
- [Apple Silicon](https://install-latest-cli.arkdev.info/latest-release/ark-darwin-arm64)
- [Apple Intel](https://install-latest-cli.arkdev.info/latest-release/ark-darwin-amd64)

### Setting Permissions

Move the binary to a location in your PATH and make it executable:

```bash
mv <binary> /usr/local/bin/ark
chmod +x /usr/local/bin/ark
```

## Wallet Setup and Server Connection

Initialize your wallet and connect to a liquidity provider running an `arkd` server:

<Tabs>
  <TabItem value="covenant" label="Ark">

    :::tip
  Please note that the option to use Ark with covenants is only available on the Liquid Network.
  :::
  
```bash
ark init --network liquid --password <password> --server-url <server_url>
```
  </TabItem>
  <TabItem value="covenant-less" label="clArk" default>
```bash
ark init --password <password> --server-url <server_url>
```
  </TabItem>
</Tabs>

To restore a wallet, use the `--prvkey` flag with the hex-encoded private key.

## Basic Operations

### Check Balance

View your onchain and offchain balances:

```bash
ark balance
```

For balance with VTXO expiration details:

```bash
ark balance --expiry-details
```

### Receive Funds

Display your boarding and offchain receiving addresses:

```bash
ark receive
```

### Making Payments

:::tip
You can send to both onchain and offchain addresses. The CLI will use the appropriate balance.
:::

Send payments to one or multiple receivers co-signing only with the Server and delivering the pending payment to te recipient through the Server:

```bash
ark send --to <address> --amount <amount>
ark send --receivers '[{"to": "<address>", "amount": <amount>}, ...]'
```

### Settle Boarding UTXOs

The `settle` command can be used to settle your out-of-round VTXOs or to complete the onboarding procedure and join the Ark with your own funds.

```bash
ark settle
```

### Redeem an ark-note

The `redeem-notes` command can be used to redeem ark-notes.

```bash
ark redeem-notes --note <ark-note>
```

### Redeeming Funds on-chain

#### Collaborative Redemption
:::info
Change from this operation goes to your offchain address.
:::

Work with the Server to redeem funds onchain:
```bash
ark redeem --amount <amount> --address <onchain_address>
```
#### Unilateral Redemption
:::info
The `--force` flag ignores `--address` and `--amount` and redeems all funds.
:::
If the Server is unresponsive, redeem all offchain funds:

```bash
ark redeem --force
```



### Help

For a list of all available commands:

```bash
ark help
```

## Creating a Second CLI Instance

To run a second CLI instance, use a different data directory:

```bash
export ARK_WALLET_DATADIR=path/to/custom
ark init --network testnet --password <password> --server-url <server_url>
```

:::info
Default data directories:
- POSIX (Linux/BSD): `~/.Ark-cli`
- Mac OS: `$HOME/Library/Application Support/Ark-cli`
- Windows: `%LOCALAPPDATA%\Ark-cli`
- Plan 9: `$home/Ark-cli`
:::