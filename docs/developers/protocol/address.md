---
sidebar_position: 1
title: 'Ark Address'
---

A VTXO is locked by a [P2TR](https://bips.dev/341/) script composed of forfeit and redeem script paths - the key path is always the unspendable key `0250929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0`.

An Ark address is the [bech32m](https://bips.dev/350/) encoding of a prefix, the P2TR output key, and the server's x-only public key.

> on mainnet, the address prefix is `ark`, while on test networks the prefix is always `tark`.
> For instance:
> * P2TR output  key: `25a43cecfa0e1b1a4f72d64ad15f4cfa7a84d0723e8511c969aa543638ea9967`
> * Server public key: `33ffb3dee353b1a9ebe4ced64b946238d0a4ac364f275d771da6ad2445d07ae0`
> 
> ```
> mainnet: ark1x0lm8hhr2wc6n6lyemtyh9rz8rg2ftpkfun46aca56kjg3ws0tsztfpuanaquxc6faedvjk3tax0575y6perapg3e95654pk8r4fjecs5fyd2
> testnet: tark1x0lm8hhr2wc6n6lyemtyh9rz8rg2ftpkfun46aca56kjg3ws0tsztfpuanaquxc6faedvjk3tax0575y6perapg3e95654pk8r4fjec4q8efp
> ```
![Ark Address Structure](/img/address.png)

:::tip
Like Bitcoin, the taproot tree encoded in the ark address is revealed only when the VTXO is spent. If it doesn't pass the server's validation, the owner won't be allowed to spend the VTXO off-chain. The unilateral exit would be the only option.
:::

### VTXO Scripts Examples

Default VTXO script:
```btcscript
// forfeit
<alice> CHECKSIGVERIFY <server> CHECKSIG            // (Alice + Server)
// redeem
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIG   // (Alice after <delay>)
```

2-of-2 VTXO script with collaborative redeem:
```btcscript
// forfeit
<alice> CHECKSIGVERIFY <bob> CHECKSIGVERIFY <server> CHECKSIG             // (Alice + Bob + Server)
// redeem
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIGVERIFY <bob> CHECKSIG    // (Alice + Bob after <delay>)
```

2-of-2 VTXO script with unilateral redeem paths:
```btcscript
// forfeit
<alice> CHECKSIGVERIFY <bob> CHECKSIGVERIFY <server> CHECKSIG    // (Alice + Bob + Server)
<delay1> CHECKLOCKTIMEVERIFY DROP <alice> CHECKSIGVERIFY <server> // refund
// redeems
<delay1> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIG               // (Alice after <delay1>)
<delay2> CHECKSEQUENCEVERIFY DROP <bob> CHECKSIG                 // (Bob after <delay2>)
```

2-of-3 VTXO script:
```btcscript
// forfeits
<alice> CHECKSIGVERIFY <bob> CHECKSIGVERIFY <server> CHECKSIG    // (Alice + Bob + Server)
<alice> CHECKSIGVERIFY <charlie> CHECKSIGVERIFY <server> CHECKSIG    // (Alice + Charlie + Server)
<bob> CHECKSIGVERIFY <charlie> CHECKSIGVERIFY <server> CHECKSIG    // (Bob + Charlie + Server)
// redeems
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIGVERIFY <bob> CHECKSIG    // (Alice + Bob after <delay>)
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIGVERIFY <charlie> CHECKSIG    // (Alice + Charlie after <delay>)
<delay> CHECKSEQUENCEVERIFY DROP <bob> CHECKSIGVERIFY <charlie> CHECKSIG    // (Bob + Charlie after <delay>)
```