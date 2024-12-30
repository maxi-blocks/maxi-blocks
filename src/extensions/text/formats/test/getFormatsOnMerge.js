import getFormatsOnMerge from '@extensions/text/formats/getFormatsOnMerge';

describe('getFormatsOnMerge', () => {
	it('Merges two Text Maxi', async () => {
		const block1 = {
			content:
				'Testing <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">Text</span> Maxi',
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-weight-general': '800',
				},
			},
		};
		const block2 = {
			content:
				'When <span class="maxi-text-block--has-custom-format maxi-text-block__custom-format--0">merging</span>',
			'custom-formats': {
				'maxi-text-block__custom-format--0': {
					'font-style-general': 'italic',
				},
			},
		};

		const result = getFormatsOnMerge(block1, block2);

		expect(result).toMatchSnapshot();
	});
});
