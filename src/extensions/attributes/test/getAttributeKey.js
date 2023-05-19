import getAttributeKey from '../getAttributeKey';

describe('getAttributeKey', () => {
	it('should return the correct key', () => {
		expect(getAttributeKey('test')).toBe('test');
		expect(getAttributeKey('test', true)).toBe('test.h');
		expect(getAttributeKey('test', false, 'test-')).toBe('test-test');
		expect(getAttributeKey('test', true, 'test-')).toBe('test-test.h');
		expect(getAttributeKey('test', false, 'test-', 'md')).toBe(
			'test-test-md'
		);
		expect(getAttributeKey('test', true, 'test-', 'md')).toBe(
			'test-test-md.h'
		);
	});
	it('Should return the correct shortened key', () => {
		expect(getAttributeKey('bc_ps', false, false, 'general')).toBe(
			'bc_ps-general'
		);
	});
});
