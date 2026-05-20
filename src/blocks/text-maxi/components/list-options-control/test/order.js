import fs from 'fs';
import path from 'path';

describe('ListOptionsControl control order', () => {
	it('shows list type and custom marker source controls before sizing controls', () => {
		const source = fs.readFileSync(
			path.join(__dirname, '..', 'index.js'),
			'utf8'
		);

		const typeControl = source.indexOf(
			"label={__('Type of list', 'maxi-blocks')}"
		);
		const styleControl = source.indexOf(
			"label={__('Style', 'maxi-blocks')}"
		);
		const sourceControl = source.indexOf(
			"label={__('Source', 'maxi-blocks')}"
		);
		const sourceInput = source.indexOf(
			"className='maxi-text-inspector__list-source-text'"
		);
		const stylePositionControl = source.indexOf(
			"label={__('List style position', 'maxi-blocks')}"
		);
		const markerSizeControl = source.indexOf(
			"className='maxi-text-inspector__list-marker-size'"
		);

		expect(typeControl).toBeGreaterThanOrEqual(0);
		expect(styleControl).toBeGreaterThan(typeControl);
		expect(sourceControl).toBeGreaterThan(styleControl);
		expect(sourceInput).toBeGreaterThan(sourceControl);
		expect(stylePositionControl).toBeGreaterThan(sourceInput);
		expect(markerSizeControl).toBeGreaterThan(sourceInput);
	});
});
