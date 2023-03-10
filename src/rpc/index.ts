import axios, { AxiosInstance } from 'axios'
import {
  AskForStorageResponse,
  GasEstimationResponse,
  GetMinerInfoResponse,
  GetNonceResponse, ListMinersResponse,
  MpoolPushOk,
  MpoolPushResponse,
  ReadStateResponse,
  RpcError,
  StateWaitMsgResponse,
  WalletBalanceResponse,
} from '../artifacts/rpc.js'
import { Network } from '../artifacts/index.js'
import { Address } from '../address/index.js'
import { Transaction } from '../transaction/index.js'
import { Signature } from '../wallet/index.js'
import {ClientQueryAsk, MpoolGetNonce, MpoolPush, RpcVersion, StateListMiners, StateMinerInfo} from "./constants";

type Args = { url: string; token: string }

/**
 * In order to interact with a node remotely, filecoin nodes implement the rpc protocol. By this communication, there are a set of predefined actions
 * that can be executed on the node: from fetching information about accounts and miners, fetch address balance to broadcast new transactions.
 * In order to run certain actions ta require write permission, like broadcasting a new tx to the node, a token will be required.
 * For more information about the filecoin rpc, please refer to this {@link https://docs.filecoin.io/developers/reference/json-rpc/introduction|link}
 * If you want to check the full list of actions, please refer to this {@link https://lotus.filecoin.io/reference/basics/overview/|link}
 * For more information about RPC, please refer to this {@link https://en.wikipedia.org/wiki/Remote_procedure_call|link}
 */
export class RPC {
  /**
   * Http client used to communicate to the node
   */
  protected fetcher: AxiosInstance

  /**
   * Indicates which network this RPC interacts with
   */
  protected network

  /**
   * Create a new RPC instance
   * @param network - indicates which network this RPC will be allowed to talk to
   * @param args - required connection parameters
   */
  constructor(network: Network, args: Args) {
    this.fetcher = axios.create({
      baseURL: args.url,
      headers: { Authorization: `Bearer ${args.token}` },
    })

    this.network = network
  }

  /**
   * Allows to get the next address nonce, required to broadcast a new tx to the blockchain
   * For more information about MpoolGetNonce, please refer to this {@link https://lotus.filecoin.io/reference/lotus/mpool/#mpoolgetnonce|link}
   * @param address - address which next nonce to query
   * @returns the next nonce or error
   */
  async getNonce(address: Address): Promise<GetNonceResponse> {
    this.validateNetwork(address)

    try {
      const response = await this.fetcher.post('', {
        jsonrpc: RpcVersion,
        method: MpoolGetNonce,
        id: 1,
        params: [address.toString()],
      })
      return response.data as GetNonceResponse
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  /**
   * Allows to send a new transaction to the blockchain
   * For more information about MpoolPush, please refer to this {@link https://lotus.filecoin.io/reference/lotus/mpool/#mpoolpush|link}
   * @param tx - transaction to be broadcast
   * @param signature - transaction signature to be broadcast
   * @returns the cid related to the tx or error
   */
  async broadcastTransaction(tx: Transaction, signature: Signature): Promise<MpoolPushResponse> {
    this.validateNetwork(tx.to, 'receiver')
    this.validateNetwork(tx.from, 'sender')

    try {
      const mpoolResponse = await this.fetcher.post<MpoolPushResponse>('', {
        jsonrpc: RpcVersion,
        method: MpoolPush,
        id: 1,
        params: [{ Message: tx.toJSON(), Signature: signature.toJSON() }],
      })

      return mpoolResponse.data
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  /**
   * Allows to get the proper fees values required to broadcast a new tx to the blockchain
   * For more information about how gas fees work, please refer to this {@link https://spec.filecoin.io/systems/filecoin_vm/gas_fee/#section-systems.filecoin_vm.gas_fee|link}
   * For more information about gas fees, please refer to this {@link https://lotus.filecoin.io/reference/lotus/gas/#gasestimatemessagegas|link}
   * @param tx - transaction that is intended to be broadcast
   * @returns the fees values or error
   */
  async getGasEstimation(tx: Transaction): Promise<GasEstimationResponse> {
    this.validateNetwork(tx.to, 'receiver')
    this.validateNetwork(tx.from, 'sender')

    try {
      const response = await this.fetcher.post('', {
        jsonrpc: '2.0',
        method: 'Filecoin.GasEstimateMessageGas',
        id: 1,
        params: [tx.toJSON(), { MaxFee: '0' }, null],
      })

      return response.data as GasEstimationResponse
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  /**
   * Returns the indicated actor’s state.
   * For more information about read state, please refer to this {@link https://lotus.filecoin.io/reference/lotus/state/#statereadstate|link}
   * @param address - address to read state
   * @returns the state or error
   */
  async readState(address: Address): Promise<ReadStateResponse> {
    this.validateNetwork(address)

    try {
      const response = await this.fetcher.post('', {
        jsonrpc: '2.0',
        method: 'Filecoin.StateReadState',
        id: 1,
        params: [address.toString(), null],
      })

      return response.data as ReadStateResponse
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  /**
   * Allows to look back in the chain for a message. If not found, it blocks until the message arrives on chain, and gets to the indicated confidence depth.
   * For more information about waitMsgState, please refer to this {@link https://lotus.filecoin.io/reference/lotus/state/#statewaitmsg|link}
   * @param cid - transaction cid to wait
   * @returns the transaction state or error
   */
  async waitMsgState(cid: MpoolPushOk['result']): Promise<StateWaitMsgResponse> {
    try {
      const response = await this.fetcher.post('', {
        jsonrpc: '2.0',
        method: 'Filecoin.StateWaitMsg',
        id: 1,
        params: [cid, 0, null, false],
      })
      return response.data as StateWaitMsgResponse
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  /**
   * Returns the balance of the given address at the current head of the chain.
   * For more information about waitMsgState, please refer to this {@link https://lotus.filecoin.io/reference/lotus/wallet/#walletbalance|link}
   * @param address - address to fetch balance from
   * @returns the actual balance or error
   */
  async walletBalance(address: Address): Promise<WalletBalanceResponse> {
    this.validateNetwork(address)

    try {
      const response = await this.fetcher.post('', {
        jsonrpc: '2.0',
        method: 'Filecoin.WalletBalance',
        id: 1,
        params: [address.toString()],
      })
      return response.data as WalletBalanceResponse
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  /**
   * Handle errors coming from the fetcher (axios) instance
   * For more information about error handling, please refer to this {@link https://axios-http.com/docs/handling_errors|link}
   * @param e - unknown error type
   * @returns a specific formatted error
   */
  async listMiners(): Promise<ListMinersResponse> {
    try {
      const response = await this.fetcher.post('', {
        jsonrpc: RpcVersion,
        method: StateListMiners,
        id: 1,
        params: [null],
      })

      return response.data as ListMinersResponse
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  async getMinerInfo(minerAddr: string): Promise<GetMinerInfoResponse> {
    try {
      const response = await this.fetcher.post('', {
        jsonrpc: RpcVersion,
        method: StateMinerInfo,
        id: 1,
        params: [minerAddr, null],
      })

      return response.data as GetMinerInfoResponse
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  async askForStorage(minerAddr: string, peerId: string): Promise<AskForStorageResponse> {
    try {
      const response = await this.fetcher.post('', {
        jsonrpc: RpcVersion,
        method: ClientQueryAsk,
        id: 1,
        params: [peerId, minerAddr],
      })

      return response.data as AskForStorageResponse
    } catch (e: unknown) {
      return this.handleError<RpcError>(e)
    }
  }

  private handleError<T>(e: unknown): T {
    if (axios.isAxiosError(e)) {
      if (e.response) {
        if (e.response.data) return e.response.data as T
        if (e.response.statusText) return { error: { message: `${e.response.status} - ${e.response.statusText}` } } as T
      }
      if (e.request) return { error: { message: 'request made but no response received' } } as T
      if (e.message) return { error: { message: e.message } } as T
    }
    throw e
  }

  private validateNetwork = (address: Address, description = 'address') => {
    if (address.getNetwork() !== this.network) throw new Error(`${description} belongs to ${address.getNetwork()} network while rpc allows ${this.network}`)
  }
}

/**
 * Filecoin RPC connection preloaded to interact with mainnet environment
 */
export class MainnetRPC extends RPC {
  constructor(args: Args) {
    super(Network.Mainnet, args)
  }
}

/**
 * Filecoin RPC connection preloaded to interact with testnet environment
 */
export class TestnetRPC extends RPC {
  constructor(args: Args) {
    super(Network.Testnet, args)
  }
}
