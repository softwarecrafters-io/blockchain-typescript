export class ProofOfWorkService{
	private constructor(private readonly difficultyThreshold:number) {}

	static create(difficultyThreshold:number){
		if(difficultyThreshold < 0){
			throw 'negative difficulty threshold is not allowed';
		}
		return new ProofOfWorkService(difficultyThreshold);
	}
}