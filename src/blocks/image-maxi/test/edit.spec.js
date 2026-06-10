import React from 'react';

import Edit from '@blocks/image-maxi/edit';
import { MediaUpload, RichText } from '@wordpress/block-editor';

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn(text => text),
}));

jest.mock('@wordpress/block-editor', () => ({
	MediaUpload: jest.fn(() => null),
	RichText: jest.fn(() => null),
}));

jest.mock('@wordpress/element', () => ({
	createRef: require('react').createRef,
}));

jest.mock('dompurify', () => ({
	sanitize: jest.fn(value => value),
}));

jest.mock('@blocks/image-maxi/inspector', () => jest.fn(() => null));
jest.mock('@components/toolbar', () => jest.fn(() => null));
jest.mock('@components/block-resizer', () => jest.fn(() => null));
jest.mock('@components/button', () => jest.fn(() => null));
jest.mock('@components/hover-preview', () => jest.fn(() => null));
jest.mock('@components/placeholder', () => jest.fn(() => null));
jest.mock('@components/raw-html', () => jest.fn(() => null));
jest.mock('@components/maxi-popover-button', () => jest.fn(() => null));
jest.mock('@components/maxi-block/maxiBlock', () => jest.fn(() => null));
jest.mock('@blocks/image-maxi/styles', () => jest.fn(() => ({})));

jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.fn(() => ({})),
	getIsOverflowHidden: jest.fn(() => false),
	getLastBreakpointAttribute: jest.fn(({ attributes, breakpoint, target }) =>
		attributes[`${target}-${breakpoint}`] ?? attributes[target]
	),
}));

jest.mock('@components/maxi-block', () => ({
	getMaxiBlockAttributes: jest.fn(() => ({})),
}));

jest.mock('@extensions/maxi-block', () => {
	const React = require('react');

	return {
		MaxiBlockComponent: React.Component,
		withMaxiProps: Component => Component,
	};
});

jest.mock('@extensions/svg', () => ({
	injectImgSVG: jest.fn(),
}));

jest.mock('@blocks/image-maxi/data', () => ({
	copyPasteMapping: {},
}));

jest.mock('@extensions/text/formats', () => {
	const React = require('react');

	return {
		TextContext: React.createContext({}),
		onChangeRichText: jest.fn(),
	};
});

jest.mock('@extensions/DC', () => ({
	getDCValues: jest.fn(() => ({
		status: false,
		mediaId: null,
		mediaUrl: null,
		mediaCaption: null,
	})),
	withMaxiContextLoopContext: Component => Component,
}));

jest.mock('@extensions/DC/withMaxiDC', () => Component => Component);

jest.mock('@maxi-icons', () => ({
	toolbarReplaceImage: 'toolbarReplaceImage',
	placeholderImage: 'placeholderImage',
}));

const getProps = captionPosition => ({
	attributes: {
		SVGData: {},
		SVGElement: '',
		altSelector: 'wordpress',
		captionContent: 'Caption text',
		captionPosition,
		captionType: 'custom',
		fitParentSize: false,
		isImageUrl: false,
		isImageUrlInvalid: false,
		mediaAlt: '',
		mediaHeight: 480,
		mediaID: 10,
		mediaURL: 'https://example.com/image.jpg',
		mediaWidth: 640,
		uniqueID: 'image-caption-test',
		useInitSize: false,
		'clip-path-general': false,
		'clip-path-status-general': false,
		'hover-preview-general': false,
		'hover-type': 'none',
		'image-full-width-general': false,
		'img-width-general': 75,
	},
	clientId: 'client-id',
	contextLoopContext: {},
	deviceType: 'general',
	isSelected: true,
	maxiSetAttributes: jest.fn(),
});

const findElementsByType = (node, type) => {
	if (Array.isArray(node)) {
		return node.flatMap(child => findElementsByType(child, type));
	}

	if (!React.isValidElement(node)) {
		return [];
	}

	const matches = node.type === type ? [node] : [];
	const children = node.props?.children;

	return children
		? matches.concat(findElementsByType(children, type))
		: matches;
};

describe('Image Maxi edit caption handlers', () => {
	it.each(['top', 'bottom'])(
		'wires shared caption handlers for the %s caption',
		captionPosition => {
			const instance = new Edit(getProps(captionPosition));
			instance.setState = jest.fn();

			const [tree] = instance.render();
			const [caption] = findElementsByType(tree, RichText);

			expect(caption.props.onFocus).toBe(instance.handleCaptionFocus);
			expect(caption.props.onBlur).toBe(instance.handleCaptionBlur);

			caption.props.onFocus();
			expect(instance.setState).toHaveBeenCalledWith({
				captionRichTextActive: true,
			});

			caption.props.onBlur();
			expect(instance.setState).toHaveBeenCalledWith({
				captionRichTextActive: false,
			});
		}
	);

	it('previews the breakpoint-specific image size source in the editor', () => {
		const baseProps = getProps('bottom');
		const props = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				'mediaURL-l': 'https://example.com/large.jpg',
				'mediaWidth-l': 640,
				'mediaHeight-l': 480,
			},
			deviceType: 'l',
		};
		const instance = new Edit(props);
		instance.setState = jest.fn();

		const [tree] = instance.render();
		const [image] = findElementsByType(tree, 'img');

		expect(image.props.src).toBe('https://example.com/large.jpg');
	});

	it('previews canonical media when the general responsive mirror is stale', () => {
		const baseProps = getProps('bottom');
		const props = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				mediaURL: 'https://example.com/new.jpg',
				mediaWidth: 1200,
				mediaHeight: 800,
				'mediaURL-general': 'https://example.com/old.jpg',
				'mediaWidth-general': 300,
				'mediaHeight-general': 200,
			},
			deviceType: 'general',
		};
		const instance = new Edit(props);
		instance.setState = jest.fn();

		const [tree] = instance.render();
		const [image] = findElementsByType(tree, 'img');

		expect(image.props.src).toBe('https://example.com/new.jpg');
	});

	it('clears breakpoint-specific image size sources when replacing the image', () => {
		const baseProps = getProps('bottom');
		const props = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				'imageSize-l': 'medium',
				'mediaURL-l': 'https://example.com/old-large.jpg',
				'mediaWidth-l': 300,
				'mediaHeight-l': 200,
				'cropOptions-l': {
					image: {
						source_url: 'https://example.com/old-crop.jpg',
					},
				},
			},
		};
		const instance = new Edit(props);
		instance.setState = jest.fn();

		const [tree] = instance.render();
		const [mediaUpload] = findElementsByType(tree, MediaUpload);

		mediaUpload.props.onSelect({
			id: 20,
			url: 'https://example.com/new.jpg',
			width: 1200,
			height: 800,
			title: 'New image',
			alt: '',
		});

		expect(props.maxiSetAttributes).toHaveBeenCalledWith(
			expect.objectContaining({
				mediaID: 20,
				mediaURL: 'https://example.com/new.jpg',
				'mediaURL-general': 'https://example.com/new.jpg',
				'imageSize-l': undefined,
				'mediaURL-l': undefined,
				'mediaWidth-l': undefined,
				'mediaHeight-l': undefined,
				'cropOptions-l': undefined,
			})
		);
	});
});
