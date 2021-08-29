import { AsymmetricKeyService } from './services/AsymmetricKeyService';

export class Wallet {
	constructor(private balance: number, private readonly privateKey: string, readonly publicKey: string) {}

	static createWithInitialBalance() {
		const initialBalance = 100;
		const { privateKey, publicKey } = AsymmetricKeyService.generateKeyPair();

		return new Wallet(initialBalance, privateKey, publicKey);
	}

	toString() {
		const { balance, publicKey } = this;
		return `Wallet - public key: ${publicKey} balance: ${balance}`;
	}

	getBalance() {
		return this.balance;
	}
}
