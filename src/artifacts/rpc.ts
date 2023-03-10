import { TransactionJSON } from './transaction.js'
import { SignatureJSON } from './wallet.js'

export type SignedTransactionJSON = {
    Message: TransactionJSON
    Signature: SignatureJSON
}

export type RpcError = {
    error: {
        message: string
    }
}

export type GetNonceResponse =
    | {
    result: number
}
    | RpcError

export type GasEstimationResponse =
    | {
    result: { GasFeeCap: string; GasPremium: string; GasLimit: number }
}
    | RpcError

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

export type MpoolPushOk = {
    result: {
        ['/']: string
    }
}
export type MpoolPushResponse = MpoolPushOk | RpcError

export type ReadStateResponse = { Balance: string; Code: { '/': string } } | RpcError

export type WalletBalanceResponse = { result: string } | RpcError


export type ListMinersResponse =
    | {
    result: string[]
}
    | RpcError

export type BeneficiaryTerm = { Quota: string; UsedQuota: string; Expiration: number }
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
