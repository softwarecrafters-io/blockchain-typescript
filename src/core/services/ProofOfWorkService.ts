import { Block } from '../Block';

export class ProofOfWorkService {
	private constructor(private readonly difficultyThreshold: number) {}

	static create(difficultyThreshold: number) {
		if (difficultyThreshold < 0) {
			throw 'negative difficulty threshold is not allowed';
		}
		return new ProofOfWorkService(difficultyThreshold);
	}

	mineBlock = (candidateBlock: Block, nonce = 0) => {
		do {
			const timestamp = Date.now().toString();
			nonce++;
			candidateBlock = Block.createFromCandidate({ candidateBlock, timestamp, nonce });
		} while (!candidateBlock.hasValidHash(this.difficultyThreshold));
		console.log('nonce: ', nonce);
		return candidateBlock;
	};
}
