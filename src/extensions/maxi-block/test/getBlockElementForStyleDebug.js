import getBlockElementForStyleDebug from '@extensions/maxi-block/getBlockElementForStyleDebug';

describe('getBlockElementForStyleDebug', () => {
	const uniqueID = 'container-maxi-c474f294-u';

	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('finds frontend blocks by id first', () => {
		const frontendBlock = document.createElement('div');
		frontendBlock.id = uniqueID;
		document.body.appendChild(frontendBlock);

		const editorBlock = document.createElement('div');
		editorBlock.className = `maxi-block maxi-block--backend ${uniqueID}`;
		document.body.appendChild(editorBlock);

		expect(getBlockElementForStyleDebug(document, uniqueID)).toEqual({
			element: frontendBlock,
			method: 'id',
		});
	});

	it('finds editor blocks by the generated backend class', () => {
		const editorBlock = document.createElement('div');
		editorBlock.className = `wp-block maxi-block maxi-block--backend ${uniqueID}`;
		document.body.appendChild(editorBlock);

		expect(getBlockElementForStyleDebug(document, uniqueID)).toEqual({
			element: editorBlock,
			method: 'backendClass',
		});
	});

	it('falls back to uniqueID attributes', () => {
		const block = document.createElement('div');
		block.setAttribute('uniqueID', uniqueID);
		document.body.appendChild(block);

		expect(getBlockElementForStyleDebug(document, uniqueID)).toEqual({
			element: block,
			method: 'uniqueIDAttr',
		});
	});

	it('returns an empty lookup when the block is missing', () => {
		expect(getBlockElementForStyleDebug(document, uniqueID)).toEqual({
			element: null,
			method: null,
		});
	});
});
