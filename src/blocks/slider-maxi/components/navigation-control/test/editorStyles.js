import fs from 'fs';
import path from 'path';

describe('Slider navigation icon control editor styles', () => {
	const editorStyles = fs.readFileSync(
		path.join(__dirname, '../editor.scss'),
		'utf8'
	);

	it('uses the secondary Maxi border for selected icon background tabs', () => {
		expect(editorStyles).toContain(
			'&.maxi-tabs-control__button--selected'
		);
		expect(editorStyles).toContain(
			'border: 1px solid var(--maxi-secondary-color);'
		);
		expect(editorStyles).not.toContain(
			'border: 1px solid var(--maxi-primary-color);'
		);
	});
});
