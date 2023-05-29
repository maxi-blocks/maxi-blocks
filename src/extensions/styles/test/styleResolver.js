import styleResolver from '../styleResolver';

jest.mock('@wordpress/data', () => {
	return {
		dispatch: jest.fn(() => {
			return {
				updateStyles: jest.fn(),
			};
		}),
	};
});

describe('styleResolver', () => {
	it('Returns a clean style object', () => {
		const styles = {
			'test-target': {
				'': {
					border: {
						g: {},
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
					boxShadow: {},
					opacity: {
						g: {},
						xxl: {},
						xl: {},
						l: {},
						m: {},
						s: {},
						xs: {},
					},
					zIndex: { g: { 'z-index': 1 } },
					position: {},
					display: {},
					transform: {},
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
					textAlignment: {},
				},
				':hover': {
					border: false,
					boxShadow: false,
				},
				' p.maxi-text-block__content': {
					typography: {
						g: {
							'font-weight': 800,
							'font-style': 'italic',
						},
					},
				},
				' p.maxi-text-block__content:hover': {
					typography: {},
				},
				' p.maxi-text-block__content li': {
					typography: {
						g: {
							'font-weight': 800,
							'font-style': 'italic',
						},
					},
				},
				' p.maxi-text-block__content li:hover': {
					typography: {},
				},
				' p.maxi-text-block__content a': {
					typography: {
						g: {
							'font-weight': 800,
							'font-style': 'italic',
						},
					},
				},
				' p.maxi-text-block__content a:hover': {
					typography: {},
				},
				' > .maxi-background-displayer': {
					border: {
						g: {},
						xxl: {},
						xl: {},
						l: {},
						m: {},
						s: {},
						xs: {},
					},
				},
				' > .maxi-background-displayer .maxi-background-displayer__color':
					{
						background: {
							label: 'Background Color',
							g: {
								'background-color': 'rgba(56,25,212,1)',
							},
						},
					},
			},
		};
		const remover = false;
		const breakpoints = {
			xxl: 1920,
			xl: 1920,
			l: 1366,
			m: 1024,
			s: 767,
			xs: 480,
		};

		const result = styleResolver(styles, remover, breakpoints);

		expect(result).toMatchSnapshot();
	});
});
