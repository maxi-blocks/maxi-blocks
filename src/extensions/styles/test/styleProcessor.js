import styleProcessor from '../styleProcessor';

jest.mock('../../attributes/getBlockData.js', () => jest.fn());

describe('styleCleaner', () => {
	it('Returns cleaned styles obj', () => {
		const obj = {
			'': {
				margin: {
					g: {},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				padding: {
					g: {},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				border: {
					g: {
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
					g: {},
					xxl: {},
					xl: {},
					l: {},
					m: {},
					s: {},
					xs: {},
				},
				boxShadow: {
					g: {
						'box-shadow':
							'0px 0px 0px 0px var(--maxi-light-color-1)',
					},
				},
				opacity: {
					g: {},
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
					g: {
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
					g: {
						'box-shadow':
							'5px 5px 0px 0px var(--maxi-light-color-6)',
					},
				},
			},
			' > .maxi-background-displayer': {
				border: {
					g: {
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
					g: {
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
					g: {
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
					g: {
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
					g: {},
				},
			},
			' .maxi-container-arrow .maxi-container-arrow--content:before': {
				border: {
					label: 'Arrow Border',
					g: {
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
			'bs_blu-g': 50,
			'bs_blu-g.h': 50,
			'bs_blu.u-g': 'px',
			'bs_blu.u-g.h': 'px',
			'bs_ho-g': 0,
			'bs_ho-g.h': 0,
			'bs_ho.u-g': 'px',
			'bs_ho.u-g.h': 'px',
			'bs_in-g': false,
			'bs_in-g.h': false,
			'bs_pc-g': 8,
			'bs_pc-g.h': 6,
			'bs_po-g': 0.23,
			'bs_po-g.h': 0.23,
			'bs_ps-g': true,
			'bs_ps-g.h': true,
			'bs_sp-g': 0,
			'bs_sp-g.h': 0,
			'bs_sp.u-g': 'px',
			'bs_sp.u-g.h': 'px',
			'bs.sh': true,
			'bs_v-g': 30,
			'bs_v-g.h': 30,
			'bs_v.u-g': 'px',
			'bs_v.u-g.h': 'px',
			_t: {
				b: {},
				c: {
					bo: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': true,
						hp: 'bo.sh',
					},
					bs: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': true,
						hp: 'bs.sh',
					},
					bl: {
						'_tdu-g': 0.3,
						'_tde-g': 0,
						'_ea-g': 'ease',
						'_ts-g': true,
						hp: 'bb.sh',
					},
				},
			},
		};

		expect(styleProcessor(obj, {}, props)).toMatchSnapshot();
	});
});
