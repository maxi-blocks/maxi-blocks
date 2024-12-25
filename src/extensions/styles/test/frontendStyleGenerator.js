import frontendStyleGenerator from '@extensions/styles/frontendStyleGenerator';

describe('frontendStyleGenerator', () => {
	it('Returns styles', () => {
		const styles = [
			'text-maxi-2425',
			{
				breakpoints: {
					xxl: 1920,
					xl: 1920,
					l: 1366,
					m: 1024,
					s: 767,
					xs: 480,
				},
				content: {
					' p.maxi-text-block__content': {
						general: {
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
					},
					' p.maxi-text-block__content li': {
						general: {
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
					},
					' p.maxi-text-block__content a': {
						general: {
							'font-style': 'normal',
						},
						l: {
							'font-style': 'italic',
						},
					},
					' > .maxi-background-displayer .maxi-background-displayer__color':
						{
							general: {
								'background-color': 'rgba(56,25,212,1)',
							},
						},
				},
			},
		];

		const result = frontendStyleGenerator(styles);

		expect(result).toMatchSnapshot();
	});
});
