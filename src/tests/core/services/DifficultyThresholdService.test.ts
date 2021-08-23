import { DifficultyThresholdService, MiningRateRange } from '../../../core/services/DifficultyThresholdService';
import { Block } from '../../../core/Block';

describe('The difficulty threshold service', () => {
	const miningRate = MiningRateRange.create(3000, 5000);

	it('increases the difficulty when the time between blocks is less than the minimum', () => {
		const previousDifficulty = 0;
		const previousBlock = createBlockFrom(10, previousDifficulty);
		const currentBlock = createBlockFrom(10, previousDifficulty);

		const currentDifficulty = DifficultyThresholdService.create(miningRate).calculate(previousBlock, currentBlock);

		expect(currentDifficulty).toBe(1);
	});

	it('decreases the difficulty when the time between blocks is more than the maximum', () => {
		const previousDifficulty = 1;
		const previousBlock = createBlockFrom(10, previousDifficulty);
		const currentBlock = createBlockFrom(5100, previousDifficulty);

		const currentDifficulty = DifficultyThresholdService.create(miningRate).calculate(previousBlock, currentBlock);

		expect(currentDifficulty).toBe(0);
	});

	it('keeps the difficulty when the time between blocks is in range', () => {
		const previousDifficulty = 1;
		const previousBlock = createBlockFrom(0, previousDifficulty);
		const currentBlock = createBlockFrom(3500, previousDifficulty);

		const currentDifficulty = DifficultyThresholdService.create(miningRate).calculate(previousBlock, currentBlock);

		expect(currentDifficulty).toBe(1);
	});
});

function createBlockFrom(timestamp: number, difficulty?: number) {
	return Block.createFrom({
		timestamp: timestamp,
		previousBlockHash: 'irrelevant-hash',
		transactions: 'irrelevant-data',
		nonce: 0,
		difficulty: difficulty,
	});
}

describe('The mining rate range', () => {
	it('does not allow negative minimum number', () => {
		expect(() => MiningRateRange.create(-1, 0)).toThrow();
	});
	it('does not allow maximum number smaller than minimum', () => {
		expect(() => MiningRateRange.create(10, 9)).toThrow();
	});
});
