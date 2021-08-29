import {
	DifficultyThresholdService,
	MiningRateRange,
} from '../../../core/applicationService/DifficultyThresholdService';
import { Block } from '../../../core/Block';
import { BlockChain } from '../../../core/Blockchain';
import { ProofOfWorkService } from '../../../core/applicationService/ProofOfWorkService';
const context = describe;

describe('The difficulty threshold service', () => {
	const miningRate = MiningRateRange.create(3000, 5000);

	it('increases the difficulty when the time between blocks is less than the minimum', () => {
		const previousDifficulty = 0;
		const blockchain = createBlockChainFrom(previousDifficulty, [3001, 3002, 3003]);
		const currentDifficulty = DifficultyThresholdService.create(miningRate, 2).calculate(blockchain);

		expect(currentDifficulty).toBe(1);
	});

	it('decreases the difficulty when the time between blocks is more than the maximum', () => {
		const previousDifficulty = 1;
		const blockchain = createBlockChainFrom(previousDifficulty, [Date.now(), Date.now() + 5001, Date.now() + 10002]);

		const currentDifficulty = DifficultyThresholdService.create(miningRate, 2).calculate(blockchain);

		expect(currentDifficulty).toBe(0);
	});

	it('keeps the difficulty when the time between blocks is in range', () => {
		const previousDifficulty = 0;
		const blockchain = createBlockChainFrom(previousDifficulty, [0, 4000, 8000]);

		const currentDifficulty = DifficultyThresholdService.create(miningRate, 2).calculate(blockchain);

		expect(currentDifficulty).toBe(0);
	});

	function createBlockChainFrom(difficulty: number, timestamps: number[]) {
		const [first, ...rest] = timestamps;
		const blockchain = BlockChain.createFrom(first);
		rest.forEach((t) => {
			blockchain.concatBlock(
				Block.createFrom({
					timestamp: t,
					previousBlockHash: blockchain.getLastBlock().hash,
					transactions: 'irrelevant-data',
					nonce: 0,
					difficulty: difficulty,
				})
			);
		});

		return blockchain;
	}

	context('when difficulty threshold is automatic', () => {
		it('concatenates a new mined block that includes previous hash', () => {
			const previousDifficulty = 0;
			const blockchain = createBlockChainFrom(previousDifficulty, [Date.now(), Date.now() + 10]);
			const candidateBlock = Block.createFrom({
				timestamp: Date.now(),
				previousBlockHash: blockchain.getLastBlock().hash,
				transactions: 'irrelevant-data',
				nonce: 0,
				difficulty: previousDifficulty,
			});
			const minedBlock = ProofOfWorkService.create(previousDifficulty).mineBlock(candidateBlock);
			blockchain.concatBlock(minedBlock, previousDifficulty);
			const difficultyThresholdService = DifficultyThresholdService.create(MiningRateRange.create(30000, 50000), 2);
			const newDifficult = difficultyThresholdService.calculate(blockchain);

			expect(newDifficult).toBe(1);
		});
	});
});

describe('The mining rate range', () => {
	it('does not allow negative minimum number', () => {
		expect(() => MiningRateRange.create(-1, 0)).toThrow();
	});
	it('does not allow maximum number smaller than minimum', () => {
		expect(() => MiningRateRange.create(10, 9)).toThrow();
	});
});
