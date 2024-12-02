---
sidebar_position: 6
title: 'Leaving the Ark'
---

Users can leave the Ark, ie. redeeming their [VTXOs](concepts.md#vtxo) onchain at any time in two different ways: **collaboratively** - by cooperating with the Ark Server - or **unilaterally** - without the server's cooperation.

### Collaborative exit

A user requests to swap a VTXO for a UTXO, instead of another VTXO in the next tree. The server adds an extra output in the next round transaction for the user, who forfeit his VTXO in exchange.

#### Timeline of events

1. Alice tells Server she wants to trade VTXO for UTXO
2. Server (with Alice) prepares next [round transaction](concepts.md#round-transaction):
   - an additional output is added, locked by `Alice`
3. Alice creates a [forfeit transaction](concepts.md#forfeit-transaction):
   - spends the VTXO (1) with `Alice + Server`
   - adds the connector output from round transaction (2) as input
   - signs it and sends it to the Server
4. Server broadcasts the round transaction
5. Alice has now a new UTXO
6. Alice can try to double spend her VTXO by revealing the tree onchain. If she does so, the Server can react by co-signing and broadcasting the forfeit tx once the leaf tx hits the blockchain.

### Unilateral exit

If the Server is unresponsive, a user can unilaterally exit by revealing the branch of the VTXO tree that generates his VTXO.  
The length of the branch can vary and depends on the overall size of the tree - how many leaves it includes.  
This operation can be costly as the user must pay for the cost of broadcasting these transactions and depends on the actual fee rate of the Bitcoin blockchain.

#### Timeline of events

1. Assuming a tree with 8 VTXOs at leaf-level:
![binary tree](/img/binary-tree.png)
2. Assuming VTXO 1 belongs to Alice
3. Alice reveals her branch of the VTXO tree, no need to reveal the whole tree:

![branch of tree](/img/branch-tree.png)

4. The VTXO became a UTXO, but Alice still need to wait 24 hours to be able to spend it. This gives enough time to the Server to prevent any double-spend attempts by Alice.
