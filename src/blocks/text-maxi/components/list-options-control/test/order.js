import fs from 'fs';
import path from 'path';

const getIndex = (source, search) => {
	const index = source.indexOf(search);
	expect(index).toBeGreaterThanOrEqual(0);

	return index;
};

describe('ListOptionsControl control order', () => {
	it('groups list options by setup, marker appearance, placement, and spacing', () => {
		const source = fs.readFileSync(
			path.join(__dirname, '..', 'index.js'),
			'utf8'
		);

		const typeControl = getIndex(
			source,
			"label={__('Type of list', 'maxi-blocks')}"
		);
		const styleControl = getIndex(
			source,
			"label={__('Style', 'maxi-blocks')}"
		);
		const startControl = getIndex(
			source,
			"label={__('Start from', 'maxi-blocks')}"
		);
		const reverseControl = getIndex(
			source,
			"label={__('Reverse order', 'maxi-blocks')}"
		);
		const sourceControl = getIndex(
			source,
			"label={__('Source', 'maxi-blocks')}"
		);
		const sourceInput = getIndex(
			source,
			"className='maxi-text-inspector__list-source-text'"
		);
		const firstSeparator = source.indexOf('<ListOptionsSeparator />');
		const markerColorControl = getIndex(
			source,
			"label={__('Marker', 'maxi-blocks')}"
		);
		const markerSizeControl = getIndex(
			source,
			"className='maxi-text-inspector__list-marker-size'"
		);
		const markerHeightControl = getIndex(
			source,
			"label={__('Marker height', 'maxi-blocks')}"
		);
		const secondSeparator = source.indexOf(
			'<ListOptionsSeparator />',
			firstSeparator + 1
		);
		const stylePositionControl = getIndex(
			source,
			"label={__('List style position', 'maxi-blocks')}"
		);
		const markerIndentControl = getIndex(
			source,
			"label={__('Marker indent', 'maxi-blocks')}"
		);
		const markerOffsetControl = getIndex(
			source,
			"label={__('Marker vertical offset', 'maxi-blocks')}"
		);
		const markerLineHeightControl = getIndex(
			source,
			"label={__('Marker line-height', 'maxi-blocks')}"
		);
		const textPositionControl = getIndex(
			source,
			"label={__('Text position', 'maxi-blocks')}"
		);
		const thirdSeparator = source.indexOf(
			'<ListOptionsSeparator />',
			secondSeparator + 1
		);
		const textIndentControl = getIndex(
			source,
			"label={__('Text indent', 'maxi-blocks')}"
		);
		const listGapControl = getIndex(
			source,
			"label={__('List gap', 'maxi-blocks')}"
		);
		const paragraphSpacingControl = getIndex(
			source,
			"label={__('Paragraph spacing', 'maxi-blocks')}"
		);

		expect(styleControl).toBeGreaterThan(typeControl);
		expect(startControl).toBeGreaterThan(styleControl);
		expect(reverseControl).toBeGreaterThan(startControl);
		expect(sourceControl).toBeGreaterThan(styleControl);
		expect(sourceInput).toBeGreaterThan(sourceControl);

		expect(firstSeparator).toBeGreaterThan(sourceInput);
		expect(markerColorControl).toBeGreaterThan(firstSeparator);
		expect(markerSizeControl).toBeGreaterThan(markerColorControl);
		expect(markerHeightControl).toBeGreaterThan(markerSizeControl);

		expect(secondSeparator).toBeGreaterThan(markerHeightControl);
		expect(stylePositionControl).toBeGreaterThan(secondSeparator);
		expect(markerIndentControl).toBeGreaterThan(stylePositionControl);
		expect(markerOffsetControl).toBeGreaterThan(markerIndentControl);
		expect(markerLineHeightControl).toBeGreaterThan(markerOffsetControl);
		expect(textPositionControl).toBeGreaterThan(markerLineHeightControl);

		expect(thirdSeparator).toBeGreaterThan(textPositionControl);
		expect(textIndentControl).toBeGreaterThan(thirdSeparator);
		expect(listGapControl).toBeGreaterThan(textIndentControl);
		expect(paragraphSpacingControl).toBeGreaterThan(listGapControl);
		expect(source.match(/<ListOptionsSeparator \/>/g)).toHaveLength(3);
	});
});
