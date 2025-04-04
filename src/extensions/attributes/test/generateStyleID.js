import generateStyleID from '@extensions/attributes/generateStyleID';

describe('generateStyleID', () => {
	it('Should generate a string starting with "maxi-"', () => {
		const id = generateStyleID();
		expect(id.startsWith('maxi-')).toBe(true);
	});

	it('Should generate unique IDs', () => {
		const id1 = generateStyleID();
		const id2 = generateStyleID();
		expect(id1).not.toBe(id2);
	});

	it('Should generate IDs with correct format', () => {
		const id = generateStyleID();
		// Format should be: maxi-timestamp-randomstring
		// where timestamp is a number and randomstring is 7 chars
		const parts = id.split('-');
		expect(parts.length).toBe(3);
		expect(parts[0]).toBe('maxi');
		expect(Number.isInteger(+parts[1])).toBe(true);
		expect(parts[2].length).toBe(7);
	});
});
