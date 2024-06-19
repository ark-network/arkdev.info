---
sidebar_position: 5
title: 'Leaving the Ark'
---

### Overview

Alice wants to leave the Ark and get her funds back on-chain. It requires an on-chain transaction.

### Cooperative exit

#### Timeline of events

1. Alice tells ASP she wants to trade [VTXO](/docs/learn/concepts#vtxo) for UTXO
2. ASP (with Alice) prepares next [Round transaction](/docs/learn/concepts#round-transaction):
   - an additional output is added, locked by `Alice`
3. Alice creates a [Forfeit transaction](/docs/learn/concepts#forfeit-transaction):
   - spends from VTXO (1) with `Alice + ASP`
   - adds connector output from Round transaction (2) as input
   - signs it and send it to the ASP
4. ASP broadcasts [Round transaction](/docs/learn/concepts#round-transaction)
5. Alice has now a new UTXO
6. For at most 4 weeks, Alice will be able to double spend her [VTXO](/docs/learn/concepts#vtxo), but if she does it, the ASP will have time (24 hours) to grab the funds from the [VTXO](/docs/learn/concepts#vtxo) to itself using the [Forfeit transaction](/docs/learn/concepts#forfeit-transaction)

### Non-cooperative exit

If ASP is unresponsive, Alice can unilaterally exit revealing the branch of the Round transaction that locks her funds.

#### Timeline of events

1. Assuming a [VTXO](/docs/learn/concepts#vtxo) tree with radix of 2 and 8 [VTXOs](/docs/learn/concepts#vtxo):
![binary tree](/img/binary-tree.png)
2. Assuming VTXO 1 and 2 belong to Alice and Bob
3. Alice reveals the [VTXO](/docs/learn/concepts#vtxo) tree to spend the [Shared Output](/docs/learn/concepts#shared-output).
4. Alice doesn't need to reveal the entire tree, just enough to validate it:
![branch of tree](/img/branch-tree.png)
5. Alice will need to wait 24 hours to be able to spend her [VTXO](/docs/learn/concepts#vtxo). This gives enough time to the ASP to prevent any double spend attempts by Alice.
6. Bob can also spend his [VTXO](/docs/learn/concepts#vtxo) in 24 hours, or do nothing and maintain his [VTXO](/docs/learn/concepts#vtxo) on the Ark.
