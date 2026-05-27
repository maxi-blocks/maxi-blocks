import styleGenerator from '@extensions/styles/styleGenerator';
import { buildAdvancedCssMediaQueryTarget } from '@extensions/styles/advancedCssMediaQuery';

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

	it('wraps advanced CSS media query selectors around scoped editor styles', () => {
		const mediaQuery =
			'@media screen and (max-width:1160px) and (min-width:1025px)';
		const styles = {
			'group-maxi-1234-u': {
				breakpoints: {},
				content: {
					[buildAdvancedCssMediaQueryTarget(
						mediaQuery,
						' .nav_search'
					)]: {
						general: {
							css: 'background: red !important;',
						},
					},
				},
			},
		};

		const result = styleGenerator(styles);

		expect(result).toContain(
			`${mediaQuery}{body.maxi-blocks--active .edit-post-visual-editor .maxi-block.maxi-block--backend.group-maxi-1234-u .nav_search`
		);
		expect(result).toContain('background: red !important;');
	});

	it('wraps advanced CSS media query custom class selectors around the same editor block', () => {
		const mediaQuery =
			'@media screen and (max-width:1160px) and (min-width:1025px)';
		const styles = {
			'column-maxi-bf04696a-u': {
				breakpoints: {},
				content: {
					[buildAdvancedCssMediaQueryTarget(
						mediaQuery,
						'.nav_search'
					)]: {
						general: {
							css: 'background: red !important;',
						},
					},
				},
			},
		};

		const result = styleGenerator(styles);

		expect(result).toContain(
			`${mediaQuery}{body.maxi-blocks--active .edit-post-visual-editor .maxi-block.maxi-block--backend.column-maxi-bf04696a-u.nav_search`
		);
		expect(result).toContain('background: red !important;');
	});
});
