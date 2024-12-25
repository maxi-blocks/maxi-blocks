import styleGenerator from '@extensions/styles/styleGenerator';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				receiveBaseBreakpoint: jest.fn(() => 'xl'),
				receiveMaxiDeviceType: jest.fn(() => 'xl'),
			};
		}),
	};
});

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

		const result = styleGenerator(styles);

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

		const result = styleGenerator(styles);

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

		const result = styleGenerator(styles, true);

		expect(result).toMatchSnapshot();
	});
});
