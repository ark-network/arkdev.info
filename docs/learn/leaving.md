---
sidebar_position: 5
title: 'Leaving the Ark'
---

### Overview

Alice wants to leave the Ark and get her funds back on-chain. It requires an on-chain transaction.

### Cooperative exit

#### Timeline of events

1. Alice tells ASP she wants to trade [VTXO](/docs/learn/nomenclature#vtxo-1) for UTXO
2. ASP (with Alice) prepares next [Pool transaction](/docs/learn/nomenclature#round-transaction):
   - an additional output is added, locked by `Alice`
3. Alice creates a [Forfeit transaction](/docs/learn/nomenclature#forfeit-transaction):
   - spends from VTXO (1) with `Alice + ASP`
   - adds connector output from Pool transaction (2) as input
   - signs it and send it to the ASP
4. ASP broadcasts [Pool transaction](/docs/learn/nomenclature#round-transaction)
5. Alice has now a new UTXO
6. For at most 4 weeks, Alice will be able to double spend her [VTXO](/docs/learn/nomenclature#vtxo-1), but if she does it, the ASP will have time (24 hours) to grab the funds from the [VTXO](/docs/learn/nomenclature#vtxo-1) to itself using the [Forfeit transaction](/docs/learn/nomenclature#forfeit-transaction)

### Non-cooperative exit

If ASP is unresponsive, Alice can unilaterally exit revealing the branch of the Pool transaction that locks her funds.

#### Timeline of events

1. Assuming a [VTXO](/docs/learn/nomenclature#vtxo-1) tree with radix of 2 and 8 [VTXOs](/docs/learn/nomenclature#vtxo-1):

```mermaid
flowchart TB
   tx1(TX 1) --> tx2(TX 2)
   tx1 --> tx3(TX 3)
   tx2 --> tx4(TX 4)
   tx2 --> tx5(TX 5)
   tx3 --> tx6(TX 6)
   tx3 --> tx7(TX 7)
   tx4 --> v1(VTXO 1)
   tx4 --> v2(VTXO 2)
   tx5 --> v3(VTXO 3)
   tx5 --> v4(VTXO 4)
   tx6 --> v5(VTXO 5)
   tx6 --> v6(VTXO 6)
   tx7 --> v7(VTXO 7)
   tx7 --> v8(VTXO 8)
```

2. Assuming VTXO 1 and 2 belong to Alice and Bob
3. Alice reveals the [VTXO](/docs/learn/nomenclature#vtxo-1) tree to spend the [Shared Output](/docs/learn/nomenclature#shared-output).
4. Alice doesn't need to reveal the entire tree, just enough to validate it:

```mermaid
flowchart TB
   tx1(TX 1) --> tx2(TX 2)
   tx1 --> tx3(TX 3)
   tx2 --> tx4(TX 4)
   tx2 --> tx5(TX 5)
   tx4 --> v1(VTXO 1)
   tx4 --> v2(VTXO 2)
```

5. Alice will need to wait 24 hours to be able to spend her [VTXO](/docs/learn/nomenclature#vtxo-1). This gives enough time to the ASP to prevent any double spend attempts by Alice.
6. Bob can also spend his [VTXO](/docs/learn/nomenclature#vtxo-1) in 24 hours, or do nothing and maintain his [VTXO](/docs/learn/nomenclature#vtxo-1) on the Ark.
