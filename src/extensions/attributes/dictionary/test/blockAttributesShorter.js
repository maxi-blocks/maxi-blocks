import blockAttributesShorter from '../blockAttributesShorter';
import accordionAttributes from '../../../../blocks/accordion-maxi/attributes';
import buttonAttributes from '../../../../blocks/button-maxi/attributes';
import columnAttributes from '../../../../blocks/column-maxi/attributes';
import containerAttributes from '../../../../blocks/container-maxi/attributes';
import dividerAttributes from '../../../../blocks/divider-maxi/attributes';
import groupAttributes from '../../../../blocks/group-maxi/attributes';
import imageAttributes from '../../../../blocks/image-maxi/attributes';
import mapAttributes from '../../../../blocks/map-maxi/attributes';
import numberCounterAttributes from '../../../../blocks/number-counter-maxi/attributes';
import paneAttributes from '../../../../blocks/pane-maxi/attributes';
import rowAttributes from '../../../../blocks/row-maxi/attributes';
import searchAttributes from '../../../../blocks/search-maxi/attributes';
import slideAttributes from '../../../../blocks/slide-maxi/attributes';
import sliderAttributes from '../../../../blocks/slider-maxi/attributes';
import svgIconAttributes from '../../../../blocks/svg-icon-maxi/attributes';
import textAttributes from '../../../../blocks/text-maxi/attributes';
import videoAttributes from '../../../../blocks/video-maxi/attributes';

jest.mock('../../../../blocks/accordion-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/button-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/column-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/container-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/divider-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/group-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/image-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/map-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/number-counter-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/pane-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/row-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/search-maxi/data', () => ({
	customCss: {},
	transition: {},
	prefixes: {},
}));
jest.mock('../../../../blocks/slide-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/slider-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/svg-icon-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/text-maxi/data', () => ({
	customCss: {},
	transition: {},
}));
jest.mock('../../../../blocks/video-maxi/data', () => ({
	customCss: {},
	transition: {},
}));

const shortAccordionAttributes = blockAttributesShorter(accordionAttributes);
const shortButtonAttributes = blockAttributesShorter(buttonAttributes);
const shortColumnAttributes = blockAttributesShorter(columnAttributes);
const shortContainerAttributes = blockAttributesShorter(containerAttributes);
const shortDividerAttributes = blockAttributesShorter(dividerAttributes);
const shortGroupAttributes = blockAttributesShorter(groupAttributes);
const shortImageAttributes = blockAttributesShorter(imageAttributes);
const shortMapAttributes = blockAttributesShorter(mapAttributes);
const shortNumberCounterAttributes = blockAttributesShorter(
	numberCounterAttributes
);
const shortPaneAttributes = blockAttributesShorter(paneAttributes);
const shortRowAttributes = blockAttributesShorter(rowAttributes);
const shortSearchAttributes = blockAttributesShorter(searchAttributes);
const shortSlideAttributes = blockAttributesShorter(slideAttributes);
const shortSliderAttributes = blockAttributesShorter(sliderAttributes);
const shortSvgIconAttributes = blockAttributesShorter(svgIconAttributes);
const shortTextAttributes = blockAttributesShorter(textAttributes);
const shortVideoAttributes = blockAttributesShorter(videoAttributes);

describe('blockAttributesShorter', () => {
	it('Accordion attributes', () => {
		expect(shortAccordionAttributes).toMatchSnapshot();
	});

	it('Accordion attributes label are not repeated', () => {
		const allKeys = Object.keys(shortAccordionAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Button attributes', () => {
		expect(shortButtonAttributes).toMatchSnapshot();
	});

	it('Button attributes label are not repeated', () => {
		const allKeys = Object.keys(shortButtonAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Column attributes', () => {
		expect(shortColumnAttributes).toMatchSnapshot();
	});

	it('Column attributes label are not repeated', () => {
		const allKeys = Object.keys(shortColumnAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Container attributes', () => {
		expect(shortContainerAttributes).toMatchSnapshot();
	});

	it('Container attributes label are not repeated', () => {
		const allKeys = Object.keys(shortContainerAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Divider attributes', () => {
		expect(shortDividerAttributes).toMatchSnapshot();
	});

	it('Divider attributes label are not repeated', () => {
		const allKeys = Object.keys(shortDividerAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Group attributes', () => {
		expect(shortGroupAttributes).toMatchSnapshot();
	});

	it('Group attributes label are not repeated', () => {
		const allKeys = Object.keys(shortGroupAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Image attributes', () => {
		expect(shortImageAttributes).toMatchSnapshot();
	});

	it('Image attributes label are not repeated', () => {
		const allKeys = Object.keys(shortImageAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Map attributes', () => {
		expect(shortMapAttributes).toMatchSnapshot();
	});

	it('Map attributes label are not repeated', () => {
		const allKeys = Object.keys(shortMapAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Number counter attributes', () => {
		expect(shortNumberCounterAttributes).toMatchSnapshot();
	});

	it('Number counter attributes label are not repeated', () => {
		const allKeys = Object.keys(shortNumberCounterAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Pane attributes', () => {
		expect(shortPaneAttributes).toMatchSnapshot();
	});

	it('Pane attributes label are not repeated', () => {
		const allKeys = Object.keys(shortPaneAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Row attributes', () => {
		expect(shortRowAttributes).toMatchSnapshot();
	});

	it('Row attributes label are not repeated', () => {
		const allKeys = Object.keys(shortRowAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Search attributes', () => {
		expect(shortSearchAttributes).toMatchSnapshot();
	});

	it('Search attributes label are not repeated', () => {
		const allKeys = Object.keys(shortSearchAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Slide attributes', () => {
		expect(shortSlideAttributes).toMatchSnapshot();
	});

	it('Slide attributes label are not repeated', () => {
		const allKeys = Object.keys(shortSlideAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Slider attributes', () => {
		expect(shortSliderAttributes).toMatchSnapshot();
	});

	it('Slider attributes label are not repeated', () => {
		const allKeys = Object.keys(shortSliderAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Svg icon attributes', () => {
		expect(shortSvgIconAttributes).toMatchSnapshot();
	});

	it('Svg icon attributes label are not repeated', () => {
		const allKeys = Object.keys(shortSvgIconAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Text attributes', () => {
		expect(shortTextAttributes).toMatchSnapshot();
	});

	it('Text attributes label are not repeated', () => {
		const allKeys = Object.keys(shortTextAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Video attributes', () => {
		expect(shortVideoAttributes).toMatchSnapshot();
	});

	it('Video attributes label are not repeated', () => {
		const allKeys = Object.keys(shortVideoAttributes);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});
});
