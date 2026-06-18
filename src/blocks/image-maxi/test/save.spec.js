import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

import save from '@blocks/image-maxi/save';

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
		mediaHeight: 600,
		mediaID: 10,
		mediaURL: 'full.jpg',
		mediaWidth: 900,
		'mediaHeight-l': 480,
		'mediaURL-l': 'large.jpg',
		'mediaWidth-l': 640,
		'mediaHeight-xs': 144,
		'mediaURL-xs': 'small.jpg',
		'mediaWidth-xs': 300,
		uniqueID: 'image-maxi-test',
	},
});

describe('Image Maxi save responsive image size sources', () => {
	it('keeps responsive image size sources out of saved markup', () => {
		const html = renderToStaticMarkup(
			React.createElement(save, getProps())
		);

		expect(html).not.toContain('<picture');
		expect(html).not.toContain('<source');
		expect(html).toContain('src="full.jpg"');
		expect(html).toContain('width="900"');
		expect(html).toContain('height="600"');
	});
});
