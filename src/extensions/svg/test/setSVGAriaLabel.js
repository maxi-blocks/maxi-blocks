import setSVGAriaLabel from '@extensions/svg/setSVGAriaLabel';

describe('setSVGAriaLabel', () => {
	it('Returns null when no SVG is found', () => {
		const getIcon = () => '<div>Not an SVG</div>';
		const result = setSVGAriaLabel('Test Label', getIcon, 'target');

		expect(result).toBeNull();
	});

	it('Sets aria-label on SVG element', () => {
		const getIcon = () => '<svg><path d="M10 10" /></svg>';
		const result = setSVGAriaLabel('Test Label', getIcon, 'target');

		expect(result).toContain('aria-label="Test Label"');
	});

	it('Updates existing aria-label on SVG element', () => {
		const getIcon = () =>
			'<svg aria-label="Old Label"><path d="M10 10" /></svg>';
		const result = setSVGAriaLabel('New Label', getIcon, 'target');

		expect(result).toContain('aria-label="New Label"');
		expect(result).not.toContain('aria-label="Old Label"');
	});

	it('Preserves other SVG attributes while setting aria-label', () => {
		const getIcon = () =>
			'<svg viewBox="0 0 100 100" fill="none"><path d="M10 10" /></svg>';
		const result = setSVGAriaLabel('Test Label', getIcon, 'target');

		expect(result).toContain('aria-label="Test Label"');
		expect(result).toContain('viewBox="0 0 100 100"');
		expect(result).toContain('fill="none"');
	});

	it('Handles empty label value', () => {
		const getIcon = () => '<svg><path d="M10 10" /></svg>';
		const result = setSVGAriaLabel('', getIcon, 'target');

		expect(result).toContain('aria-label=""');
	});
});
