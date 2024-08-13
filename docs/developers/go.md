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
go get github.com/ark-network/ark/pkg/client-sdk@latest
```

## Usage

Here's a comprehensive guide on how to use the Ark Go SDK:

### 1. Setting up the Ark Client

The Ark client can be set up with different storage options and configurations. Here's how you can create and initialize an Ark client with different storage options:

#### Using In-Memory Storage (only for testing)

The code snippet below demonstrates how to set up an Ark client with in-memory storage. This will create a neew seed and holds it in the storeSvc variable.

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
        AspUrl:     "localhost:6060",
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
        AspUrl:     "localhost:6060",
        Password:   "password",
        Network:    "bitcoin",  // or "liquid" for Liquid network
    }); err != nil {
        return nil, fmt.Errorf("failed to initialize wallet: %s", err)
    }

    return client, nil
}
```


### 2. Client Configuration Options

The `Init` function accepts various configuration options through the `InitArgs` struct. Here's a breakdown of all available options:

```go
type InitArgs struct {
    ClientType string // Type of client connection (e.g., "grpc" or "rest")
    WalletType string // Type of wallet (e.g., "singlekey" or "hd")
    AspUrl     string // URL of the Ark Service Provider
    Seed       string // Private Key hex encoded for wallet initialization or restoration
    Password   string // Wallet password
}
```

Let's explore each field in detail:

- `ClientType`: Specifies the type of connection to use with the Ark Service Provider. Common values are:
  - `"grpc"`: Uses gRPC for communication (recommended for better performance)
  - `"rest"`: Uses REST API for communication

- `WalletType`: Defines the type of wallet to create or restore. Options include:
  - `"singlekey"`: A wallet using a single key for all transactions
  - `"hd"`: A Hierarchical Deterministic wallet, which generates new addresses for each transaction

- `AspUrl`: The URL of the Ark Service Provider to connect to. For example, `"localhost:6060"` for a local instance.

- `Seed`: A seed phrase or private key used to initialize or restore a wallet. This should be a secure, randomly generated string for new wallets, or the backup seed for restoring an existing wallet.

- `Password`: The password used to encrypt and protect the wallet.

Here's an example of how to use these options when initializing an Ark client:

```go
client, err := arksdk.NewCovenantlessClient(storeSvc)
if err != nil {
    return nil, fmt.Errorf("failed to setup ark client: %s", err)
}

if err := client.Init(context.Background(), arksdk.InitArgs{
    ClientType: arksdk.GrpcClient,
    WalletType: arksdk.SingleKeyWallet,
    AspUrl:     "localhost:6060",
    Seed:       "private key hex-encoded",
    Password:   "your-strong-password",
}); err != nil {
    return nil, fmt.Errorf("failed to initialize wallet: %s", err)
}
```

Note: Always ensure that you keep your seed phrase and password secure. Never share them or store them in plaintext.

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

For a complete end-to-end example demonstrating the usage of the Ark Go SDK, including setting up multiple clients, onboarding, and transferring funds, please refer to our [GitHub repository](https://github.com/ark-network/ark/blob/master/pkg/client-sdk/example/covenantless/alice_to_bob.go).

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub repository](https://github.com/ark-network/ark/issues).

Happy coding with Ark and Go! 🚀
