import { Transaction } from '../../core/Transaction';
import { TransactionMemoryPool } from '../../core/TransactionMemoryPool';

describe('The transaction memory pool', () => {
	it('adds a given unconfirmed transaction', () => {
		const transaction = Transaction.create();
		const memoryPool = new TransactionMemoryPool();

		memoryPool.addOrUpdate(transaction);

		expect(memoryPool.getUnconfirmedTransactions()[0]).toEqual(transaction);
	});

	it('updates an existing unconfirmed transaction', () => {
		const transaction = Transaction.create();
		const memoryPool = new TransactionMemoryPool();

		memoryPool.addOrUpdate(transaction);
		memoryPool.addOrUpdate(transaction);

		expect(memoryPool.getUnconfirmedTransactions()[0]).toEqual(transaction);
		expect(memoryPool.getUnconfirmedTransactions().length).toBe(1);
	});
});
