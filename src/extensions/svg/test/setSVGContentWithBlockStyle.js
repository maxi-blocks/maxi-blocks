import setSVGContentWithBlockStyle from '@extensions/svg/setSVGContentWithBlockStyle';

describe('setSVGContentWithBlockStyle', () => {
	it('Updates fill and stroke colors in direct attributes', () => {
		const content = `
            <svg>
                <path fill="#000000" stroke="#ffffff" />
                <rect fill="#333333" stroke="#999999" />
            </svg>
        `;
		const fillColor = '#ff0000';
		const strokeColor = '#00ff00';

		const result = setSVGContentWithBlockStyle(
			content,
			fillColor,
			strokeColor
		);

		expect(result).toContain('fill="#ff0000"');
		expect(result).toContain('stroke="#00ff00"');
		expect(result).not.toContain('fill="#000000"');
		expect(result).not.toContain('stroke="#ffffff"');
	});

	it('Does not update fill="none" or stroke="none"', () => {
		const content = `
            <svg>
                <path fill="none" stroke="none" />
            </svg>
        `;
		const fillColor = '#ff0000';
		const strokeColor = '#00ff00';

		const result = setSVGContentWithBlockStyle(
			content,
			fillColor,
			strokeColor
		);

		expect(result).toContain('fill="none"');
		expect(result).toContain('stroke="none"');
	});
});
