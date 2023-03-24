import parseLongAttrKey from '../../../attributes/dictionary/parseLongAttrKey';
import parseLongAttrObj from '../../../attributes/dictionary/parseLongAttrObj';
import getArrowStyles from '../getArrowStyles';

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => 0)
);

jest.mock('src/extensions/style-cards/getActiveStyleCard.js', () => {
	return jest.fn(() => {
		return {
			value: {
				name: 'Maxi (Default)',
				status: 'active',
				light: {
					styleCard: {},
					defaultStyleCard: {
						color: {
							1: '255,255,255',
							2: '242,249,253',
							3: '155,155,155',
							4: '255,74,23',
							5: '0,0,0',
							6: '201,52,10',
							7: '8,18,25',
							8: '150,176,203',
						},
					},
				},
			},
		};
	});
});

describe('getArrowStyles', () => {
	it('Get a correct arrow styles with different values for different responsive stages color background settings', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			...parseLongAttrObj({
				'arrow-status-general': true,
				'arrow-side-general': 'top',
				'arrow-position-general': 1,
				'arrow-width-general': 2,
				'arrow-side-xxl': 'top',
				'arrow-position-xxl': 4,
				'arrow-width-xxl': 1,
				'arrow-side-xl': 'top',
				'arrow-position-xl': 2,
				'arrow-width-xl': 3,
				'arrow-status-l': false,
				'arrow-side-l': 'top',
				'arrow-position-l': 4,
				'arrow-width-l': 1,
				'arrow-side-m': 'bottom',
				'arrow-position-m': 2,
				'arrow-width-m': 3,
				'arrow-status-s': true,
				'arrow-side-s': 'bottom',
				'arrow-position-s': 4,
				'arrow-width-s': 1,
				'arrow-side-xs': 'bottom',
				'arrow-position-xs': 2,
				'arrow-width-xs': 3,
				'background-layers': [
					{
						order: 0,
						type: 'color',
						...parseLongAttrObj({
							'display-general': 'block',
							'background-palette-status-general': true,
							'background-palette-color-general': 1,
							'background-palette-opacity-general': 0.07,
							'background-color-general': '',
							'background-color-clip-path-general':
								'polygon(50% 0%, 0% 100%, 100% 100%)',
							'background-palette-status-xl': true,
							'background-palette-color-xl': 1,
							'background-palette-opacity-xl': 0.07,
							'background-color-xl': '',
							'background-color-clip-path-xl':
								'polygon(50% 0%, 0% 100%, 100% 100%)',
							'background-color-clip-path-xxl':
								'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
							'background-palette-status-xxl': true,
							'background-palette-color-xxl': 2,
							'background-palette-opacity-xxl': 0.2,
							'background-color-xxl': '',
							'background-palette-status-l': true,
							'background-palette-color-l': 4,
							'background-palette-opacity-l': 0.3,
							'background-color-l': '',
							'background-color-clip-path-l':
								'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
							'background-palette-status-m': true,
							'background-palette-color-m': 5,
							'background-palette-opacity-m': 0.59,
							'background-color-m': '',
							'background-color-clip-path-m':
								'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
							'background-palette-status-s': false,
							'background-palette-color-s': 5,
							'background-palette-opacity-s': 0.59,
							'background-color-s': 'rgba(204,68,68,0.59)',
							'background-color-clip-path-s':
								'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
							'background-color-clip-path-xs':
								'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
						}),
					},
				],
				'border-palette-status-general': true,
				'border-palette-color-general': 4,
				'border-style-general': 'solid',
				'border-width-top-general': 1,
				'border-width-right-general': 1,
				'border-width-bottom-general': 1,
				'border-width-left-general': 1,
				'border-width-unit-general': 'px',
				'border-palette-status-m': false,
				'border-color-m': 'rgba(61,133,209)',
				'border-style-m': 'solid',
				'border-width-top-m': 3,
				'border-width-right-m': 3,
				'border-width-bottom-m': 3,
				'border-width-left-m': 3,
				'border-width-unit-m': 'px',
				'border-style-s': 'none',
				'border-radius-top-left-general': 20,
				'border-radius-top-right-general': 20,
				'border-radius-bottom-right-general': 20,
				'border-radius-bottom-left-general': 20,
				'border-radius-sync-general': 'all',
				'border-radius-unit-general': 'px',
				'border-radius-unit-general-hover': 'px',
			}),
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it.skip('Get a correct palette colors arrow hover styles', () => {
		const object = {
			target: '',
			isHover: true,
			blockStyle: 'light',
			'arrow-status-general': true,
			'background-active-media-general': 'color',
			'box-shadow-palette-status-general': true,
			'box-shadow-palette-color-general': 2,
			'box-shadow-palette-opacity-general': 0.2,
			'box-shadow-status-hover': true,
			'box-shadow-palette-status-general-hover': true,
			'box-shadow-palette-color-general-hover': 4,
			'box-shadow-palette-opacity-general-hover': 0.2,
			'box-shadow-horizontal-general-hover': 1,
			'box-shadow-vertical-general-hover': 2,
			'box-shadow-blur-general-hover': 3,
			'box-shadow-spread-general-hover': 4,
			'border-palette-status-general': true,
			'border-palette-color-general': 4,
			'border-palette-opacity-general': 0.2,
			'border-style-general': 'solid',
			'border-status-hover': true,
			'border-palette-status-general-hover': true,
			'border-palette-color-general-hover': 1,
			'border-palette-opacity-general-hover': 0.2,
			'border-style-general-hover': 'solid',
			'border-width-top-general-hover': 1,
			'border-width-right-general-hover': 2,
			'border-width-bottom-general-hover': 3,
			'border-width-left-general-hover': 4,
			'border-width-sync-general-hover': true,
			'border-width-unit-general-hover': 'px',
			'border-radius-top-left-general-hover': 1,
			'border-radius-top-right-general-hover': 2,
			'border-radius-bottom-right-general-hover': 3,
			'border-radius-bottom-left-general-hover': 4,
			'border-radius-sync-general-hover': true,
			'border-radius-unit-general-hover': 'px',
			'background-palette-status-general': true,
			'background-palette-color-general': 5,
			'background-status-hover': true,
			'background-active-media-general-hover': 'color',
			'background-palette-status-general-hover': true,
			'background-palette-color-general-hover': 1,
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct arrow hover styles with background, shadow and border custom colors', () => {
		const object = {
			target: '',
			isHover: true,
			blockStyle: 'light',
			...parseLongAttrObj({
				'arrow-status-general': true,
				'box-shadow-palette-status-general': true,
				'box-shadow-palette-color-general': 2,
				'box-shadow-palette-opacity-general': 0.2,
				'box-shadow-status-hover': true,
				'box-shadow-palette-status-general-hover': false,
				'box-shadow-color-general-hover': 'rgba(61,133,209)',
				'box-shadow-palette-opacity-general-hover': 0.2,
				'box-shadow-horizontal-general-hover': 1,
				'box-shadow-vertical-general-hover': 2,
				'box-shadow-blur-general-hover': 3,
				'box-shadow-spread-general-hover': 4,
				'border-palette-status-general': true,
				'border-palette-color-general': 4,
				'border-palette-opacity-general': 0.2,
				'border-style-general': 'solid',
				'border-status-hover': true,
				'border-palette-status-general-hover': false,
				'border-color-general-hover': 'rgba(150,200,90)',
				'border-palette-opacity-general-hover': 0.2,
				'border-style-general-hover': 'solid',
				'border-width-top-general-hover': 1,
				'border-width-right-general-hover': 2,
				'border-width-bottom-general-hover': 3,
				'border-width-left-general-hover': 4,
				'border-width-sync-general-hover': true,
				'border-width-unit-general-hover': 'px',
				'border-radius-top-left-general-hover': 1,
				'border-radius-top-right-general-hover': 2,
				'border-radius-bottom-right-general-hover': 3,
				'border-radius-bottom-left-general-hover': 4,
				'border-radius-sync-general-hover': true,
				'border-radius-unit-general-hover': 'px',
				'border-radius-top-left-general': 10,
				'border-radius-top-right-general': 10,
				'border-radius-bottom-right-general': 10,
				'border-radius-bottom-left-general': 10,
				'border-radius-sync-general': 'all',
				'border-radius-unit-general': 'px',
				'background-palette-status-general': true,
				'background-palette-color-general': 5,
				'background-layers': [
					{
						type: 'color',
						order: 0,
						...parseLongAttrObj({
							'display-general': 'block',
							'background-palette-status-general': false,
							'background-palette-color-general': 1,
							'background-palette-opacity-general': 0.07,
							'background-color-general': 'rgba(150,200,90)',
							'background-color-clip-path-general':
								'polygon(50% 0%, 0% 100%, 100% 100%)',
						}),
					},
				],
			}),
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Return empty arrow styles when arrow status is off', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			[parseLongAttrKey('arrow-status-general')]: false,
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Return empty arrow styles when background color is not selected', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			...parseLongAttrObj({
				'arrow-status-general': true,
				'background-active-media': 'gradient',
			}),
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Return empty arrow styles when background color is selected and border is active but the style is not solid', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			...parseLongAttrObj({
				'arrow-status-general': true,
				'background-active-media': 'color',
				'border-style-general': undefined,
				'border-style-s': 'dashed',
			}),
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Return empty arrow styles when background color is selected and border is active but some style on hover is not solid', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			...parseLongAttrObj({
				'arrow-status-general': true,
				'background-active-media': 'color',
				'border-style-general': undefined,
				'border-style-s': 'solid',
				'border-style-s-hover': 'dashed',
			}),
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
