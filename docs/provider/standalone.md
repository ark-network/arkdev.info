---
sidebar_label: Standalone Setup
sidebar_position: 3
---

# Standalone binary

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="covenant" label="Ark">

## Setup the Ocean wallet

1. Download the latest `oceand` binary from the [github repository](https://github.com/vulpemventures/ocean/releases).

2. Move the binary to your user path and give it executable permissions:

   ```sh
   mv path/to/oceand-<version>-<os>-<arch> /usr/local/bin/oceand
   chmod +x /usr/local/bin/oceand
   ```

3. Start `oceand`:

   ```bash
   OCEAN_DB_TYPE=badger OCEAN_NO_TLS=true oceand
   ```

   You can customize the datadir by exporting the environment variable `OCEAN_DATADIR`. Default locations:
   - Linux: `~/.oceand`
   - MacOS: `~/Library/Application\ Support/Oceand`

:::warning
TLS is disabled for simplicity and the RPCs are not protected. **Do not** expose Ocean's port to the public internet.
:::

:::info
For non-interactive mode, pass `OCEAN_MNEMONIC` and `OCEAN_PASSWORD` as environment variables.
:::

## Run arkd connected to ocean

1. Download the latest `arkd` binary from the [github repository](https://github.com/ark-network/ark/releases).

2. Move the binary to your user path and give it executable permissions:

   ```sh
   mv path/to/arkd-<version>-<os>-<arch> /usr/local/bin/arkd
   chmod +x /usr/local/bin/arkd
   ```

3. Run `arkd` connected to `localhost:18000`:

   ```bash
   ARK_WALLET_ADDR=localhost:18000 ARK_VTXO_TREE_SCRIPT_TYPE=covenant ARK_NETWORK=liquid arkd
   ```

4. Create and unlock the Server wallet:

   ```sh
   arkd wallet create --password <password>
   ```

   Or restore from mnemonic:

   ```sh
   arkd wallet create --mnemonic <mnemonic> --password <password>
   ```

5. Unlock the wallet:

   ```sh
   arkd wallet unlock --password <password>
   ```

6. Get a funding address:

   ```sh
   arkd wallet address
   ```

7. Fund the on-chain address with L-BTC (Liquid Bitcoin) and wait for 2 confirmations.

  </TabItem>
  <TabItem value="covenant-less" label="clArk" default>

## Setup Bitcoin Core

`arkd` in `covenantless` mode uses Bitcoin Core to operate on the Bitcoin network. It can connect to Core via RPC or Neutrino, using a Neutrino client to fetch relevant bitcoin transactions via compact block filters over the peer-to-peer network.

:::info
Support for direct connection to your full node via Bitcoin Core ZMQ and Electrum servers will be available soon.
:::

To connect `arkd` to your own Bitcoin Core node via RPC, use the environment variables:

```sh
export ARK_BITCOIND_RPC_USER=admin1;
export ARK_BITCOIND_RPC_PASS=123;
export ARK_BITCOIND_RPC_HOST=localhost:18443;
```

To connect via Neutrino:

```sh
export ARK_NEUTRINO_PEER=yourhost:p2p_port_bitcoin
```

## Run arkd

1. Download the latest `arkd` binary from the [github repository](https://github.com/ark-network/ark/releases).

2. Move the binary to your user path and give it executable permissions:

   ```sh
   mv path/to/arkd-<version>-<os>-<arch> /usr/local/bin/arkd
   chmod +x /usr/local/bin/arkd
   ```

3. Start the Server:

   ```sh
   arkd
   ```

4. Create and unlock the Server wallet:

   ```sh
   arkd wallet create --password <password>
   ```

   Or restore from mnemonic:

   ```sh
   arkd wallet create --mnemonic <mnemonic> --password <password>
   ```

5. Unlock the wallet:

   ```sh
   arkd wallet unlock --password <password>
   ```

6. Get a funding address:

   ```sh
   arkd --macaroon-path /app/data/macaroons/admin.macaroon --tls-cert-path /app/data/tls/cert.pem wallet address
   ```

7. Fund the on-chain address with BTC and wait for 2 confirmations.

## Mint Ark Notes

```sh
arkd --macaroon-path /app/data/macaroons/admin.macaroon --tls-cert-path /app/data/tls/cert.pem wallet note --amount <amount> --quantity <quantity>
```

  </TabItem>
</Tabs>