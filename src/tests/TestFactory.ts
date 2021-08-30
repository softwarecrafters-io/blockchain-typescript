import { Transaction, TransactionInput } from '../core/Transaction';

export class TransactionFactory {
	static createTransaction({ balance = 100 }) {
		const timestamp = Date.now();
		const publicKey = 'irrelevant';
		const signature = [1, 2];
		const input = TransactionInput.create({ timestamp, balance, publicKey, signature });
		return Transaction.create(input, []);
	}
}
