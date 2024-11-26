---
authors: [tiero, brg444]
description: "Leveraging Ark’s VTXO paradigm, Virtual Channels enable efficient, low-cost Bitcoin payment channels by lifting smart contracts off-chain"
image: /img/blog/virtual-channels.jpg
slug: bitcoin-virtual-channels
tags: [ark-protocol, bitcoin, payment-channel, virtual-channel, bitcoin-script, vtxo, utxo]
title: "Bitcoin Virtual Channels: Bringing Instant Settlement To Ark"
---
![Dollars Wrapped](/img/blog/virtual-channels.jpg)

One of the most promising opportunities introduced by Ark is the ability to lift Bitcoin-native contracts onto off-chain trees.
Payment channels are an ideal candidate to showcase this potential.

<!-- truncate -->

While payment channels are widely recognized today within the context of the Lightning Network, earlier proposals explored simpler, unidirectional versions.
The BitcoinJ project [describes](https://bitcoinj.org/working-with-micropayments) one such implementation using [Spillman-style](https://en.bitcoin.it/wiki/Payment_channels#Spillman-style_payment_channels) payment channels to enable high-throughput payments in single direction, from payer to receiver.

The obvious downside of this approach lies in the high setup costs associated with on-chain transactions.

By leveraging the Ark protocol, we propose a solution that eliminates this hurdle, enabling more **efficient and cost-effective** deployment of Bitcoin payment channels which we refer to as **Virtual Channels**


## Spillman-style Payment Channels

All payment channels operate by establishing a funding transaction on the Bitcoin blockchain, locking a specific amount of funds into a multi-signature address shared between the participants. This funding transaction serves as the channel's foundation, requiring an on-chain setup to initiate.

Among the simplest version of this **smart contract** is the standard unidirectional payment channel. A payer funds a contract with a receiver enforcing two possible spending conditions:

- A collaborative settlement signed by both Payer and Receiver
- A unilateral refund path for the Payer after a specified period of time has passed

The core idea is simple: the Payer can transfer funds **instantly** off-chain by signing an updated version of the contract that allocates a larger share of the funds to the Receiver. Once the Receiver validates the signature, the transaction is considered settled—eliminating the need to rely on the Bitcoin blockchain for double-spend protection.

As long as the channel remains active, multiple payments can be executed, with each successive transaction increasing the Receiver's allocated funds.

**Before** the channel expires, the Receiver retains the option to use the Payer's most recent signature, append their own, and broadcast a fully valid Bitcoin transaction. This transaction spends the channel contract, accurately reflecting the latest channel balance with one or more new outputs: the Receiver's payout and, if applicable, the Payer's change.

The expiration is essential to ensure that the Payer can reclaim their funds if the Receiver becomes unresponsive or refuses to cooperate in updating the channel state.

The primary advantage of this design is that it doesn’t require both parties to be online simultaneously. Once the Payer signs an update, they can go offline and disappear. The Receiver only needs to store the latest channel update, eliminating the need for the burdensome backups that have plagued Lightning users and operators.

The most obvious drawback, as the reader might have guessed, is that this approach doesn't scale effectively. An average user is likely to have multiple counterparties, and the on-chain costs associated with setting up channels can become unsustainable over time.

## A Channel Inside a VTXO

The most powerful feature of the VTXO paradigm is its native support for the UTXO model, allowing us to extend the bare VTXO script beyond a single signer using Tapscript. By defining additional spending paths, we can encapsulate multi-party contracts—creating **Virtual Channels** that involve the Payer, Receiver, and Ark server.

The Taproot script paths are as follow:

- **Forfeit**: All parties agree on how to spend the VTXO at any time.
- **Refund and Forfeit**: After a specific block height, payer and server together can spend to refund or create new channel.
- **After 24 hours**: Shared control between payer and receiver after 24hrs the VTXO tree hits the chain.
- **After 48 hours**: Full control to the payer after 48hrs the VTXO tree hits the chain.

### Funding

Once the Payer and Receiver agree on a script template, they collaborate to create a channel by participating in an Ark round. The Payer funds the channel output using their own VTXOs (or a [boarding UTXO](/docs/learn/boarding)), and the Receiver verifies and co-signs the branch of the VTXO tree that contains the leaf representing the virtual channel. This process requires all participants to be online simultaneously and relies on the Server to provide the necessary UTXO liquidity.

### Payment

The Payer creates and sign a PSBT that spends the contract splitting the balance state between Payer and Receiver.

The Receiver receives the partially-signed transaction, stores it for later and delivers the promised good or service.

### Refund

What if the Receiver becomes uncooperative?

There's no need to unroll the virtual tree manually. An absolute timelock allows Payer to forfeit the channel contract together with server, right before the VTXO tree expiration.
### Unilateral Exit

If the Ark server goes offline or fails to respond, the alternative spending path becomes valid. The virtual tree can be unrolled and broadcast to the Bitcoin blockchain, activating the alternative spending path. This ensures that the transaction can still be settled on-chain, preventing funds from being locked indefinitely due to the server's unavailability.

## Show me the code

Do we need to fork the code to support Virtual Channels? Not at all!

From `arkd` v0.4, the Server  doesn't need to explicitly support a specific script template, as long the [forfeit path](/docs/learn/concepts#forfeit-transaction) exists and all the [unilateral redeem path(s)](/docs/learn/concepts#vtxo) are timelocked.

### Script Paths

#### Forfeit

```hack
<PayerPubKey
OP_CHECKSIGVERIFY
<ReceiverPubKey>
OP_CHECKSIGVERIFY
<ServerPubKey>
OP_CHECKSIG
```

#### Refund and Forfeit

```hack
<BlockHeight>
OP_CHECKLOCKTIMEVERIFY
OP_DROP
<PayerPubKey>
OP_CHECKSIGVERIFY
<ServerPubKey>
OP_CHECKSIG
```

#### Channel: Update

```hack
<144>  // 1 day in blocks
OP_CHECKSEQUENCEVERIFY
OP_DROP
<PayerPubKey>
OP_CHECKSIGVERIFY
<ReceiverPubKey>
OP_CHECKSIG
```

#### Channel: Refund

```hack
<288>  // 2 days in blocks
OP_CHECKSEQUENCEVERIFY
OP_DROP
PayerPubKey
OP_CHECKSIG
```


### Opening the channel

The payer [forfeits his own VTXO (or UTXO)](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L24-L29) to fund the channel joining the next round, and together with the receiver, they register an additional [public key](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L141) only used to sign the virtual tree. The taproot tree is revealed at spending time, when registering an input, providing a list of hex-encoded tapscripts.

```protobuf
message Input {
  Outpoint outpoint = 1;
  oneof taproot_tree {
    string descriptor = 2;
    Tapscripts tapscripts = 3;
  }
}
message Tapscripts {
  repeated string scripts = 1;
}

```

### Making payments

Couldn't be easier: Payer signs a PSBT and sends it over to Receiver. Settled instantly and no liquidity required!

### Closing the channel

To close the channel, the Receiver combines the Payer's latest signature with their own and requests the Server to co-sign a redemption transaction that finalizes the channel closure. This transaction can then be settled into normal VTXOs by the Payer and Receiver, either simultaneously or in different future rounds.


---

### **Key Insights**

- The Spillman channel architecture fits well within Ark's framework, leveraging its efficiency to manage liquidity and UTXOs effectively.
- Unlike Lightning channels, unidirectional channels come with significantly reduced risks and overhead. No backups are needed and users are not required to remain online to persist the state of the channel.
- Ark VTXO scripting allows for scaling off-chain use cases beyond single-signature contracts.
