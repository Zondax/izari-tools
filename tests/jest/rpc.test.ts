import { SignatureType, Wallet, RPC, Address, Transaction, Token } from '../../src'

jest.setTimeout(60 * 1000)

const nodeUrl = process.env.NODE_RPC_URL
const nodeToken = process.env.NODE_RPC_TOKEN
const mnemonic = process.env.ACCOUNT_MNEMONIC
const sender_path = process.env.SENDER_ACCOUNT_PATH

if (!nodeUrl) throw new Error('NODE_RPC_URL must be defined')
if (!nodeToken) throw new Error('NODE_RPC_TOKEN must be defined')
if (!mnemonic) throw new Error('ACCOUNT_MNEMONIC must be defined')
if (!sender_path) throw new Error('SENDER_ACCOUNT_PATH must be defined')

describe('Filecoin RPC', () => {
  test('Unauthorized', async () => {
    const addr = Address.fromString('f410fnw2vjf7s7zk72dmwmvpnuxpgiowkdkehejijqey')
    const rpcNode = new RPC(addr.getNetwork(), { url: nodeUrl, token: `${nodeToken}invalid` })
    const response = await rpcNode.getNonce(addr)

    expect('error' in response).toBe(true)
    expect('error' in response ? response.error.message : null).toBe('401 - Unauthorized')
  })

  test('Get nonce for new account', async () => {
    const addr = Address.fromString('f410fnw2vjf7s7zk72dmwmvpnuxpgiowkdkehejijqey')
    const rpcNode = new RPC(addr.getNetwork(), { url: nodeUrl, token: nodeToken })
    const response = await rpcNode.getNonce(addr)

    expect('error' in response).toBe(true)
    expect('error' in response ? response.error.message : null).toBe(
      'resolution lookup failed (t410fnw2vjf7s7zk72dmwmvpnuxpgiowkdkehejijqey): resolve address t410fnw2vjf7s7zk72dmwmvpnuxpgiowkdkehejijqey: actor not found'
    )
  })

  test('Get nonce for existing account', async () => {
    const addr = Address.fromString('f410fr5lrinnngtqxl36rqvf6ykjm6tkmqi44ehqpybi')
    const rpcNode = new RPC(addr.getNetwork(), { url: nodeUrl, token: nodeToken })
    const response = await rpcNode.getNonce(addr)

    expect('error' in response).toBe(false)
    expect('result' in response ? response.result : null).toBeGreaterThan(0)
  })

  test('Estimate fees for send tx', async () => {
    const address = Address.fromString('f410fr5lrinnngtqxl36rqvf6ykjm6tkmqi44ehqpybi')

    const rpcNode = new RPC(address.getNetwork(), { url: nodeUrl, token: nodeToken })

    const response = await rpcNode.getNonce(address)
    expect('error' in response).toBe(false)
    if ('error' in response) return

    const tx = Transaction.getNew(address, address, '100000', 0)
    tx.nonce = response.result

    const fees = await rpcNode.getGasEstimation(tx)

    expect('error' in fees).toBe(false)
    expect('result' in fees).toBe(true)
    if ('result' in fees) {
      const { GasFeeCap, GasPremium, GasLimit } = fees.result
      expect(GasFeeCap).toBeDefined()
      expect(GasFeeCap).toBeDefined()
      expect(GasFeeCap).toBeDefined()
    }
  })

  test('Get balance for account (0 balance)', async () => {
    const addr = Address.fromString('f410fnw2vjf7s7zk72dmwmvpnuxpgiowkdkehejijqey')
    const rpcNode = new RPC(addr.getNetwork(), { url: nodeUrl, token: nodeToken })
    const response = await rpcNode.walletBalance(addr)

    expect('error' in response).toBe(false)
    expect('result' in response).toBe(true)
    if ('result' in response) expect(response.result).toBe('0')
  })

  test('Get balance for account (some balance)', async () => {
    const senderAccountData = Wallet.deriveAccount(mnemonic, SignatureType.SECP256K1, sender_path)
    const network = senderAccountData.address.getNetwork()

    const rpcNode = new RPC(network, { url: nodeUrl, token: nodeToken })
    const response = await rpcNode.walletBalance(senderAccountData.address)

    expect('error' in response).toBe(false)
    expect('result' in response).toBe(true)
    if ('result' in response) expect(response.result).not.toBe('0')
  })

  test('List miners', async () => {
    const rpcNode = new RPC({ url: nodeUrl, token: nodeToken })
    const response = await rpcNode.listMiners()

    expect('error' in response).toBe(false)
    expect('result' in response).toBe(true)
    if ('result' in response) {
      expect(typeof response.result).toBe('object')
      expect(response.result.length).toBeGreaterThan(0)
    }
  })

  test('Get miner info', async () => {
    const rpcNode = new RPC({ url: nodeUrl, token: nodeToken })
    const response = await rpcNode.getMinerInfo('t01000')

    expect('error' in response).toBe(false)
    expect('result' in response).toBe(true)
    if ('result' in response) {
      const { Owner, Worker, ControlAddresses, PeerId } = response.result
      expect(PeerId).toBe('12D3KooWGJUwebTPdqHzWHGULsQjQ7kC8XX4TEUx4vsmRP5GDTXm')
      expect(Owner).toBe('t0100')
      expect(Worker).toBe('t0100')
      expect(ControlAddresses).toBe(null)
    }
  })

  test('Ask for storage to a miner', async () => {
    const rpcNode = new RPC({ url: nodeUrl, token: nodeToken })
    const response = await rpcNode.askForStorage('t01000', '12D3KooWGJUwebTPdqHzWHGULsQjQ7kC8XX4TEUx4vsmRP5GDTXm')

    expect('error' in response).toBe(false)
    expect('result' in response).toBe(true)
    if ('result' in response) {
      const { Response, DealProtocols } = response.result
      const { Miner, Price, VerifiedPrice, MaxPieceSize, MinPieceSize } = Response

      expect(Miner).toBe('t01000')
      expect(Price).toBe('500000000')
      expect(VerifiedPrice).toBe('50000000')
      expect(MinPieceSize).toBe(256)
      expect(MaxPieceSize).toBe(536870912)

      expect(DealProtocols.length).toBeGreaterThan(0)
    }
  })

  test('Broadcast new transaction', () => {
    // TODO
    // Need to sign a message first in order to test this
  })
})
