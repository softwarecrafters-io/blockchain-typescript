import { AsymmetricKeyService } from './services/AsymmetricKeyService';
import { HashGeneratorService } from './services/HashGeneratorService';

export class Wallet {
	constructor(private balance: number, private readonly privateKey: string, readonly publicKey: string) {}

	static createWithInitialBalance() {
		const initialBalance = 100;
		const { privateKey, publicKey } = AsymmetricKeyService.generateKeyPair();

		return new Wallet(initialBalance, privateKey, publicKey);
	}

	sign(transactionData) {
		const hash = HashGeneratorService.generateSHA256(transactionData);
		return AsymmetricKeyService.signHash(this.privateKey, hash);
	}

	toString() {
		const { balance, publicKey } = this;
		return `Wallet - public key: ${publicKey} balance: ${balance}`;
	}

	getBalance() {
		return this.balance;
	}
}
