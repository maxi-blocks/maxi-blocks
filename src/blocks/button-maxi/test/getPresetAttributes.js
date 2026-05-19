import getPresetAttributes, {
	getPresetInlineStyleTargets,
} from '../getPresetAttributes';

describe('button maxi getPresetAttributes', () => {
	const iconContent =
		'<svg class="phone-36-fill-maxi-svg" viewBox="0 0 24 24"><path data-fill fill="#081219" d="M0 0h24v24H0z" /></svg>';
	const getIconWithColor = jest.fn((attributes, { rawIcon }) => rawIcon);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each(['Filled', 'Shape'])(
		'preserves an existing %s icon type when applying an icon quick style',
		svgType => {
			const result = getPresetAttributes({
				attributes: {
					'icon-content': iconContent,
					svgType,
				},
				getIconWithColor,
				number: 4,
				type: 'icon',
			});

			expect(result['icon-content']).toBe(iconContent);
			expect(result.svgType).toBe(svgType);
		}
	);

	it('preserves an existing icon width when applying an icon quick style', () => {
		const result = getPresetAttributes({
			attributes: {
				'icon-content': iconContent,
				'icon-width-general': '96',
				'icon-width-unit-general': 'px',
				'icon-width-xxl': '140',
				svgType: 'Shape',
			},
			getIconWithColor,
			number: 4,
			type: 'icon',
		});

		expect(result['icon-width-general']).toBe('96');
		expect(result['icon-width-unit-general']).toBe('px');
		expect(result['icon-width-xxl']).toBe('140');
	});

	it('marks icon inline styles for cleanup when a quick style turns icon background off', () => {
		const targets = getPresetInlineStyleTargets({
			inlineStylesTargets: {
				icon: ' .maxi-button-block__icon',
			},
			presetAttributes: {
				'icon-background-active-media-general': 'none',
			},
		});

		expect(targets).toEqual([' .maxi-button-block__icon']);
	});
});
