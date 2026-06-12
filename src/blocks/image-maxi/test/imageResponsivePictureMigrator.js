import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

import imageResponsivePictureMigrator, {
	getResponsiveImageSources,
	getResponsiveImageSourcesWithExplicitFallbacks,
	imageResponsivePictureExplicitFallbackMigrator,
} from '../imageResponsivePictureMigrator';

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
const { renderToStaticMarkup } = require('react-dom/server');

jest.mock('@wordpress/block-editor', () => ({
	RichText: {
		Content: ({ className, tagName: Tag, value }) => (
			<Tag className={className}>{value}</Tag>
		),
	},
}));

jest.mock('@components', () => {
	const React = require('react');

	return {
		HoverPreview: ({ children }) => <>{children}</>,
		RawHTML: ({ children }) => (
			<span dangerouslySetInnerHTML={{ __html: children }} />
		),
	};
});

jest.mock('@components/maxi-block', () => {
	const React = require('react');

	return {
		MaxiBlock: {
			save: ({ children, tagName: Tag = 'div', ...props }) => (
				<Tag {...props}>{children}</Tag>
			),
		},
		getMaxiBlockAttributes: jest.fn(() => ({
			id: 'image-maxi-test',
		})),
	};
});

jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.fn(() => ({})),
	getLastBreakpointAttribute: jest.fn(({ attributes, target, breakpoint }) =>
		attributes[`${target}-${breakpoint}`] ??
		attributes[`${target}-general`] ??
		attributes[target]
	),
}));

jest.mock('@extensions/DC', () => ({
	getDCImgSVG: jest.fn(() => '<svg></svg>'),
}));

const getProps = () => ({
	attributes: {
		SVGData: {},
		SVGElement: '',
		ariaLabels: {},
		blockStyle: 'light',
		captionContent: '',
		captionPosition: 'bottom',
		captionType: 'none',
		'dc-status': false,
		fitParentSize: false,
		'hover-type': 'none',
		isImageUrl: false,
		mediaAlt: 'Alt text',
		mediaHeight: 960,
		mediaID: 323,
		mediaURL: 'full.webp',
		mediaWidth: 2000,
		'mediaHeight-l': 737,
		'mediaURL-l': 'large.webp',
		'mediaWidth-l': 1536,
		'mediaHeight-s': 144,
		'mediaURL-s': 'small.webp',
		'mediaWidth-s': 300,
		uniqueID: 'image-maxi-test',
	},
});

describe('Image Maxi responsive picture migrator', () => {
	it('matches content saved with the temporary responsive picture markup', () => {
		const html = renderToStaticMarkup(
			React.createElement(imageResponsivePictureMigrator.save, getProps())
		);

		expect(html).toContain('<picture>');
		expect(html).toContain(
			'<source media="(max-width:767px)" srcSet="small.webp"/>'
		);
		expect(html).toContain(
			'<source media="(max-width:1366px)" srcSet="large.webp"/>'
		);
		expect(html).toContain('src="full.webp"');
		expect(html).toContain('width="2000"');
		expect(html).toContain('height="960"');
	});

	it('keeps attributes unchanged so the current save rewrites clean img markup', () => {
		const attributes = getProps().attributes;

		expect(imageResponsivePictureMigrator.migrate(attributes)).toBe(
			attributes
		);
	});

	it('uses the temporary picture source order and breakpoint media queries', () => {
		expect(getResponsiveImageSources(getProps().attributes)).toEqual([
			{
				breakpoint: 's',
				media: '(max-width:767px)',
				srcSet: 'small.webp',
			},
			{
				breakpoint: 'l',
				media: '(max-width:1366px)',
				srcSet: 'large.webp',
			},
		]);
	});

	it('keeps the original temporary picture migrator compatible with skipped fallback sources', () => {
		const props = getProps();
		props.attributes = {
			...props.attributes,
			'imageSize-m': 'full',
			'mediaURL-m': 'full.webp',
			'mediaWidth-m': 2000,
			'mediaHeight-m': 960,
		};

		const html = renderToStaticMarkup(
			React.createElement(imageResponsivePictureMigrator.save, props)
		);

		expect(html).not.toContain(
			'<source media="(max-width:1024px)" srcSet="full.webp"/>'
		);
	});

	it('matches temporary picture markup with explicit fallback sources', () => {
		const props = getProps();
		props.attributes = {
			...props.attributes,
			'imageSize-m': 'full',
			'mediaURL-m': 'full.webp',
			'mediaWidth-m': 2000,
			'mediaHeight-m': 960,
		};

		const html = renderToStaticMarkup(
			React.createElement(
				imageResponsivePictureExplicitFallbackMigrator.save,
				props
			)
		);

		expect(html).toContain(
			'<source media="(max-width:1024px)" srcSet="full.webp"/>'
		);
		expect(getResponsiveImageSourcesWithExplicitFallbacks(props.attributes))
			.toEqual([
				{
					breakpoint: 's',
					media: '(max-width:767px)',
					srcSet: 'small.webp',
				},
				{
					breakpoint: 'm',
					media: '(max-width:1024px)',
					srcSet: 'full.webp',
				},
				{
					breakpoint: 'l',
					media: '(max-width:1366px)',
					srcSet: 'large.webp',
				},
			]);
	});
});
