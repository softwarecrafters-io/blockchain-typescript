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
		} while(!this.containsNumberZerosRequiredAtTheBeginningOf(candidateBlock.hash))
		return candidateBlock;
	}

	private containsNumberZerosRequiredAtTheBeginningOf(hash:string){
		const beginningOfHash = hash.substring(0, this.difficultyThreshold);
		const patternAdjustedToDifficulty = '0'.repeat(this.difficultyThreshold);
		return beginningOfHash === patternAdjustedToDifficulty;
	}
}