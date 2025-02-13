import setSVGStrokeWidth from '@extensions/svg/setSVGStrokeWidth';

describe('setSVGStrokeWidth', () => {
	it('Returns original content when no width provided', () => {
		const content = '<svg><path stroke-width="2" /></svg>';

		const result = setSVGStrokeWidth(content);

		expect(result).toBe(content);
	});

	it('Updates stroke-width in direct attributes', () => {
		const content = `
            <svg>
                <path stroke-width="2" />
                <rect stroke-width="3" />
            </svg>
        `;
		const width = '4';

		const result = setSVGStrokeWidth(content, width);

		expect(result).toContain('stroke-width="4"');
		expect(result).not.toContain('stroke-width="2"');
		expect(result).not.toContain('stroke-width="3"');
	});
});
