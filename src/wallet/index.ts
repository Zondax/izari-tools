import * as bip39 from 'bip39'
import * as bip32Default from 'bip32'
import * as ecc from '@bitcoinerlab/secp256k1'
import secp256k1 from 'secp256k1'

import { ExtendedKey } from './extendedkey.js'
import { getCoinTypeFromPath, getDigest, tryToPrivateKeyBuffer } from './utils.js'
import { Transaction } from '../transaction'
import { Network, ProtocolIndicator } from '../address/constants'
import { Signature } from './types'

// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = bip32Default.BIP32Factory(ecc)

export class Wallet {
  static generateMnemonic(): string {
    // 256 so it generate 24 words
    return bip39.generateMnemonic(256)
  }

  static keyDeriveFromSeed(seed: string | Buffer, path: string): ExtendedKey {
    if (typeof seed === 'string') seed = Buffer.from(seed, 'hex')

    const masterKey = bip32.fromSeed(seed)

    const childKey = masterKey.derivePath(path)

    if (!childKey.privateKey) throw new Error('privateKey not generated')

    const network = getCoinTypeFromPath(path) === '1' ? Network.Testnet : Network.Mainnet

    return new ExtendedKey(network, childKey.privateKey)
  }

  static keyDerive(mnemonic: string, path: string, password?: string): ExtendedKey {
    const seed = bip39.mnemonicToSeedSync(mnemonic, password)
    return Wallet.keyDeriveFromSeed(seed, path)
  }

  static keyRecover(network: Network, privateKey: string | Buffer): ExtendedKey {
    privateKey = tryToPrivateKeyBuffer(privateKey)
    return new ExtendedKey(network, privateKey)
  }

  static signTransaction = (privateKey: string | Buffer, tx: string | Transaction): Signature => {
    const serializedTx: ArrayLike<number> = typeof tx === 'string' ? Buffer.from(tx, 'hex') : tx.serialize()

    // verify format and convert to buffer if needed
    privateKey = tryToPrivateKeyBuffer(privateKey)

    const txDigest = getDigest(serializedTx)
    const signature = secp256k1.ecdsaSign(txDigest, privateKey)

    const result: Signature = {
      Data: Buffer.concat([Buffer.from(signature.signature), Buffer.from([signature.recid])]).toString('base64'),
      Type: ProtocolIndicator.SECP256K1,
    }

    return result
  }
}
