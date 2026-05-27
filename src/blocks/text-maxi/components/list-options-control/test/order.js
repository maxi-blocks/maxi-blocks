import fs from 'fs';
import path from 'path';

const expectedControlOrder = [
	"label={__('Type of list', 'maxi-blocks')}",
	"label={__('Style', 'maxi-blocks')}",
	"label={__('Start from', 'maxi-blocks')}",
	"label={__('Reverse order', 'maxi-blocks')}",
	"label={__('Source', 'maxi-blocks')}",
	"className='maxi-text-inspector__list-source-text'",
	'<ListOptionsSeparator />',
	"label={__('Marker', 'maxi-blocks')}",
	"className='maxi-text-inspector__list-marker-size'",
	"label={__('Marker height', 'maxi-blocks')}",
	'<ListOptionsSeparator />',
	"label={__('List style position', 'maxi-blocks')}",
	"label={__('Marker indent', 'maxi-blocks')}",
	"label={__('Marker vertical offset', 'maxi-blocks')}",
	"label={__('Marker line-height', 'maxi-blocks')}",
	"label={__('Text position', 'maxi-blocks')}",
	"className='maxi-text-inspector__list-text-position'",
	'<ListOptionsSeparator />',
	"label={__('Text indent', 'maxi-blocks')}",
	"label={__('List gap', 'maxi-blocks')}",
	"label={__('Paragraph spacing', 'maxi-blocks')}",
];

describe('ListOptionsControl control order', () => {
	it('groups list options by setup, marker appearance, placement, and spacing', () => {
		const source = fs.readFileSync(
			path.join(__dirname, '..', 'index.js'),
			'utf8'
		);

		let previousIndex = -1;
		expectedControlOrder.forEach(search => {
			const index = source.indexOf(search, previousIndex + 1);

			expect(index).toBeGreaterThan(previousIndex);
			previousIndex = index;
		});

		expect(source.match(/<ListOptionsSeparator \/>/g)).toHaveLength(3);
	});
});
