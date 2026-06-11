import fs from 'fs';
import path from 'path';

describe('Accordion Maxi editor styles', () => {
	const editorStyles = fs.readFileSync(
		path.join(__dirname, '../editor.scss'),
		'utf8'
	);

	it('does not force grey active border or text on icon position tabs', () => {
		expect(editorStyles).toContain('.maxi-icon-control__position');
		expect(editorStyles).toContain(
			'&[aria-pressed=\'true\'] {\n\t\t\tbackground: var(--maxi-whisper-green) !important;'
		);
		expect(editorStyles).not.toContain(
			'border: 1.5px solid var(--maxi-grey-light);'
		);
		expect(editorStyles).not.toContain(
			'border: 1.5px solid var(--maxi-grey-light);\n\t\tborder-radius: 6px !important;'
		);
		expect(editorStyles).not.toContain(
			'color: var(--maxi-grey-dark);\n\t\ttransition: all 0.2s ease;'
		);
		expect(editorStyles).not.toContain(
			'border: 1.5px solid var(--maxi-grey-light) !important;\n\t\t\tbox-shadow: none;\n\t\t\tcolor: var(--maxi-grey-dark) !important;'
		);
	});
});
