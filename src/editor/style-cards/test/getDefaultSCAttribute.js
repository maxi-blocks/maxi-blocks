import getDefaultSCAttribute from '@editor/style-cards/getDefaultSCAttribute';

describe('getDefaultSCAttribute', () => {
	it('should return default value when it exists', () => {
		const SC = {
			defaultStyleCard: {
				typography: {
					'font-size': '16px',
				},
			},
		};

		const result = getDefaultSCAttribute(SC, 'font-size', 'typography');
		expect(result).toBe('16px');
	});

	it('should return color value when default value is a color variable', () => {
		const SC = {
			defaultStyleCard: {
				typography: {
					'font-color': 'var(--maxi-color-1)',
				},
				color: {
					1: 'rgb(255, 0, 0)',
				},
			},
		};

		const result = getDefaultSCAttribute(SC, 'font-color', 'typography');
		expect(result).toBe('rgb(255, 0, 0)');
	});

	it('should return null when SC is empty', () => {
		const result = getDefaultSCAttribute({}, 'font-size', 'typography');
		expect(result).toBeNull();
	});

	it('should return null when attribute does not exist', () => {
		const SC = {
			defaultStyleCard: {
				typography: {
					'font-size': '16px',
				},
			},
		};

		const result = getDefaultSCAttribute(SC, 'non-existent', 'typography');
		expect(result).toBeNull();
	});
});
