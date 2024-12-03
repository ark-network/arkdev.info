---
sidebar_position: 4
title: 'Market Hours'
---

Ark faces a bootstrap challenge in its early stages. When the user base is small, participants may find themselves joining rounds alone or with very few others and this situation can lead to higher costs per user.

To address this issue, the Ark Server can aanounce so-called **market hours**, that are specific periods during which service fees to join rounds are lower. The primary goals of Market Hours are:

1. To encourage users to synchronize their activities
2. To increase the number of participants in each round
3. To improve the overall efficiency and cost-effectiveness of the network

Similarly to what happens in traditional markets in town squares, where buyers and sellers gather at specific times to conduct business more efficiently, during market hours, users are incentivized to concentrate their activity and join rounds and settle or refresh their VTXOs, with the aim to:

- Increase the likelihood of multiple users joining the same round
- Distribute transaction costs more efficiently among a larger number of participants
- Provide a more cost-effective experience for all users, especially while the network is still growing

### How it works

Clients can fetch the server's [GetInfo](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L10-L14) endpoint that, among the others, returns info about the [next market hour](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L376-L381) if scheduled:
- `next_start_time` is the timestamp of the next starting market hour - or the current if it's already started.
- `next_end_time` is the ending timestamp of the next market hour
- `period` describes the frequency of market hours so that clients can calculate those following without polling the endpoint
- `round_interval` is the frequency with which the Ark Server generates new rounds