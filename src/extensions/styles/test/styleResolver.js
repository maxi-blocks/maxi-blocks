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
		const target = 'test-target';
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
					zIndex: {},
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
			s: 768,
			xs: 480,
		};

		const result = styleResolver(target, styles, remover, breakpoints);

		expect(result).toMatchSnapshot();
	});
	it('Returns a clean style object for Row', () => {
		const target = 'test-target';
		const styles = {
			'test-target': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					'': {
						general: {
							'border-color': 'rgba(61,32,205,1)',
							'border-style': 'solid',
							'border-top-width': '2px',
							'border-right-width': '2px',
							'border-bottom-width': '2px',
							'border-left-width': '2px',
							'border-top-left-radius': '20px',
							'border-top-right-radius': '20px',
							'border-bottom-right-radius': '20px',
							'border-bottom-left-radius': '20px',
							'justify-content': 'space-between',
							'align-items': 'stretch',
							'max-width': '1170px',
						},
						xxl: {
							'max-width': '1790px',
						},
						xl: {
							'max-width': '1170px',
						},
						l: {
							'max-width': '90%',
							width: '1170px',
						},
						m: {
							'max-width': '90%',
							width: '1000px',
						},
						s: {
							'max-width': '90%',
							width: '700px',
						},
						xs: {
							'max-width': '90%',
							width: '460px',
						},
					},
					' .maxi-row-block__container': {
						general: {
							'justify-content': 'space-between',
							'align-items': 'stretch',
						},
					},
					' > .maxi-background-displayer': {
						general: {
							'border-top-left-radius': '20px',
							'border-top-right-radius': '20px',
							'border-bottom-right-radius': '20px',
							'border-bottom-left-radius': '20px',
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
			s: 768,
			xs: 480,
		};

		const result = styleResolver(target, styles, remover, breakpoints);

		expect(result).toMatchSnapshot();
	});
});
