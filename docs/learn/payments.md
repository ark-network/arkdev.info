---
sidebar_position: 4
title: 'Payments'
---

:::info
Credit for this payment protocol goes to [Ruben Somsen](https://github.com/RubenSomsen). You can read more about it [here](https://gist.github.com/RubenSomsen/a394beb1dea9e47e981216768e007454?permalink_comment_id=4633382#gistcomment-4633382).
::::

The Ark payment protocol is a way to send bitcoin to someone else using a service provider, whom helps coordinating sharing UTXO and provide liquidity. Without covenants, sender and receiver would need to be online at the same time to make a payment, but if we include the receiver in VTXO as co-signer, we delegate the receiver to perform the claim of the VTXO when is ready. This way, the receiver can join a round with the Server to claim the VTXO, where the VTXO is a self-spend versus the receiver. If all the senders are also receivers, we can cut the requirement of being online to "lock" the [VTXO tree](./concepts.md#vtxo).

## Timeline

1. **Alice wants to send bitcoin to Bob:** Alice asks the Server to spend from her [VTXO](./concepts.md#vtxo).
2. **Creating the Shortcut Transaction:** Alice and Server create a new off-chain transaction that allows Bob to get a VTXO in the next round. This transaction has rules:
   - Bob and Server together can claim the VTXO.
   - Alice and Server together can claim the VTXO.
   - Alice alone can claim the VTXO after 1 month.
3. **Alice Forfeits the Old Claim:** Alice signs a [Forfeit transaction](./concepts.md#forfeit-transaction) giving up her claim on the old virtual transaction, allowing Server to claim the bitcoin if the old transaction is ever published.
4. **Sending the Transaction to Bob:** Alice sends the new VTXO to Bob, who can claim the payment by working with Server.
5. **If Bob Doesn't Respond:** If Bob doesn't respond, Alice can:
   - Join the next [round](./concepts.md#rounds) herself with Server.
   - Try sending the transaction to another recipient, but this reduces the time lock each time (though this can be managed).
6. **Proof of Payment:** Once Bob performs the claim, Server can provide proof of payment.
7. **If Server Refuses to Cooperate:** If Server refuses to cooperate, Alice can force Server to act by publishing the new redeem transaction, which will reveal if Bob has completed the claim.

## Payment Diagram

![Ark Payment](/img/Payment-Diagram.png)
