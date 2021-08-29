import { Block } from '../Block';
import { BlockChain } from '../Blockchain';

export class DifficultyThresholdService {
	private constructor(private readonly miningRateRange: MiningRateRange, private readonly numberOfBlocks: number) {}

	static create(miningRateRange: MiningRateRange, numberOfBlocks: number) {
		return new DifficultyThresholdService(miningRateRange, numberOfBlocks);
	}

	calculate(blockchain: BlockChain) {
		const currentDifficulty = blockchain.getLastBlock().difficulty;
		if (blockchain.length() < this.numberOfBlocks) {
			return currentDifficulty;
		}
		const lastBlocks = blockchain.getLastBlocks(this.numberOfBlocks);
		const timeDifferenceBetweenBlocks = this.calculateTimeDifferenceBetweenBlocks(lastBlocks);
		if (timeDifferenceBetweenBlocks < this.miningRateRange.min) {
			return currentDifficulty + 1;
		}
		if (currentDifficulty > 0 && timeDifferenceBetweenBlocks > this.miningRateRange.max) {
			return currentDifficulty - 1;
		}
		return currentDifficulty;
	}

	private calculateTimeDifferenceBetweenBlocks(blocks: ReadonlyArray<Block>) {
		return blocks.map((b) => b.timestamp).reduce((previous, current) => current - previous);
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
