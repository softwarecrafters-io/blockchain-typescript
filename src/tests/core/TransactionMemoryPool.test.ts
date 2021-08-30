import { TransactionMemoryPool } from '../../core/TransactionMemoryPool';
import { TransactionFactory } from '../TestFactory';

describe('The transaction memory pool', () => {
	it('adds a given unconfirmed transaction', () => {
		const transaction = TransactionFactory.createTransaction({});
		const memoryPool = new TransactionMemoryPool();

		memoryPool.addOrUpdate(transaction);

		expect(memoryPool.getUnconfirmedTransactions()[0]).toEqual(transaction);
	});

	it('updates an existing unconfirmed transaction', () => {
		const transaction = TransactionFactory.createTransaction({});
		const memoryPool = new TransactionMemoryPool();

		memoryPool.addOrUpdate(transaction);
		memoryPool.addOrUpdate(transaction);

		expect(memoryPool.getUnconfirmedTransactions()[0]).toEqual(transaction);
		expect(memoryPool.getUnconfirmedTransactions().length).toBe(1);
	});

	it('removes all transactions', () => {
		const transaction = TransactionFactory.createTransaction({});
		const memoryPool = new TransactionMemoryPool();
		memoryPool.addOrUpdate(transaction);
		memoryPool.removeAll();

		expect(memoryPool.getUnconfirmedTransactions().length).toEqual(0);
	});
});
