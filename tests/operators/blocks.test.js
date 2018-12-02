const {of, merge, combineLatest} = require('rxjs');
const {tap} = require('rxjs/operators');
const {isExplorerBeforeMiner, purify} = require('../../src/operators/blocks');

describe('Block operators', () => {
	
	it('purify', () => {
		
		const fn = jest.fn();
		
		// height numbers
		const explorerBlock$ = of(1,1,2,2,3,3);
		
		const minerBlock$ = of(1,2,3);
		
		combineLatest(minerBlock$, explorerBlock$)
			.pipe( purify )
			.subscribe(fn);
		
		expect(fn).toHaveBeenCalledTimes(3)
		
	});
	
	
	it('isExplorerBeforeMiner - true', () => {
		
		const fn = jest.fn();
		
		of({miner:1, explorer:2})
			.pipe(
				isExplorerBeforeMiner,
			)
			.subscribe(fn);
		
		expect(fn).toHaveBeenCalledTimes(1);
		
	});
	
	it('isExplorerBeforeMiner - false', () => {
		
		const fn = jest.fn();
		
		of({miner:2, explorer:1})
			.pipe( isExplorerBeforeMiner)
			.subscribe(fn);
		
		expect(fn).toHaveBeenCalledTimes(0);
	
	})
	
});
