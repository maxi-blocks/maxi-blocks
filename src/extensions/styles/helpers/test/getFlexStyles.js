/**
 * Internal dependencies
 */
import getFlexStyles from '../getFlexStyles';

jest.mock('src/extensions/styles/getLastBreakpointAttribute', () => {
	return jest.fn(({ target, breakpoint, attributes }) => {
		if (!attributes) return null;
		return attributes[
			`${target}${breakpoint === 'general' ? '' : `-${breakpoint}`}`
		];
	});
});

describe('getFlexStyles', () => {
	it('should return empty object when no flex properties are present', () => {
		const result = getFlexStyles({});
		expect(result).toEqual({});
	});

	it('should handle basic flex properties for general breakpoint', () => {
		const obj = {
			'flex-basis': '50',
			'flex-basis-unit': '%',
			'flex-grow': '1',
			'flex-shrink': '0',
		};

		const result = getFlexStyles(obj);
		expect(result.general).toEqual({
			flex: '1 0 50%',
		});
	});

	it('should handle special flex-basis values', () => {
		const obj = {
			'flex-basis': 'content',
			'flex-grow': '1',
			'flex-shrink': '0',
		};

		const result = getFlexStyles(obj);
		expect(result.general).toEqual({
			flex: '1 0 content',
		});
	});

	it('should handle flex layout properties', () => {
		const obj = {
			'flex-wrap': 'wrap',
			'justify-content': 'center',
			'flex-direction': 'column',
			'align-items': 'flex-start',
			'align-content': 'space-between',
		};

		const result = getFlexStyles(obj);
		expect(result.general).toEqual({
			'flex-wrap': 'wrap',
			'justify-content': 'center',
			'flex-direction': 'column',
			'align-items': 'flex-start',
			'align-content': 'space-between',
		});
	});

	it('should handle gap properties with units', () => {
		const obj = {
			'row-gap': '20',
			'row-gap-unit': 'px',
			'column-gap': '2',
			'column-gap-unit': 'rem',
		};

		const result = getFlexStyles(obj);
		expect(result.general).toEqual({
			'row-gap': '20px',
			'column-gap': '2rem',
		});
	});

	it('should handle multiple breakpoints', () => {
		const obj = {
			'flex-basis': '100',
			'flex-basis-unit': '%',
			'flex-basis-m': '50',
			'flex-basis-unit-m': '%',
			'justify-content': 'flex-start',
			'justify-content-m': 'center',
		};

		const result = getFlexStyles(obj);
		expect(result).toEqual({
			general: {
				flex: '0 1 100%',
				'justify-content': 'flex-start',
			},
			m: {
				flex: '0 1 50%',
				'justify-content': 'center',
			},
		});
	});

	it('should handle custom prefix', () => {
		const obj = {
			'custom-flex-basis': '50',
			'custom-flex-basis-unit': '%',
			'custom-justify-content': 'center',
		};

		const result = getFlexStyles(obj, 'custom-');
		expect(result.general).toEqual({
			flex: '0 1 50%',
			'justify-content': 'center',
		});
	});

	it('should handle flex order property', () => {
		const obj = {
			order: '2',
			'order-m': '1',
		};

		const result = getFlexStyles(obj);
		expect(result).toEqual({
			general: {
				order: '2',
			},
			m: {
				order: '1',
			},
		});
	});

	it('should not include empty breakpoint objects', () => {
		const obj = {
			'flex-basis': '100',
			'flex-basis-unit': '%',
			'flex-basis-m': undefined,
		};

		const result = getFlexStyles(obj);
		expect(result).toEqual({
			general: {
				flex: '0 1 100%',
			},
		});
	});
});
