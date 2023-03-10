import { TransactionJSON } from './transaction.js'
import { SignatureJSON } from './wallet.js'

export type SignedTransactionJSON = {
    Message: TransactionJSON
    Signature: SignatureJSON
}

/**
 * Generic rpc error that can be received on any rpc call
 */
export type RpcError = {
    error: {
        message: string
    }
}

/**
 * Nonce or error
 * For more information about MpoolGetNonce, please refer to this {@link https://lotus.filecoin.io/reference/lotus/mpool/#mpoolgetnonce|link}
 */
export type GetNonceResponse =
    | {
        result: number
    }
    | RpcError


/**
 * Gas estimation result or error
 * For more information about how gas fees work, please refer to this {@link https://spec.filecoin.io/systems/filecoin_vm/gas_fee/#section-systems.filecoin_vm.gas_fee|link}
 * For more information about gas fees, please refer to this {@link https://lotus.filecoin.io/reference/lotus/gas/#gasestimatemessagegas|link}
 */
export type GasEstimationResponse =
    | {
        result: { GasFeeCap: string; GasPremium: string; GasLimit: number }
    }
    | RpcError


/**
 * StateWaitMsg result or error
 * For more information about waitMsgState, please refer to this {@link https://lotus.filecoin.io/reference/lotus/state/#statewaitmsg|link}
 */
export type StateWaitMsgResponse =
    | {
    result: {
        Message: { '/': string }
        Receipt: { ExitCode: number; Return: string; GasUsed: number }
        ReturnDec: string
        TipSet: { '/': string }[]
        Height: number
    }
}
    | RpcError

/**
 * MpoolPush successful response
 */
export type MpoolPushOk = {
    result: {
        ['/']: string
    }
}

/**
 * Mempool push result or error
 * For more information about MpoolPush, please refer to this {@link https://lotus.filecoin.io/reference/lotus/mpool/#mpoolpush|link}
 */
export type MpoolPushResponse = MpoolPushOk | RpcError

/**
 * Actor’s state or error
 * For more information about read state, please refer to this {@link https://lotus.filecoin.io/reference/lotus/state/#statereadstate|link}
 */
export type ReadStateResponse = { Balance: string; Code: { '/': string } } | RpcError


/**
 * Balance of the given address at the current head of the chain or error
 * For more information about walletBalance, please refer to this {@link https://lotus.filecoin.io/reference/lotus/wallet/#walletbalance|link}
 */
export type WalletBalanceResponse = { result: string } | RpcError

/**
 * List of miners or rpc error
 */
export type ListMinersResponse =
    | {
    result: string[]
}
    | RpcError

export type BeneficiaryTerm = { Quota: string; UsedQuota: string; Expiration: number }

/**
 * Miner information or rpc error
 */
export type GetMinerInfoResponse =
    | {
    result: {
        Owner: string
        Worker: string
        NewWorker: string
        ControlAddresses: string | null
        WorkerChangeEpoch: number
        PeerId: string
        Multiaddrs: string | null
        WindowPoStProofType: number
        SectorSize: number
        WindowPoStPartitionSectors: number
        ConsensusFaultElapsed: number
        Beneficiary: string
        BeneficiaryTerm: BeneficiaryTerm
        PendingBeneficiaryTerm: BeneficiaryTerm | null
    }
}
    | RpcError

/**
 * Storage conditions for a particular miner, or error
 */
export type AskForStorageResponse =
    | {
    result: {
        Response: {
            Price: string
            VerifiedPrice: string
            MinPieceSize: number
            MaxPieceSize: number
            Miner: string
            Timestamp: number
            Expiry: number
            SeqNo: number
        }
        DealProtocols: string[]
    }
}
    | RpcError
