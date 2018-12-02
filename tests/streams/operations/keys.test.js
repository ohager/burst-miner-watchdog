const {of} = require('rxjs');
const {exitKey, key} = require('../../../src/streams/operations/keys');

test('Keys effects - exitKey', () => {
	
	const fn = jest.fn();
	
	const key$ = of(
		{name: 'a', sequence: ''},
		{name: 'escape', sequence: ''},
		{name: 'b', sequence: '\u0003'},
	);
	
	key$.pipe(exitKey).subscribe(fn);
	
	expect(fn).toHaveBeenCalledTimes(2)
	
});
