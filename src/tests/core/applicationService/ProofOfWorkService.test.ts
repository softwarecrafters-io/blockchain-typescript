import { Block } from '../../../core/Block';
import { ProofOfWorkService } from '../../../core/applicationService/ProofOfWorkService';

describe('The proof of work service', () => {
	it('does not allow negative difficulty threshold', () => {
		expect(() => ProofOfWorkService.create(-1)).toThrow();
	});

	it.concurrent('mines a candidate block with a difficulty threshold of one', () => {
		const block = Block.createFrom({
			timestamp: 0,
			previousBlockHash: 'irrelevant-hash',
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		const proofOfWorkService = ProofOfWorkService.create(1);

		const minedBlock = proofOfWorkService.mineBlock(block);
		expect(minedBlock.hash.substring(0, 1)).toBe('0');
	});

	it.concurrent('mines a candidate block with a difficulty threshold of two', () => {
		const block = Block.createFrom({
			timestamp: 0,
			previousBlockHash: 'irrelevant-hash',
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		const proofOfWorkService = ProofOfWorkService.create(2);

		const minedBlock = proofOfWorkService.mineBlock(block);
		expect(minedBlock.hash.substring(0, 2)).toBe('00');
	});

	it.concurrent('mines a candidate block with a difficulty threshold of three', () => {
		const block = Block.createFrom({
			timestamp: 0,
			previousBlockHash: 'irrelevant-hash',
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		const proofOfWorkService = ProofOfWorkService.create(3);
		const minedBlock = proofOfWorkService.mineBlock(block);
		expect(minedBlock.hash.substring(0, 3)).toBe('000');
	});

	xit('improves concurrent the mining of a candidate block by increasing nonce number', () => {
		const block = Block.createFrom({
			timestamp: 0,
			previousBlockHash: 'irrelevant-hash',
			transactions: 'irrelevant-data',
			nonce: 0,
		});
		const proofOfWorkService = ProofOfWorkService.create(4);
		const timeDefaultNonce = calculatePerformance(proofOfWorkService.mineBlock, block, 0);
		const timeOptimizedNonce = calculatePerformance(proofOfWorkService.mineBlock, block, 10000);

		expect(timeOptimizedNonce).toBeLessThan(timeDefaultNonce);
	});
});

function calculatePerformance(callback, block, nonce) {
	const startTime = Date.now();
	callback(block, nonce);
	const endTime = Date.now();
	return endTime - startTime;
}
