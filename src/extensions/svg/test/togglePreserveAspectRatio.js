import togglePreserveAspectRatio from '@extensions/svg/togglePreserveAspectRatio';

describe('togglePreserveAspectRatio', () => {
	it('Returns original content when input is not SVG', () => {
		const content = '<div>Not an SVG</div>';
		const result = togglePreserveAspectRatio(content, true);
		expect(result).toBe(content);
	});

	it('Adds preserveAspectRatio attribute when toggle is true', () => {
		const content = '<svg viewBox="0 0 100 100"></svg>';
		const result = togglePreserveAspectRatio(content, true);

		expect(result).toContain('preserveAspectRatio="xMidYMid slice"');
	});

	it('Removes preserveAspectRatio attribute when toggle is false', () => {
		const content =
			'<svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100"></svg>';
		const result = togglePreserveAspectRatio(content, false);

		expect(result).not.toContain('preserveAspectRatio');
	});

	it('Updates existing preserveAspectRatio when toggle is true', () => {
		const content =
			'<svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 100 100"></svg>';
		const result = togglePreserveAspectRatio(content, true);

		expect(result).toContain('preserveAspectRatio="xMidYMid slice"');
		expect(result).not.toContain('preserveAspectRatio="xMinYMin meet"');
	});

	it('Handles empty SVG content', () => {
		const content = '';
		const result = togglePreserveAspectRatio(content, true);

		expect(result).toBe(content);
	});
});
