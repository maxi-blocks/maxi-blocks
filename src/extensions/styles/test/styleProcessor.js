import styleProcessor from '@extensions/styles/styleProcessor';

jest.mock('@wordpress/blocks', () => jest.fn());
jest.mock('src/components/block-inserter/index.js', () => jest.fn());
jest.mock('@extensions/attributes/getBlockData.js', () => jest.fn());
jest.mock('src/components/transform-control/utils.js', () => ({
	getTransformSelectors: jest.fn(() => ({
		canvas: {
			normal: {
				label: 'canvas',
				target: '',
			},
			hover: {
				label: 'canvas',
				target: ':hover',
			},
		},
	})),
}));
jest.mock('src/extensions/DC/constants.js', () => ({}));

describe('styleCleaner', () => {
	const gradientA =
		'linear-gradient(90deg,rgb(1,2,3) 0%,rgb(4,5,6) 100%)';
	const gradientB =
		'linear-gradient(90deg,rgb(7,8,9) 0%,rgb(10,11,12) 100%)';
	const colorA = 'rgba(1,2,3,1)';
	const colorB = 'rgba(7,8,9,1)';

	const getBackgroundTransitionData = () => ({
		transition: {
			block: {
				background: {
					title: 'Background',
					target: ' .target',
					property: 'background',
					hoverProp: 'background-status-hover',
				},
			},
		},
	});

	const getBackgroundTransitionProps = ({ enabled = true } = {}) => ({
		'background-status-hover': true,
		transition: {
			block: {
				background: {
					'transition-duration-general': 0.8,
					'transition-delay-general': 0,
					'easing-general': 'ease',
					'transition-status-general': enabled,
				},
			},
		},
	});

	const getProcessedBackgroundTransition = ({
		baseProperty = 'background',
		baseValue,
		hoverProperty = 'background',
		hoverValue,
		transitionEnabled = true,
	}) =>
		styleProcessor(
			{
				' .target': {
					background: {
						general: {
							[baseProperty]: baseValue,
						},
					},
				},
				' .target:hover': {
					background: {
						general: {
							[hoverProperty]: hoverValue,
						},
					},
				},
			},
			getBackgroundTransitionData(),
			getBackgroundTransitionProps({ enabled: transitionEnabled })
		);

	it('Returns cleaned styles obj', () => {
		const obj = {
			'': {
				margin: {
					general: {},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				padding: {
					general: {},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				border: {
					general: {
						'border-color': 'var(--maxi-light-color-2)',
						'border-style': 'solid',
						'border-top-width': '2px',
						'border-right-width': '2px',
						'border-bottom-width': '2px',
						'border-left-width': '2px',
					},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				size: {
					general: {},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				boxShadow: {
					general: {
						'box-shadow':
							'0px 0px 0px 0px var(--maxi-light-color-1)',
					},
				},
				opacity: {
					general: {},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				zIndex: {},
				position: {},
				display: {},
				transform: {},
			},
			':hover': {
				border: {
					general: {
						'border-color': 'var(--maxi-light-color-6)',
						'border-style': 'solid',
						'border-top-width': '2px',
						'border-right-width': '2px',
						'border-bottom-width': '2px',
						'border-left-width': '2px',
					},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				boxShadow: {
					general: {
						'box-shadow':
							'5px 5px 0px 0px var(--maxi-light-color-6)',
					},
				},
			},
			' > .maxi-background-displayer': {
				border: {
					general: {
						'border-color': 'var(--maxi-light-color-2)',
						'border-style': 'solid',
						'border-top-width': '2px',
						'border-right-width': '2px',
						'border-bottom-width': '2px',
						'border-left-width': '2px',
					},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
			},
			':hover > .maxi-background-displayer': {
				border: {
					general: {
						'border-color': 'var(--maxi-light-color-6)',
						'border-style': 'solid',
						'border-top-width': '2px',
						'border-right-width': '2px',
						'border-bottom-width': '2px',
						'border-left-width': '2px',
					},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				size: {
					general: {
						transform:
							'translate(calc(-50% - 0px), calc(-50% - 0px))',
					},
					xxl: {
						transform:
							'translate(calc(-50% - 0px), calc(-50% - 0px))',
					},
					xl: {
						transform:
							'translate(calc(-50% - 0px), calc(-50% - 0px))',
					},
					l: {
						transform:
							'translate(calc(-50% - 0px), calc(-50% - 0px))',
					},
					m: {
						transform:
							'translate(calc(-50% - 0px), calc(-50% - 0px))',
					},
					s: {
						transform:
							'translate(calc(-50% - 0px), calc(-50% - 0px))',
					},
					xs: {
						transform:
							'translate(calc(-50% - 0px), calc(-50% - 0px))',
					},
				},
			},
			' .maxi-container-arrow': {
				shadow: {
					general: {
						filter: 'drop-shadow(0px 0px 0px var(--maxi-light-color-1))',
					},
				},
			},
			' .maxi-container-arrow .maxi-container-arrow--content': {
				arrow: {},
			},
			' .maxi-container-arrow .maxi-container-arrow--content:after': {
				background: {
					label: 'Arrow Color',
					general: {},
				},
			},
			' .maxi-container-arrow .maxi-container-arrow--content:before': {
				border: {
					label: 'Arrow Border',
					general: {
						background: 'var(--maxi-undefined-color-2)',
						top: 'calc(1px)',
						left: 'calc(1px)',
						width: 'calc(50% + 4px)',
						height: 'calc(50% + 4px)',
					},
				},
			},
		};

		const props = {
			'box-shadow-blur-general': 50,
			'box-shadow-blur-general-hover': 50,
			'box-shadow-blur-unit-general': 'px',
			'box-shadow-blur-unit-general-hover': 'px',
			'box-shadow-horizontal-general': 0,
			'box-shadow-horizontal-general-hover': 0,
			'box-shadow-horizontal-unit-general': 'px',
			'box-shadow-horizontal-unit-general-hover': 'px',
			'box-shadow-inset-general': false,
			'box-shadow-inset-general-hover': false,
			'box-shadow-palette-color-general': 8,
			'box-shadow-palette-color-general-hover': 6,
			'box-shadow-palette-opacity-general': 0.23,
			'box-shadow-palette-opacity-general-hover': 0.23,
			'box-shadow-palette-status-general': true,
			'box-shadow-palette-status-general-hover': true,
			'box-shadow-spread-general': 0,
			'box-shadow-spread-general-hover': 0,
			'box-shadow-spread-unit-general': 'px',
			'box-shadow-spread-unit-general-hover': 'px',
			'box-shadow-status-hover': true,
			'box-shadow-vertical-general': 30,
			'box-shadow-vertical-general-hover': 30,
			'box-shadow-vertical-unit-general': 'px',
			'box-shadow-vertical-unit-general-hover': 'px',
			transition: {
				block: {},
				canvas: {
					border: {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						hoverProp: 'border-status-hover',
					},
					'box shadow': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						hoverProp: 'box-shadow-status-hover',
					},
					'background / layer': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						hoverProp: 'block-background-status-hover',
					},
				},
			},
			'transform-scale-general': {
				canvas: {
					normal: {
						x: 117.5,
						y: 110,
					},
					hover: {
						x: 110,
						y: 120,
					},
				},
			},
			'transform-translate-general': {
				canvas: {
					normal: {
						x: 33,
						y: 20,
						'x-unit': '%',
						'y-unit': '%',
					},
				},
			},
			'advanced-css-general': '.test { color: red; }',
		};
		const data = {
			customCss: {
				selectors: {
					canvas: {
						normal: {
							target: '',
						},
						hover: {
							target: ':hover',
						},
					},
				},
			},
		};

		expect(styleProcessor(obj, data, props)).toMatchSnapshot();
		props['hover-type'] = 'text';
		expect(styleProcessor(obj, data, props)).toMatchSnapshot();
	});

	it('fades gradient hover backgrounds through an opacity overlay', () => {
		const result = getProcessedBackgroundTransition({
			baseValue: gradientA,
			hoverValue: gradientB,
		});

		expect(result[' .target'].gradientTransitionHost.general).toEqual({
			position: 'relative',
		});
		expect(
			result[' .target:before'].gradientTransitionOverlay.general
		).toMatchObject({
			content: '""',
			position: 'absolute',
			top: '0',
			right: '0',
			bottom: '0',
			left: '0',
			'border-radius': 'inherit',
			'pointer-events': 'none',
			background: gradientB,
			opacity: 0,
			transition: 'opacity 0.8s 0s ease',
		});
		expect(
			result[' .target:hover:before'].gradientTransitionOverlay.general
		).toMatchObject({
			opacity: 1,
			transition: 'opacity 0.8s 0s ease',
		});
		expect(result[' .target:hover']?.background).toBeUndefined();
	});

	it('fades from a normal color to a hover gradient through an opacity overlay', () => {
		const result = getProcessedBackgroundTransition({
			baseProperty: 'background-color',
			baseValue: colorA,
			hoverValue: gradientB,
		});

		expect(
			result[' .target:before'].gradientTransitionOverlay.general
				.background
		).toBe(gradientB);
		expect(
			result[' .target:hover:before'].gradientTransitionOverlay.general
				.opacity
		).toBe(1);
		expect(result[' .target:hover']?.background).toBeUndefined();
	});

	it('fades from a normal gradient to a hover color through an opacity overlay', () => {
		const result = getProcessedBackgroundTransition({
			baseValue: gradientA,
			hoverProperty: 'background-color',
			hoverValue: colorB,
		});

		expect(
			result[' .target:before'].gradientTransitionOverlay.general
				.background
		).toBe(colorB);
		expect(
			result[' .target:hover:before'].gradientTransitionOverlay.general
				.opacity
		).toBe(1);
		expect(result[' .target:hover']?.background).toBeUndefined();
	});

	it('keeps disabled gradient transitions from animating the overlay', () => {
		const result = getProcessedBackgroundTransition({
			baseValue: gradientA,
			hoverValue: gradientB,
			transitionEnabled: false,
		});

		expect(
			result[' .target:before'].gradientTransitionOverlay.general
				.transition
		).toBe('opacity 0s 0s');
		expect(
			result[' .target:hover:before'].gradientTransitionOverlay.general
				.transition
		).toBe('opacity 0s 0s');
	});

	it('preserves direct background transitions for solid color hovers', () => {
		const result = getProcessedBackgroundTransition({
			baseProperty: 'background-color',
			baseValue: colorA,
			hoverProperty: 'background-color',
			hoverValue: colorB,
		});

		expect(result[' .target:before']).toBeUndefined();
		expect(result[' .target:hover'].background.general).toEqual({
			'background-color': colorB,
		});
		expect(result[' .target'].transition.general.transition).toBe(
			'background 0.8s 0s ease'
		);
	});
});
