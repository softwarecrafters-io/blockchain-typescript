import { TransactionMemoryPool } from '../TransactionMemoryPool';
import { Wallet } from '../Wallet';

export class TransactionService {
	constructor(private memoryPool: TransactionMemoryPool, private wallet: Wallet) {}

	createTransaction() {}

	private verifyTransaction() {}
}
