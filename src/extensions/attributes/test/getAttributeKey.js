import getAttributeKey from '../getAttributeKey';

describe('getAttributeKey', () => {
	it('should return the correct key', () => {
		expect(getAttributeKey({ key: 'test' })).toBe('test');
		expect(getAttributeKey({ key: 'test', isHover: true })).toBe('test.h');
		expect(getAttributeKey({ key: 'test', prefix: 'test-' })).toBe(
			'test-test'
		);
		expect(
			getAttributeKey({ key: 'test', isHover: true, prefix: 'test-' })
		).toBe('test-test.h');
		expect(
			getAttributeKey({ key: 'test', prefix: 'test-', breakpoint: 'md' })
		).toBe('test-test-md');
		expect(
			getAttributeKey({
				key: 'test',
				isHover: true,
				prefix: 'test-',
				breakpoint: 'md',
			})
		).toBe('test-test-md.h');
	});
	it('Should return the correct shortened key', () => {
		expect(getAttributeKey({ key: 'bc_ps', breakpoint: 'g' })).toBe(
			'bc_ps-g'
		);
	});
});
