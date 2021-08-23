import { Block } from '../Block';

export class DifficultyThresholdService {
	private constructor(private readonly miningRateRange: MiningRateRange) {}

	static create(miningRateRange: MiningRateRange) {
		return new DifficultyThresholdService(miningRateRange);
	}

	calculate(previousBlock: Block, currentBlock: Block) {
		const currentDifficulty = currentBlock.difficulty;
		const timeDifferenceBetweenBlocks = currentBlock.timestamp - previousBlock.timestamp;
		if (timeDifferenceBetweenBlocks < this.miningRateRange.min) {
			return currentDifficulty + 1;
		}
		if (timeDifferenceBetweenBlocks > this.miningRateRange.max) {
			return currentDifficulty - 1;
		}
		return currentDifficulty;
	}
}

export class MiningRateRange {
	private constructor(public readonly min: number, public readonly max: number) {}

	static create(minTime: number, maxTime: number) {
		if (minTime < 0) {
			throw 'negative minimum mining rate is not allowed';
		}
		if (maxTime < minTime) {
			throw 'maximum numbers smaller than the minimum are not allowed';
		}
		return new MiningRateRange(minTime, maxTime);
	}
}
