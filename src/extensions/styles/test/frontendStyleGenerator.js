import frontendStyleGenerator from '@extensions/styles/frontendStyleGenerator';
import { buildAdvancedCssMediaQueryTarget } from '@extensions/styles/advancedCssMediaQuery';

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

	it('wraps advanced CSS media query selectors around scoped frontend styles', () => {
		const mediaQuery =
			'@media screen and (max-width:1160px) and (min-width:1025px)';
		const styles = [
			'group-maxi-1234-u',
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
		];

		const result = frontendStyleGenerator(styles);

		expect(result).toBe(
			`${mediaQuery}{body.maxi-blocks--active #group-maxi-1234-u .nav_search{background: red !important;}}`
		);
	});

	it('wraps advanced CSS media query custom class selectors around the same frontend block', () => {
		const mediaQuery =
			'@media screen and (max-width:1160px) and (min-width:1025px)';
		const styles = [
			'column-maxi-bf04696a-u',
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
		];

		const result = frontendStyleGenerator(styles);

		expect(result).toBe(
			`${mediaQuery}{body.maxi-blocks--active #column-maxi-bf04696a-u.nav_search{background: red !important;}}`
		);
	});
});
