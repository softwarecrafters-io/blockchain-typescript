import * as BN from 'bn.js';
import { ec } from 'elliptic';

export class AsymmetricKeyService {
	static generateKeyPair() {
		const ellipticCurve = this.createEllipticCurve();
		const keyPair = ellipticCurve.genKeyPair();
		const privateKey = keyPair.getPrivate().toString('hex') as string;
		const publicKey = keyPair.getPublic().encode('hex') as string;
		return { privateKey, publicKey };
	}

	static signHash(privateKey: string, hash: string) {
		return this.createEllipticCurve().keyFromPrivate(new BN(privateKey, 'hex')).sign(hash).toDER() as number[];
	}

	static verifySignature(publicKey: string, signature: number[], hash: string) {
		return this.createEllipticCurve().keyFromPublic(publicKey, 'hex').verify(hash, signature) as boolean;
	}

	private static createEllipticCurve() {
		return new ec('secp256k1');
	}
}
