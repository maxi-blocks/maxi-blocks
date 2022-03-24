import styleGenerator from '../styleGenerator';

describe('styleGenerator', () => {
	it('Returns `general` styles', () => {
		const styles = {
			'text-maxi-2425': {
				breakpoints: {},
				content: {
					' p.maxi-text-block__content': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' p.maxi-text-block__content li': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' p.maxi-text-block__content a': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' > .maxi-background-displayer .maxi-background-displayer__color':
						{
							general: {
								'background-color': 'rgba(180,174,209,1)',
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
			'text-maxi-2425': {
				breakpoints: {},
				content: {
					' p.maxi-text-block__content': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' p.maxi-text-block__content li': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' p.maxi-text-block__content a': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' > .maxi-background-displayer .maxi-background-displayer__color':
						{
							general: {
								'background-color': 'rgba(180,174,209,1)',
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
	it('Returns `s` styles on iframe', () => {
		const styles = {
			'text-maxi-2425': {
				breakpoints: {},
				content: {
					' p.maxi-text-block__content': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' p.maxi-text-block__content li': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' p.maxi-text-block__content a': {
						general: {
							'font-family': 'Montserrat',
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
						m: {
							'font-style': 'italic',
						},
					},
					' > .maxi-background-displayer .maxi-background-displayer__color':
						{
							general: {
								'background-color': 'rgba(180,174,209,1)',
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

		const result = styleGenerator(styles, breakpoints, 's', true);

		expect(result).toMatchSnapshot();
	});
});
