---
sidebar_position: 6
title: 'Leaving the Ark'
---

Users can leave the Ark, ie. redeeming their VTXOs onchain at any time in two different ways: **collaboratively** - by cooperating with the Ark Server - or **unilaterally** - without the server's cooperation.

### Collaborative exit

A user requests to swap a VTXO for a UTXO, instead of another VTXO in the next tree. The server adds an extra output in the next round transaction for the user, who forfeit his VTXO in exchange.

#### Timeline of events

1. Alice tells Server she wants to trade [VTXO](/docs/learn/concepts#vtxo) for UTXO
2. Server (with Alice) prepares next [Round transaction](/docs/learn/concepts#round-transaction):
   - an additional output is added, locked by `Alice`
3. Alice creates a [Forfeit transaction](/docs/learn/concepts#forfeit-transaction):
   - spends from VTXO (1) with `Alice + Server`
   - adds connector output from Round transaction (2) as input
   - signs it and send it to the Server
4. Server broadcasts [Round transaction](/docs/learn/concepts#round-transaction)
5. Alice has now a new UTXO
6. For at most 4 weeks, Alice will be able to double spend her [VTXO](/docs/learn/concepts#vtxo), but if she does it, the Server will have time (24 hours) to grab the funds from the [VTXO](/docs/learn/concepts#vtxo) to itself using the [Forfeit transaction](/docs/learn/concepts#forfeit-transaction)

### Unilateral exit

If Server is unresponsive, a user can unilaterally exit by revealing the branch of the VTXO tree that generates his VTXO.  
The length of the branch can vary and depends on the overall size of the tree - how many leaves it includes.  
This operation can be costly as the user must pay for the cost of broadcasting these transactions and depends on the actual fee rate of the Bitcoin blockchain.

#### Timeline of events

1. Assuming a tree with 8 VTXOs at leaf-level:
![binary tree](/img/binary-tree.png)
2. Assuming VTXO 1 belongs to Alice
3. Alice reveals her branch of the VTXO tree, no need to reveal it entirely:

![branch of tree](/img/branch-tree.png)

1. The VTXO became a UTXO, but Alice still need to wait 24 hours to be able to spend it. This gives enough time to the Server to prevent any double-spend attempts by Alice.
