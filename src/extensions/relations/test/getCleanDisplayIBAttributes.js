import getCleanDisplayIBAttributes from '@extensions/relations/getCleanDisplayIBAttributes';

let blockAttributes = {
	'font-size-unit-general': 'em',
	'font-size-unit-xl': 'px',
	'font-size-general': 10,
	'font-size-xl': 5,
};

describe('getCleanDisplayIBAttributes', () => {
	it('Returns the correct object', () => {
		const IBAttributes = {
			'font-size-general': 6,
			'font-size-unit-general': 'vw',
		};

		const result = getCleanDisplayIBAttributes(
			blockAttributes,
			IBAttributes
		);

		const expectedResult = {
			'font-size-general': 6,
			'font-size-unit-general': 'vw',
		};

		expect(result).toEqual(expectedResult);
	});

	it('Returns the correct object 2', () => {
		const IBAttributes = {
			'font-size-unit-general': 'vw',
			'font-size-general': 6,
			'font-size-xl': 10,
			'font-size-unit-xl': 'em',
		};

		const result = getCleanDisplayIBAttributes(
			blockAttributes,
			IBAttributes
		);

		const expectedResult = {
			'font-size-general': 6,
			'font-size-unit-general': 'vw',
			'font-size-xl': 10,
			'font-size-unit-xl': 'em',
		};

		expect(result).toEqual(expectedResult);
	});

	it('Returns the correct object 3', () => {
		const IBAttributes = {
			'font-size-general': 6,
			'font-size-unit-general': 'vw',
		};

		const result = getCleanDisplayIBAttributes(
			blockAttributes,
			IBAttributes
		);

		const expectedResult = {
			'font-size-general': 6,
			'font-size-unit-general': 'vw',
		};

		expect(result).toEqual(expectedResult);
	});

	it('Returns the correct object 4', () => {
		const IBAttributes = {
			'font-size-unit-general': 'vw',
			'font-size-general': 6,
			'font-size-xl': 10,
			'font-size-unit-xl': 'em',
		};

		const result = getCleanDisplayIBAttributes(
			blockAttributes,
			IBAttributes
		);

		const expectedResult = {
			'font-size-general': 6,
			'font-size-unit-general': 'vw',
			'font-size-xl': 10,
			'font-size-unit-xl': 'em',
		};

		expect(result).toEqual(expectedResult);
	});

	it('Returns the correct object 5', () => {
		const IBAttributes = {
			'font-size-unit-general': 'px',
			'font-size-general': 99,
		};

		blockAttributes = {
			'font-size-unit-general': 'px',
			'font-size-unit-xxl': 'em',
			'font-size-xxl': 2,
		};

		const result = getCleanDisplayIBAttributes(
			blockAttributes,
			IBAttributes
		);

		const expectedResult = {
			'font-size-general': 99,
			'font-size-unit-general': 'px',
		};

		expect(result).toEqual(expectedResult);
	});

	it('Returns the correct object 6', () => {
		const IBAttributes = {
			'font-size-unit-general': 'px',
			'font-size-unit-xxl': 'em',
			'font-size-general': 100,
		};

		blockAttributes = {
			'font-size-general': 99,
			'font-size-unit-general': 'px',
			'font-size-unit-xxl': 'em',
			'font-size-xxl': 2,
		};

		const result = getCleanDisplayIBAttributes(
			blockAttributes,
			IBAttributes
		);

		const expectedResult = {
			'font-size-unit-general': 'px',
			'font-size-unit-xxl': 'em',
			'font-size-general': 100,
		};

		expect(result).toEqual(expectedResult);
	});

	it('Returns the correct object 7', () => {
		const IBAttributes = {
			'font-size-unit-xxl': 'vw',
			'font-size-unit-general': 'px',
			'font-size-general': 100,
		};

		const blockAttributes = {
			'font-size-general': 99,
			'font-size-unit-general': 'px',
			'font-size-unit-xxl': 'em',
			'font-size-xxl': 2,
		};

		const result = getCleanDisplayIBAttributes(
			blockAttributes,
			IBAttributes
		);

		const expectedResult = {
			'font-size-unit-general': 'px',
			'font-size-unit-xxl': 'vw',
			'font-size-general': 100,
		};

		expect(result).toEqual(expectedResult);
	});
});
