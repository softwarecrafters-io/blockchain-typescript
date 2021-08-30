import { HashGeneratorService } from './services/HashGeneratorService';

export class Transaction {
	private constructor(
		public readonly id: string,
		public readonly input: TransactionInput,
		public readonly outputs: ReadonlyArray<TransactionOutput>
	) {}

	static create(input: InputProps, outputs: ReadonlyArray<TransactionOutput>) {
		const id = HashGeneratorService.generateUniqueIdentifier();
		return new Transaction(id, input, outputs);
	}

	concatOutput(output: OutputProps) {
		const { id, input, outputs } = this;
		return new Transaction(id, input, outputs.concat(output));
	}
}

type InputProps = {
	timestamp: number;
	balance: number;
	publicKey: string;
	signature: Array<number>;
};

export class TransactionInput {
	readonly timestamp: number;
	readonly balance: number;
	readonly publicKey: string;
	readonly signature: Array<number>;

	private constructor(inputProps: InputProps) {
		this.timestamp = inputProps.timestamp;
		this.balance = inputProps.balance;
		this.publicKey = inputProps.publicKey;
		this.signature = inputProps.signature;
	}

	static create(inputProps: InputProps) {
		return new TransactionInput(inputProps);
	}
}

type OutputProps = {
	balance: number;
	publicKey: string;
};

export class TransactionOutput {
	private constructor(public readonly balance: number, public readonly publicKey: string) {}

	static create(balance: number, publicKey: string) {
		return new TransactionOutput(balance, publicKey);
	}
}
