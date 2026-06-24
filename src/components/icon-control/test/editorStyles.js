import fs from 'fs';
import path from 'path';

describe('IconControl editor styles', () => {
	const editorStyles = fs.readFileSync(
		path.join(__dirname, '../editor.scss'),
		'utf8'
	);

	it('uses the primary Maxi color for selected icon style tabs', () => {
		expect(editorStyles).toContain('.maxi-icon-styles-control');
		expect(editorStyles).toContain('.maxi-icon-background-tabs-control');
		expect(editorStyles).toContain('.maxi-icon-control__position');
		expect(editorStyles).toContain(
			'color: var(--maxi-primary-color) !important;'
		);
		expect(editorStyles).toContain(
			'border: 1px solid var(--maxi-secondary-color) !important;'
		);
		expect(editorStyles).toContain('transition: none !important;');
		expect(editorStyles).toContain(
			'stroke: var(--maxi-primary-color);'
		);
		expect(editorStyles).not.toContain(
			'box-shadow: 0 0 0 1px var(--maxi-primary-color);'
		);
		expect(editorStyles).not.toContain(
			'border: 1px solid var(--maxi-primary-color) !important;'
		);
		expect(editorStyles).not.toContain(
			'fill: var(--maxi-secondary-color);'
		);
		expect(editorStyles).not.toContain(
			'stroke: var(--maxi-secondary-color);'
		);
	});

	it('centers the three icon alignment buttons without changing borders', () => {
		expect(editorStyles).toContain('.maxi-icon-control__alignment');
		expect(editorStyles).toContain('gap: 0;');
		expect(editorStyles).toContain('justify-content: flex-start;');
		expect(editorStyles).toContain('align-items: center;');
		expect(editorStyles).toContain('justify-content: center;');
		expect(editorStyles).toContain('margin-right: 0 !important;');
		expect(editorStyles).toContain('transition: none !important;');
		expect(editorStyles).toContain('width: calc(100% / 3);');
	});
});
