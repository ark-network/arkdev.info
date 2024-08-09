---
sidebar_position: 2
title: '🐹 Go'
---

Welcome to the client-facing Go SDK for Ark! This SDK provides a simple way to integrate Ark functionality into your Go applications.

## Documentation

The complete API documentation for the Go SDK is automatically generated and published on **pkg.go.dev** with each GitHub release. To view the documentation, visit: [https://pkg.go.dev/github.com/ark-network/ark-sdk](https://pkg.go.dev/github.com/ark-network/ark-sdk)

## Installation

To install the Ark Go SDK, use the following command:

```bash
go get github.com/ark-network/ark-sdk@latest
```

## Usage

Here's a comprehensive guide on how to use the Ark Go SDK:

### 1. Setting up the Ark Client

The Ark client can be set up with different storage options and configurations. Here's how you can create and initialize an Ark client:

#### Using In-Memory Storage (for testing)

```go
import (
    arksdk "github.com/ark-network/ark-sdk"
    inmemorystore "github.com/ark-network/ark-sdk/store/inmemory"
)

func setupInMemoryArkClient() (arksdk.ArkClient, error) {
    storeSvc, err := inmemorystore.NewConfigStore()
    if err != nil {
        return nil, fmt.Errorf("failed to setup store: %s", err)
    }

    client, err := arksdk.NewCovenantlessClient(storeSvc)
    if err != nil {
        return nil, fmt.Errorf("failed to setup ark client: %s", err)
    }

    if err := client.Init(context.Background(), arksdk.InitArgs{
        WalletType: arksdk.SingleKeyWallet,
        ClientType: arksdk.GrpcClient,
        AspUrl:     "localhost:8080",
        Password:   "password",
    }); err != nil {
        return nil, fmt.Errorf("failed to initialize wallet: %s", err)
    }

    return client, nil
}
```

#### Using Persistent File Storage

For production use, it's recommended to use persistent storage. Here's how you can set up a file-based storage:

```go
import (
    arksdk "github.com/ark-network/ark-sdk"
    filestore "github.com/ark-network/ark-sdk/store/file"
)

func setupFileBasedArkClient() (arksdk.ArkClient, error) {
    storeSvc, err := filestore.NewConfigStore("/path/to/storage/directory")
    if err != nil {
        return nil, fmt.Errorf("failed to setup file store: %s", err)
    }

    client, err := arksdk.NewCovenantlessClient(storeSvc)
    if err != nil {
        return nil, fmt.Errorf("failed to setup ark client: %s", err)
    }

    if err := client.Init(context.Background(), arksdk.InitArgs{
        WalletType: arksdk.SingleKeyWallet,
        ClientType: arksdk.GrpcClient,
        AspUrl:     "localhost:8080",
        Password:   "password",
        Network:    "bitcoin",  // or "liquid" for Liquid network
    }); err != nil {
        return nil, fmt.Errorf("failed to initialize wallet: %s", err)
    }

    return client, nil
}
```

### 2. Client Configuration Options

The `Init` function accepts various configuration options. Here's a breakdown of all available options:

```go
type InitArgs struct {
    WalletType string  // "singlekey" or "hd"
    ClientType string  // "grpc" or "rest"
    AspUrl     string  // URL of the Ark Service Provider
    Password   string  // Wallet password
    Network    string  // "bitcoin" or "liquid"
    Mnemonic   string  // Optional: Mnemonic for wallet restoration
    PrivateKey string  // Optional: Private key for wallet restoration
}
```

### 3. Wallet Operations

#### Unlock and Lock the Wallet

```go
if err := arkClient.Unlock(ctx, password); err != nil {
    log.Fatal(err)
}
defer arkClient.Lock(ctx, password)
```

#### Receive Funds

```go
offchainAddr, onchainAddr, err := arkClient.Receive(ctx)
if err != nil {
    log.Fatal(err)
}
log.Infof("Offchain address: %s", offchainAddr)
log.Infof("Onchain address: %s", onchainAddr)
```

#### Check Balance

```go
balance, err := arkClient.Balance(ctx, false)
if err != nil {
    log.Fatal(err)
}
log.Infof("Onchain balance: %d", balance.OnchainBalance.SpendableAmount)
log.Infof("Offchain balance: %d", balance.OffchainBalance.Total)
```

#### Onboard Funds

```go
onboardAmount := uint64(20000)
txid, err := arkClient.Onboard(ctx, onboardAmount)
if err != nil {
    log.Fatal(err)
}
log.Infof("Onboarded with tx: %s", txid)
```

#### Send Offchain

```go
amount := uint64(1000)
receivers := []arksdk.Receiver{
    arksdk.NewBitcoinReceiver(recipientOffchainAddr, amount),
}
txid, err = arkClient.SendOffChain(ctx, false, receivers)
if err != nil {
    log.Fatal(err)
}
log.Infof("Payment completed in round tx: %s", txid)
```

### 4. Advanced Usage

#### Multiple Recipients

You can send to multiple recipients in a single transaction:

```go
receivers := []arksdk.Receiver{
    arksdk.NewBitcoinReceiver(recipient1OffchainAddr, amount1),
    arksdk.NewBitcoinReceiver(recipient2OffchainAddr, amount2),
}
txid, err = arkClient.SendOffChain(ctx, false, receivers)
```

#### Redeem Funds

To move funds from offchain to onchain:

```go
txid, err := arkClient.Redeem(ctx, redeemAmount, onchainAddress)
if err != nil {
    log.Fatal(err)
}
log.Infof("Redeemed with tx: %s", txid)
```

## Full Example

For a complete end-to-end example demonstrating the usage of the Ark Go SDK, including setting up multiple clients, onboarding, and transferring funds, please refer to our [GitHub repository](https://github.com/ark-network/ark-sdk/examples/covenant_example.go).

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub repository](https://github.com/ark-network/ark-sdk/issues).

Happy coding with Ark and Go! 🚀
