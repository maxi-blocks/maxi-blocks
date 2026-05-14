import getIconPositionClass from '@extensions/styles/getIconPositionClass';

describe('getIconPositionClass', () => {
	it('Returns empty string when no position is provided', () => {
		const result = getIconPositionClass(null, 'test-class');
		expect(result).toBe('');
	});

	it('Returns empty string when position is empty string', () => {
		const result = getIconPositionClass('', 'test-class');
		expect(result).toBe('');
	});

	it('Returns correct class for valid top position', () => {
		const result = getIconPositionClass('top', 'test-class');
		expect(result).toBe('test-class--icon-top');
	});

	it('Returns correct class for valid bottom position', () => {
		const result = getIconPositionClass('bottom', 'test-class');
		expect(result).toBe('test-class--icon-bottom');
	});

	it('Returns correct class for valid center position', () => {
		const result = getIconPositionClass('center', 'test-class');
		expect(result).toBe('test-class--icon-center');
	});

	it('Returns correct class for valid left position', () => {
		const result = getIconPositionClass('left', 'test-class');
		expect(result).toBe('test-class--icon-left');
	});

	it('Returns correct class for valid right position', () => {
		const result = getIconPositionClass('right', 'test-class');
		expect(result).toBe('test-class--icon-right');
	});

	it('Returns empty string for invalid position', () => {
		const result = getIconPositionClass('invalid', 'test-class');
		expect(result).toBe('');
	});
});
