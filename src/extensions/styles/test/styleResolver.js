import styleResolver from '@extensions/styles/styleResolver';

jest.mock('@wordpress/data', () => {
	return {
		dispatch: jest.fn(() => {
			return {
				updateStyles: jest.fn(),
			};
		}),
		select: jest.fn(() => false),
	};
});

describe('styleResolver', () => {
	it('Returns a clean style object', () => {
		const styles = {
			'test-target': {
				'': {
					border: {
						general: {},
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
					boxShadow: {},
					opacity: {
						general: {},
						xxl: {},
						xl: {},
						l: {},
						m: {},
						s: {},
						xs: {},
					},
					zIndex: { general: { 'z-index': 1 } },
					position: {},
					display: {},
					transform: {},
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
					textAlignment: {},
				},
				':hover': {
					border: false,
					boxShadow: false,
				},
				' p.maxi-text-block__content': {
					typography: {
						general: {
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
						general: {
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
						general: {
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
						general: {},
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
							general: {
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

		const uniqueID = 'test-target-7f750e3e-u';

		const result = styleResolver({
			styles,
			remover,
			breakpoints,
			uniqueID,
		});

		expect(result).toMatchSnapshot();
	});
});
