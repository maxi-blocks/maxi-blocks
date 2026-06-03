import fs from 'fs';
import path from 'path';

describe('link wrapper frontend styles', () => {
	const style = fs.readFileSync(
		path.resolve(process.cwd(), 'src/css/style.scss'),
		'utf8'
	);

	it('keeps the wrapper layout neutral while clipping the linked block hit area to the block radius', () => {
		expect(style).toContain('.maxi-link-wrapper');
		expect(style).toContain('display: contents;');
		expect(style).toContain('> .maxi-block--has-link');
		expect(style).toContain('border-radius: inherit;');
		expect(style).toContain('pointer-events: auto;');
		expect(style).toMatch(
			/&\.maxi-block--disabled::after\s*{\s*cursor: default;\s*pointer-events: none;\s*}/
		);
	});
});
