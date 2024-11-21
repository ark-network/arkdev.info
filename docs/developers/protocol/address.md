---
sidebar_position: 1
title: 'Ark Address'
---

A VTXO is locked by a [taproot](https://bips.dev/341/) script that must contain forfeit(s) and redeem(s) paths in their taproot script tree. The key-path is always an unspendable key.

Ark addresses are built from the taproot key concatenated with the server's public key, using [bech32m](https://bips.dev/350/) encoding. The server public key identifies the Ark service provider. The taproot key encodes the forfeits and redeem paths of the VTXO.

> on mainnet, the address is prefixed with `ark`. For instance:
> * Taproot public key: `25a43cecfa0e1b1a4f72d64ad15f4cfa7a84d0723e8511c969aa543638ea9967`
>* Server public key: `33ffb3dee353b1a9ebe4ced64b946238d0a4ac364f275d771da6ad2445d07ae0`
> 
> gives the following address:
> ```
> ark1x0lm8hhr2wc6n6lyemtyh9rz8rg2ftpkfun46aca56kjg3ws0tsztfpuanaquxc6faedvjk3tax0575y6perapg3e95654pk8r4fjecs5fyd2
>```
![Ark Address Structure](/img/address.png)

:::tip
To receive funds, the scripts encoded in the address do not have to be known. They are necessary only when the VTXO is spent off-chain in order for the server to validate the spending paths.
:::

### VTXO Scripts Examples

Default VTXO script:
```btcscript
<alice> CHECKSIGVERIFY <server> CHECKSIG            // (Alice + Server)
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIG   // (Alice after <delay>)
```

2-of-2 VTXO script with collaborative redeem:
```btcscript
<alice> CHECKSIGVERIFY <bob> CHECKSIGVERIFY <server> CHECKSIG             // (Alice + Bob + Server)
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIGVERIFY <bob> CHECKSIG    // (Alice + Bob after <delay>)
```

2-of-2 VTXO script with different redeem paths:
```btcscript
<alice> CHECKSIGVERIFY <bob> CHECKSIGVERIFY <server> CHECKSIG    // (Alice + Bob + Server)
<delay1> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIG               // (Alice after <delay1>)
<delay2> CHECKSEQUENCEVERIFY DROP <bob> CHECKSIG                 // (Bob after <delay2>)
```

2-of-3 VTXO script:
```btcscript
<alice> CHECKSIGVERIFY <bob> CHECKSIGVERIFY <server> CHECKSIG    // (Alice + Bob + Server)
<alice> CHECKSIGVERIFY <charlie> CHECKSIGVERIFY <server> CHECKSIG    // (Alice + Charlie + Server)
<bob> CHECKSIGVERIFY <charlie> CHECKSIGVERIFY <server> CHECKSIG    // (Bob + Charlie + Server)
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIGVERIFY <bob> CHECKSIG    // (Alice + Bob after <delay>)
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIGVERIFY <charlie> CHECKSIG    // (Alice + Charlie after <delay>)
<delay> CHECKSEQUENCEVERIFY DROP <bob> CHECKSIGVERIFY <charlie> CHECKSIG    // (Bob + Charlie after <delay>)
```