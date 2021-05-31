import styleGenerator from '../styleGenerator';

describe('styleGenerator', () => {
	it('Returns `general` styles', () => {
		const styles = {
			'text-maxi-12:hover': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					border: false,
					boxShadow: false,
				},
			},
			'text-maxi-12 .maxi-text-block__content': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					typography: {
						general: {
							'font-weight': 800,
						},
						xxl: {
							'font-size': '49px',
						},
						xl: {
							'font-size': '19px',
						},
						l: {
							'font-size': '38px',
						},
						m: {
							'font-size': '48px',
						},
						s: {
							'font-size': '11px',
						},
						xs: {
							'font-size': '30px',
						},
					},
				},
			},
			'text-maxi-12 .maxi-text-block__content li': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					typography: {
						general: {
							'font-weight': 800,
						},
						xxl: {
							'font-size': '49px',
						},
						xl: {
							'font-size': '19px',
						},
						l: {
							'font-size': '38px',
						},
						m: {
							'font-size': '48px',
						},
						s: {
							'font-size': '11px',
						},
						xs: {
							'font-size': '30px',
						},
					},
				},
			},
			'text-maxi-12 .maxi-text-block__content a': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					typography: {
						general: {
							'font-weight': 800,
						},
						xxl: {
							'font-size': '49px',
						},
						xl: {
							'font-size': '19px',
						},
						l: {
							'font-size': '38px',
						},
						m: {
							'font-size': '48px',
						},
						s: {
							'font-size': '11px',
						},
						xs: {
							'font-size': '30px',
						},
					},
				},
			},
		};
		const breakpoints = {
			xxl: 1920,
			xl: 1920,
			l: 1366,
			m: 1024,
			s: 768,
			xs: 480,
		};

		const result = styleGenerator(styles, breakpoints, 'general');

		expect(result).toMatchSnapshot();
	});
	it('Returns `xl` styles', () => {
		const styles = {
			'text-maxi-12:hover': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					border: false,
					boxShadow: false,
				},
			},
			'text-maxi-12 .maxi-text-block__content': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					typography: {
						general: {
							'font-weight': 800,
						},
						xxl: {
							'font-size': '49px',
						},
						xl: {
							'font-size': '19px',
						},
						l: {
							'font-size': '38px',
						},
						m: {
							'font-size': '48px',
						},
						s: {
							'font-size': '11px',
						},
						xs: {
							'font-size': '30px',
						},
					},
				},
			},
			'text-maxi-12 .maxi-text-block__content li': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					typography: {
						general: {
							'font-weight': 800,
						},
						xxl: {
							'font-size': '49px',
						},
						xl: {
							'font-size': '19px',
						},
						l: {
							'font-size': '38px',
						},
						m: {
							'font-size': '48px',
						},
						s: {
							'font-size': '11px',
						},
						xs: {
							'font-size': '30px',
						},
					},
				},
			},
			'text-maxi-12 .maxi-text-block__content a': {
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 768,
					xs: 480,
				},
				content: {
					typography: {
						general: {
							'font-weight': 800,
						},
						xxl: {
							'font-size': '49px',
						},
						xl: {
							'font-size': '19px',
						},
						l: {
							'font-size': '38px',
						},
						m: {
							'font-size': '48px',
						},
						s: {
							'font-size': '11px',
						},
						xs: {
							'font-size': '30px',
						},
					},
				},
			},
		};
		const breakpoints = {
			xxl: 1920,
			xl: 1920,
			l: 1366,
			m: 1024,
			s: 768,
			xs: 480,
		};

		const result = styleGenerator(styles, breakpoints, 'xl');

		expect(result).toMatchSnapshot();
	});
});
