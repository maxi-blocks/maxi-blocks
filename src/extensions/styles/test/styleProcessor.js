import styleProcessor from '../styleProcessor';

jest.mock('../../attributes/getBlockData.js', () => jest.fn());

describe('styleCleaner', () => {
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
						'border-width-top': '2px',
						'border-width-right': '2px',
						'border-width-bottom': '2px',
						'border-width-left': '2px',
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
						'border-width-top': '2px',
						'border-width-right': '2px',
						'border-width-bottom': '2px',
						'border-width-left': '2px',
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
						'border-width-top': '2px',
						'border-width-right': '2px',
						'border-width-bottom': '2px',
						'border-width-left': '2px',
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
						'border-width-top': '2px',
						'border-width-right': '2px',
						'border-width-bottom': '2px',
						'border-width-left': '2px',
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
			'bs_blu-general': 50,
			'bs_blu-general-hover': 50,
			'bs_blu-unit-general': 'px',
			'bs_blu-unit-general-hover': 'px',
			'bs_ho-general': 0,
			'bs_ho-general-hover': 0,
			'bs_ho-unit-general': 'px',
			'bs_ho-unit-general-hover': 'px',
			'bs_in-general': false,
			'bs_in-general-hover': false,
			'bs_pc-general': 8,
			'bs_pc-general-hover': 6,
			'bs_po-general': 0.23,
			'bs_po-general-hover': 0.23,
			'box-shadow-palette-status-general': true,
			'box-shadow-palette-status-general-hover': true,
			'bs_sp-general': 0,
			'bs_sp-general-hover': 0,
			'bs_sp-unit-general': 'px',
			'bs_sp-unit-general-hover': 'px',
			'bs.sh': true,
			'bs_v-general': 30,
			'bs_v-general-hover': 30,
			'bs_v-unit-general': 'px',
			'bs_v-unit-general-hover': 'px',
			transition: {
				block: {},
				canvas: {
					border: {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						hoverProp: 'bo.sh',
					},
					'box shadow': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						hoverProp: 'bs.sh',
					},
					'background / layer': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
						hoverProp: 'bb.sh',
					},
				},
			},
		};

		expect(styleProcessor(obj, {}, props)).toMatchSnapshot();
	});
});
