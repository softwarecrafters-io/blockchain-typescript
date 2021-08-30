import { TransactionFactory } from '../TestFactory';
import { TransactionOutput } from '../../core/Transaction';

describe('The transaction', () => {
	it('concatenates a valid output', () => {
		const transaction = TransactionFactory.createTransaction({});
		const output = TransactionOutput.create(10, 'irrelevant');

		const result = transaction.concatOutput(output);
		const lastOutput = result.outputs[result.outputs.length - 1];

		expect(lastOutput).toEqual(output);
	});
});
