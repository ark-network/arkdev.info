---
sidebar_position: 2
title: CLI Guide
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

## Wallet Setup and ASP Connection

Initialize your wallet and connect to a liquidity provider running an `arkd` server:

<Tabs>
  <TabItem value="covenant" label="Ark">

    :::tip
  Please note that the option to use Ark with covenants is only available on the Liquid Network.
  :::
  
```bash
ark init --network liquid --password <password> --asp-url <asp_url>
```
  </TabItem>
  <TabItem value="covenant-less" label="clArk" default>
```bash
ark init --password <password> --asp-url <asp_url>
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

Display your onchain and offchain receiving addresses:

```bash
ark receive
```

#### Adding Funds to Your Ark Wallet

Fund the `onchain_address` using the Liquid Network. Once the transaction has 2 confirmations, the funds will be available in your Ark wallet.

### Onboarding to Ark

:::danger
Always specify amounts in _sats_ (satoshis).
:::

Transfer funds from your onchain to offchain balance:

```bash
ark onboard --amount <amount>
```

### Making Payments

:::tip
You can send to both onchain and offchain addresses. The CLI will use the appropriate balance.
:::

Send payments to one or multiple receivers co-signing only with the ASP and delivering the pending payment to te recipient through the ASP:

```bash
ark send --to <address> --amount <amount>
ark send --receivers '[{"to": "<address>", "amount": <amount>}, ...]'
```

### Claiming Pending Payments

If you're a recipient of a pending payment inside the Ark, claim it BEFORE the [VTXO tree](../learn/concepts.md#vtxo-tree) expires, joining a round now. This commands will claim and batch ALL your pending payments if you have more than one:

```bash
ark claim --password <password>
```


### Redeeming Funds on-chain

#### Collaborative Redemption
:::info
Change from this operation goes to your offchain address.
:::

Work with the ASP to redeem funds onchain:
```bash
ark redeem --amount <amount>
```
#### Unilateral Redemption
:::info
The `--force` flag ignores `--amount` and redeems all funds.
:::
If the ASP is unresponsive, redeem all offchain funds:

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
ark init --network testnet --password <password> --ark-url https://asp.arkdev.info
```

:::info
Default data directories:
- POSIX (Linux/BSD): `~/.Ark-cli`
- Mac OS: `$HOME/Library/Application Support/Ark-cli`
- Windows: `%LOCALAPPDATA%\Ark-cli`
- Plan 9: `$home/Ark-cli`
:::