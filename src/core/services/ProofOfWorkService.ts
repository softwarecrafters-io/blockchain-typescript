import { Block } from '../Block';

export class ProofOfWorkService{
	private constructor(private readonly difficultyThreshold:number) {}

	static create(difficultyThreshold:number){
		if(difficultyThreshold < 0){
			throw 'negative difficulty threshold is not allowed';
		}
		return new ProofOfWorkService(difficultyThreshold);
	}

	mineBlock(candidateBlock:Block, timestamp = Date.now().toString()){
		let nonce = 0;
		do{
			nonce++;
			candidateBlock = Block.createFromCandidate({ candidateBlock, timestamp, nonce })
		} while(!candidateBlock.hasValidHash(this.difficultyThreshold))
		return candidateBlock;
	}
}