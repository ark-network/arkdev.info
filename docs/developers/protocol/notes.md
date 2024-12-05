---
sidebar_position: 3
title: 'Ark Notes'
---

An Ark Note is akin to a **virtual voucher** created by the server and redeemable for VTXOs. A note always starts with the prefix `arknote` and includes the following data:

- **A Unique ID** (uint64): a distinct identifier for tracking each note.
- **Amount in Satoshis**: the amount this note is worth.
- **Server Signature**: a signature from the server on the `ID | amount` hash to validate authenticity.

Here’s an example:

```txt
arknoteTepTrEfaDqq6cpc47jmxkwmeHhgRdmDn36tejLvp7nZ6QzhmeDDy5d27Gy2fwy1M5cpTJ5eMgrD2iA84xrj9qCQoFpR9eopW92rULYbtZ
```

Redeeming a note requires to join a round. It has the same flow as a normal [round](round.md), except that it does not require any forfeit transactions.

### Receiving notes when VTXO is swept

When a VTXO is swept, the server will generate a note for each unspent VTXO and send it to the user via Nostr. To register for notifications, the user must communicate their Nostr identity to the server using [SetNostrRecipient](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L99). 

To register nostr identity, the user must provide a [proof of ownership](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L348-L352). This proof is composed of:
* one of the vtxo script path and the associated control block
* a signature on the vtxo outpoint

The server will then be able to verify the user owns one of the key signing the VTXO script path provided in the proof. The control block is used to verify if the revealed script path belongs to the VTXO taproot tree.

:::tip
The user is also able to unsubscribe the nostr notifications at any time using [DeleteNostrRecipient](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L106).
:::



