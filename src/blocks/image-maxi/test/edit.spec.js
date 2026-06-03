import React from 'react';

import Edit from '@blocks/image-maxi/edit';
import { RichText } from '@wordpress/block-editor';

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
});
