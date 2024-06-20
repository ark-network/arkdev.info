---
sidebar_position: 4
title: 'Payments'
---

1. **Alice wants to send money to Bob:** Alice asks a service provider (Server) to help.
2. **Creating a Transaction:** Alice and Server create a new [Redeem transaction](./concepts.md#redeem-transaction) that allows Bob to get the money. This transaction has rules:
   - Bob and Server together can claim the money.
   - Alice and Server together can claim the money.
   - Alice alone can claim the money after 1 month.
3. **Making the New Transaction Valid:** The new redeem transaction is set to be valid before the old one by using time locks.
4. **Alice Forfeits the Old Claim:** Alice signs a [Forfeit transaction](./concepts.md#forfeit-transaction) giving up her claim on the old virtual transaction, allowing Server to claim the money if the old transaction is ever published.
5. **Sending the Transaction to Bob:** Alice sends the new redeem transaction to Bob, who can claim the payment by working with Server.
6. **If Bob Doesn't Respond:** If Bob doesn't respond, Alice can:
   - Join the next round herself with Server.
   - Try sending the transaction to another recipient, but this reduces the time lock each time (though this can be managed).

7. **Proof of Payment:** Once Bob performs the claim, Server can provide proof of payment.
8. **If Server Refuses to Cooperate:** If Server refuses to cooperate, Alice can force Server to act by publishing the new redeem transaction, which will reveal if Bob has completed the claim.

![Ark Payment](/img/Payment-Diagram.png)