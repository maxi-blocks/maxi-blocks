import {
	IMAGE_PATTERNS,
	handleImageUpdate,
	getImageSidebarTarget,
} from '../ai/blocks/image';

const matchPattern = message =>
	IMAGE_PATTERNS.find(pattern => pattern.regex.test(message));

const imageBlock = {
	name: 'maxi-blocks/image-maxi',
	attributes: {},
};

describe('image prompt patterns', () => {
	test.each([
		[
			'Set caption text to "Summer Sale"',
			{ property: 'captionContent', value: 'use_prompt' },
		],
		[
			'Set alt text to "Hero banner"',
			{ property: 'mediaAlt', value: 'use_prompt' },
		],
		[
			'Replace the image with https://example.com/photo.jpg',
			{ property: 'mediaURL', value: 'use_prompt' },
		],
	])('matches "%s"', (message, expected) => {
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe(expected.property);
		expect(pattern.value).toBe(expected.value);
	});
});

describe('image prompt to attributes', () => {
	test('maps caption text', () => {
		const changes = handleImageUpdate(
			imageBlock,
			'captionContent',
			'Summer Sale',
			''
		);
		expect(changes).toEqual({
			captionType: 'custom',
			captionContent: 'Summer Sale',
		});
	});

	test('maps alt text', () => {
		const changes = handleImageUpdate(imageBlock, 'mediaAlt', 'Hero', '');
		expect(changes).toEqual({
			altSelector: 'custom',
			mediaAlt: 'Hero',
		});
	});

	test('maps media URL', () => {
		const changes = handleImageUpdate(
			imageBlock,
			'mediaURL',
			'https://example.com/photo.jpg',
			''
		);
		expect(changes).toEqual({
			mediaURL: 'https://example.com/photo.jpg',
			isImageUrl: true,
			isImageUrlInvalid: false,
		});
	});
});

describe('image sidebar targets', () => {
	test.each([
		['captionContent', { tabIndex: 0, accordion: 'caption' }],
		['mediaAlt', { tabIndex: 0, accordion: 'alt tag' }],
		['image_ratio', { tabIndex: 0, accordion: 'dimension' }],
		['alignment', { tabIndex: 0, accordion: 'alignment' }],
		['hover_basic', { tabIndex: 0, accordion: 'hover effect' }],
		['clip_path', { tabIndex: 0, accordion: 'clip path' }],
		['dynamic_image', { tabIndex: 1, accordion: 'dynamic content' }],
		['scroll_effect', { tabIndex: 1, accordion: 'scroll effects' }],
		['image_filter', { tabIndex: 1, accordion: 'custom css' }],
	])('maps %s', (property, expected) => {
		const sidebar = getImageSidebarTarget(property);
		expect(sidebar).toEqual(expected);
	});
});
