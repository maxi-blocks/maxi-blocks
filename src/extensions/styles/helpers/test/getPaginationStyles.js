import {
	getPaginationStyles,
	getPaginationLinksStyles,
	getPaginationColours,
} from '@extensions/styles/helpers/getPaginationStyles';

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => 0)
);

describe('getPaginationStyles', () => {
	it('Should return the correct styles for empty object', () => {
		const result = getPaginationStyles({});

		expect(result).toMatchSnapshot();
	});

	it('Should return the correct styles with flex attributes', () => {
		const result = getPaginationStyles({
			'cl-pagination': true,
			'cl-pagination-total-all': true,
			'cl-pagination-show-page-list': true,
			'cl-pagination-previous-text': 'Previous',
			'cl-pagination-next-text': 'Next',
			'cl-pagination-palette-status-general': true,
			'cl-pagination-palette-sc-status-general': false,
			'cl-pagination-palette-color-general': 3,
			'cl-pagination-list-palette-status-general': true,
			'cl-pagination-list-palette-sc-status-general': false,
			'cl-pagination-list-palette-color-general': 3,
			'cl-pagination-font-size-unit-general': 'px',
			'cl-pagination-line-height-unit-general': 'px',
			'cl-pagination-letter-spacing-unit-general': 'px',
			'cl-pagination-text-indent-unit-general': 'px',
			'cl-pagination-bottom-gap-unit-general': 'px',
			'cl-pagination-link-hover-palette-status': true,
			'cl-pagination-link-hover-palette-sc-status': false,
			'cl-pagination-link-hover-palette-color': 4,
			'cl-pagination-link-current-palette-status': true,
			'cl-pagination-link-current-palette-sc-status': false,
			'cl-pagination-link-current-palette-color': 6,
			'cl-pagination-flex-basis-unit-general': 'px',
			'cl-pagination-justify-content-general': 'center',
			'cl-pagination-align-content-general': 'center',
			'cl-pagination-row-gap-unit-general': 'px',
			'cl-pagination-column-gap-unit-general': 'px',
			'cl-pagination-per-page': 6,
			'cl-pagination-flex-direction-general': 'column',
			'cl-pagination-align-items-general': 'center',
			'cl-pagination-row-gap-general': 5,
		});

		expect(result).toMatchSnapshot();
	});
});

describe('getPaginationLinksStyles', () => {
	it('Should return the correct styles for empty object', () => {
		const result = getPaginationLinksStyles({
			blockStyle: 'light',
		});

		expect(result).toMatchSnapshot();
	});

	it('Should return the correct styles with typography attributes', () => {
		const result = getPaginationLinksStyles({
			blockStyle: 'light',
			'cl-pagination': true,
			'cl-pagination-total-all': true,
			'cl-pagination-show-page-list': true,
			'cl-pagination-previous-text': 'Previous',
			'cl-pagination-next-text': 'Next',
			'cl-pagination-palette-status-general': true,
			'cl-pagination-palette-sc-status-general': false,
			'cl-pagination-palette-color-general': 5,
			'cl-pagination-list-palette-status-general': true,
			'cl-pagination-list-palette-sc-status-general': false,
			'cl-pagination-list-palette-color-general': 3,
			'cl-pagination-font-size-unit-general': 'px',
			'cl-pagination-line-height-unit-general': 'px',
			'cl-pagination-letter-spacing-unit-general': 'px',
			'cl-pagination-text-indent-unit-general': 'px',
			'cl-pagination-bottom-gap-unit-general': 'px',
			'cl-pagination-link-hover-palette-status': true,
			'cl-pagination-link-hover-palette-sc-status': false,
			'cl-pagination-link-hover-palette-color': 8,
			'cl-pagination-link-current-palette-status': true,
			'cl-pagination-link-current-palette-sc-status': false,
			'cl-pagination-link-current-palette-color': 8,
			'cl-pagination-flex-basis-unit-general': 'px',
			'cl-pagination-justify-content-general': 'center',
			'cl-pagination-align-content-general': 'center',
			'cl-pagination-row-gap-unit-general': 'px',
			'cl-pagination-column-gap-unit-general': 'px',
			'cl-pagination-per-page': 6,
			'cl-pagination-flex-direction-general': 'column',
			'cl-pagination-align-items-general': 'center',
			'cl-pagination-row-gap-general': 5,
			'cl-pagination-font-size-general': 18,
			'cl-pagination-color-general': null,
			'cl-pagination-palette-opacity-general': 1,
			'cl-pagination-text-decoration-general': 'underline',
		});

		expect(result).toMatchSnapshot();
	});
});

describe('getPaginationColours', () => {
	it('Should return empty object when no colors are set', () => {
		const result = getPaginationColours(
			{
				blockStyle: 'light',
			},
			'current'
		);

		expect(result).toMatchSnapshot();
	});

	it('Should return correct styles when using palette colors', () => {
		const result = getPaginationColours(
			{
				blockStyle: 'light',
				'cl-pagination': true,
				'cl-pagination-total-all': true,
				'cl-pagination-show-page-list': true,
				'cl-pagination-previous-text': 'Previous',
				'cl-pagination-next-text': 'Next',
				'cl-pagination-palette-status-general': true,
				'cl-pagination-palette-sc-status-general': false,
				'cl-pagination-palette-color-general': 5,
				'cl-pagination-list-palette-status-general': true,
				'cl-pagination-list-palette-sc-status-general': false,
				'cl-pagination-list-palette-color-general': 3,
				'cl-pagination-font-size-unit-general': 'px',
				'cl-pagination-line-height-unit-general': 'px',
				'cl-pagination-letter-spacing-unit-general': 'px',
				'cl-pagination-text-indent-unit-general': 'px',
				'cl-pagination-bottom-gap-unit-general': 'px',
				'cl-pagination-link-hover-palette-status': true,
				'cl-pagination-link-hover-palette-sc-status': false,
				'cl-pagination-link-hover-palette-color': 8,
				'cl-pagination-link-current-palette-status': true,
				'cl-pagination-link-current-palette-sc-status': false,
				'cl-pagination-link-current-palette-color': 8,
				'cl-pagination-flex-basis-unit-general': 'px',
				'cl-pagination-justify-content-general': 'center',
				'cl-pagination-align-content-general': 'center',
				'cl-pagination-row-gap-unit-general': 'px',
				'cl-pagination-column-gap-unit-general': 'px',
				'cl-pagination-per-page': 6,
				'cl-pagination-flex-direction-general': 'column',
				'cl-pagination-align-items-general': 'center',
				'cl-pagination-row-gap-general': 5,
				'cl-pagination-font-size-general': 18,
				'cl-pagination-color-general': null,
				'cl-pagination-palette-opacity-general': 1,
				'cl-pagination-text-decoration-general': 'underline',
			},
			'current'
		);

		expect(result).toMatchSnapshot();
	});
});
