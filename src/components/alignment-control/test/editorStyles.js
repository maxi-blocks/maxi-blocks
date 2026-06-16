import fs from 'fs';
import path from 'path';

describe('AlignmentControl editor styles', () => {
	const editorStyles = fs.readFileSync(
		path.join(__dirname, '../editor.scss'),
		'utf8'
	);
	const inspectorAlignment = fs.readFileSync(
		path.join(__dirname, '../../inspector-tabs/inspector-alignment.js'),
		'utf8'
	);

	it('scopes standalone alignment panel sizing without changing typography', () => {
		expect(inspectorAlignment).toContain(
			"className='maxi-alignment-control--standalone'"
		);
		expect(editorStyles).toContain(
			'&.maxi-alignment-control--standalone'
		);
		expect(editorStyles).toContain('padding: 4px 8px;');
		expect(editorStyles).toContain('align-items: center;');
		expect(editorStyles).toContain('justify-content: center;');
		expect(editorStyles).not.toContain('width: calc((100% - 21px) / 4);');
		expect(editorStyles).not.toContain('gap: 7px;');
	});

	it('keeps the default button spacing used by typography alignment', () => {
		expect(editorStyles).toContain('width: 23%;');
		expect(editorStyles).toContain('margin-right: 7px;');
	});
});
