---
sidebar_position: 2
title: 'Address'
---

A VTXO is locked by a [P2TR](https://bips.dev/341/) script composed of collaborative and exit script paths - the key path is always the unspendable key `0250929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0`.

An Ark address is the [bech32m](https://bips.dev/350/) encoding of a prefix, the P2TR output key, and the server's x-only public key.

> on mainnet, the address prefix is `ark`, while on test networks the prefix is always `tark`.
> For instance:

> * P2TR output  key: `25a43cecfa0e1b1a4f72d64ad15f4cfa7a84d0723e8511c969aa543638ea9967`
> * Server public key: `33ffb3dee353b1a9ebe4ced64b946238d0a4ac364f275d771da6ad2445d07ae0`

> 
> ```
> mainnet: ark1x0lm8hhr2wc6n6lyemtyh9rz8rg2ftpkfun46aca56kjg3ws0tsztfpuanaquxc6faedvjk3tax0575y6perapg3e95654pk8r4fjec4q8efp
> testnet: tark1x0lm8hhr2wc6n6lyemtyh9rz8rg2ftpkfun46aca56kjg3ws0tsztfpuanaquxc6faedvjk3tax0575y6perapg3e95654pk8r4fjecs5fyd2
> ```

![Ark Address Structure](/img/address.png)

:::tip
Like Bitcoin, the taproot tree encoded in the ark address is revealed only when the VTXO is spent. If it doesn't pass the server's validation, the owner won't be allowed to spend the VTXO off-chain. The unilateral exit would be the only option.
:::

## Code Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="programming-language">
  <TabItem value="typescript" label="TypeScript">

```typescript title="address.ts"
import { Script, ScriptNum, p2tr, taprootListToTree } from '@scure/btc-signer'
import { TAPROOT_UNSPENDABLE_KEY } from '@scure/btc-signer/utils'
import { bech32m } from 'bech32'
import * as bip68 from 'bip68'


/**
 * Creates a default mainnet Ark address with collaborative and exit script paths
 * @param serverPubKey - Server's x-only public key (32 bytes)
 * @param myPubKey - User's x-only public key (32 bytes)
 * @param exitDelay - Number of blocks required for unilateral exit
 * @returns bech32m encoded Ark address
 */
function makeDefaultArkAddress(
  serverPubKey: XOnlyPubKey,
  myPubKey: XOnlyPubKey,
  timelock: number,
  isTestnet: boolean
): string {
  // create collaborative spending path
  const forfeit = Script.decode([
    serverPubKey,
    'CHECKSIGVERIFY',
    myPubKey,
    'CHECKSIG'
  ])
  
  // encode timelock as bip68 sequence
  const sequence = ScriptNum().encode(
    BigInt(bip68.encode({ blocks: timelock }))
  )

  // create unilateral exit path
  const exit = Script.decode([
    sequence,
    'CHECKSEQUENCEVERIFY',
    'DROP',
    myPubKey,
    'CHECKSIG'
  ])
  
  // generate P2TR output key with unspendable key path
  const vtxoTaprootKey = p2tr(
    TAPROOT_UNSPENDABLE_KEY,
    taprootListToTree([forfeit, exit]),
    undefined,
    true
  ).tweakedPubkey

  // combine server pubkey and vtxo taproot key
  const addressData = new Uint8Array(64)
  addressData.set(serverPubKey, 0)
  addressData.set(vtxoTaprootKey, 32)

  return bech32m.encode(
    isTestnet ? 'tark' : 'ark',    // mainnet prefix
    bech32m.toWords(addressData),  // convert to 5-bit words
    1023                           // extends bech32m byte limit
  );
}
```

</TabItem>
</Tabs>
