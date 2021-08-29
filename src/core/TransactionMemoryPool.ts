import { Transaction } from './Transaction';

export class TransactionMemoryPool {
	private unconfirmedTransactions: Transaction[] = [];

	addOrUpdate(transaction: Transaction) {
		const transactionIndex = this.unconfirmedTransactions.findIndex(({ id }) => id === transaction.id);
		const isTransactionExists = transactionIndex >= 0;
		isTransactionExists
			? (this.unconfirmedTransactions[transactionIndex] = transaction)
			: this.unconfirmedTransactions.push(transaction);
	}

	getUnconfirmedTransactions() {
		return this.unconfirmedTransactions;
	}
}
