import fs from 'fs';
import path from 'path';

describe('Accordion Maxi editor styles', () => {
	const editorStyles = fs.readFileSync(
		path.join(__dirname, '../editor.scss'),
		'utf8'
	).replace(/\r\n/g, '\n');
	const iconPositionStyles = editorStyles.slice(
		editorStyles.indexOf(
			'.maxi-icon-control__position {\n\t.maxi-tabs-control__button'
		),
		editorStyles.indexOf('\n}\n\n.maxi-icon-styles-control')
	);

	it('does not force grey active border or text on icon position tabs', () => {
		expect(iconPositionStyles).toContain('.maxi-icon-control__position');
		expect(iconPositionStyles).toContain("&[aria-pressed='true']");
		expect(iconPositionStyles).toContain(
			'background: var(--maxi-whisper-green) !important;'
		);
		expect(iconPositionStyles).not.toContain(
			'border: 1.5px solid var(--maxi-grey-light);'
		);
		expect(iconPositionStyles).not.toContain(
			'border: 1.5px solid var(--maxi-grey-light);\n\t\tborder-radius: 6px !important;'
		);
		expect(iconPositionStyles).not.toContain(
			'color: var(--maxi-grey-dark);\n\t\ttransition: all 0.2s ease;'
		);
		expect(iconPositionStyles).not.toContain(
			'border: 1.5px solid var(--maxi-grey-light) !important;\n\t\t\tbox-shadow: none;\n\t\t\tcolor: var(--maxi-grey-dark) !important;'
		);
	});
});
