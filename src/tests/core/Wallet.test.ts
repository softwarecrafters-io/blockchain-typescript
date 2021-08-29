import { Wallet } from '../../core/Wallet';

describe('The wallet', () => {
	it('creates an instance with initial balance and pair of keys', () => {
		expect(Wallet.createWithInitialBalance().getBalance()).toBe(100);
		expect(Wallet.createWithInitialBalance().publicKey.length).toBe(130);
	});
});
