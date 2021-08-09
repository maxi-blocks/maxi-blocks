import stylesCleaner from '../stylesCleaner';

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

		expect(stylesCleaner(obj)).toMatchSnapshot();
	});
});
