const slideAttributes = {
	'border-bottom-width-general': 1,
	'border-left-width-general': 1,
	'border-palette-color-general': 3,
	'border-palette-color-general-hover': 6,
	'border-palette-opacity-general': 0.25,
	'border-palette-status-general': true,
	'border-palette-status-general-hover': true,
	'border-right-width-general': 1,
	'border-status-hover': false,
	'border-style-general': 'solid',
	'border-sync-radius-general': 'all',
	'border-sync-width-general': 'all',
	'border-top-width-general': 1,
	'border-unit-radius-general': 'px',
	'border-unit-radius-general-hover': 'px',
	'border-unit-width-general': 'px',
	'padding-bottom-general': '65',
	'padding-bottom-unit-general': 'px',
	'padding-left-unit-general': 'px',
	'padding-right-unit-general': 'px',
	'padding-sync-general': 'axis',
	'padding-top-general': '65',
	'padding-top-unit-general': 'px',
};

const TEMPLATE = [
	[
		'maxi-blocks/slide-maxi',
		{ ...slideAttributes },
		[
			[
				'maxi-blocks/text-maxi',
				{
					content: 'My awesome slider title 1',
					textLevel: 'h4',
					'palette-color-general': 5,
					'text-alignment-general': 'center',
				},
			],
			[
				'maxi-blocks/text-maxi',
				{
					content: 'Name Surname',
					textLevel: 'p',
					'palette-color-general': 4,
					'text-alignment-general': 'center',
					'margin-bottom-general': '-10',
					'margin-bottom-unit-general': 'px',
					'margin-left-unit-general': 'px',
					'margin-right-unit-general': 'px',
					'margin-sync-general': 'none',
					'margin-top-general': '55',
					'margin-top-unit-general': 'px',
				},
			],
			[
				'maxi-blocks/text-maxi',
				{
					content: 'Position',
					textLevel: 'p',
					'palette-color-general': 3,
					'text-alignment-general': 'center',
				},
			],
		],
	],
	[
		'maxi-blocks/slide-maxi',
		{ ...slideAttributes },
		[
			[
				'maxi-blocks/text-maxi',
				{
					content: 'My awesome slider title 2',
					textLevel: 'h4',
					'palette-color-general': 5,
					'text-alignment-general': 'center',
				},
			],
			[
				'maxi-blocks/text-maxi',
				{
					content:
						'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros.',
					textLevel: 'p',
					'palette-color-general': 3,
					'text-alignment-general': 'center',
					'margin-bottom-general': '15',
					'margin-bottom-unit-general': 'px',
					'margin-left-unit-general': 'px',
					'margin-right-unit-general': 'px',
					'margin-sync-general': 'none',
					'margin-top-general': '10',
					'margin-top-unit-general': 'px',
					'padding-bottom-unit-general': 'px',
					'padding-left-general': '130',
					'padding-left-unit-general': 'px',
					'padding-right-general': '130',
					'padding-right-unit-general': 'px',
					'padding-sync-general': 'axis',
					'padding-top-unit-general': 'px',
				},
			],
			['maxi-blocks/button-maxi', { buttonContent: 'My Button' }],
		],
	],
];

export default TEMPLATE;
