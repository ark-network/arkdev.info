---
sidebar_position: 1
title: 'VTXO'
---

A VTXO is locked by a taproot script that must contain only two types of spending paths:

### 1. Redeem Paths
Allow unilateral spending after a CSV delay. Each path requires:
- The transaction must be on-chain (the VTXO has to be unrolled on-chain)
- The delay must not be shorter than a threshold set by the Server
- Only the designated user(s) signature is needed

```btcscript
// 1-sig redeem path
<delay> CHECKSEQUENCEVERIFY DROP <pubkey> CHECKSIG

// 2-sig redeem path
<delay> CHECKSEQUENCEVERIFY DROP <pubkey1> CHECKSIGVERIFY <pubkey2> CHECKSIG
```

### 2. Forfeit Paths
Allow cooperative spending between parties. Each path requires:
- The Server's signature must always be included
- Can optionally require additional signatures

```btcscript
// 1-sig forfeit path
<pubkey> CHECKSIGVERIFY <server_pubkey> CHECKSIG

// 2-sig forfeit path
<pubkey1> CHECKSIGVERIFY <pubkey2> CHECKSIGVERIFY <server_pubkey> CHECKSIG
```

:::note
The server considers the VTXO invalid if any other type of tapscript path is used.
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

## VTXO Address Format

VTXO addresses are built from the taproot key concatenated with the server's public key, using bech32m encoding. The server public key identifies the Ark service provider. The taproot key encodes the forfeits and redeem paths of the VTXO.

Example:
* VTXO public key: `25a43cecfa0e1b1a4f72d64ad15f4cfa7a84d0723e8511c969aa543638ea9967`
* Server public key: `33ffb3dee353b1a9ebe4ced64b946238d0a4ac364f275d771da6ad2445d07ae0`

The VTXO address is:
```
ark1x0lm8hhr2wc6n6lyemtyh9rz8rg2ftpkfun46aca56kjg3ws0tsztfpuanaquxc6faedvjk3tax0575y6perapg3e95654pk8r4fjecs5fyd2
``` 