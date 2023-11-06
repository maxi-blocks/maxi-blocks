/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getActiveFormat } from '@wordpress/rich-text';
import { useContext, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import LinkControl from '../../../link-control';
import { getGroupAttributes } from '../../../../extensions/styles';
import ToolbarContext from '../toolbar-popover/toolbarContext';
import ToolbarPopover from '../toolbar-popover';
import { createLinkAttributes, createLinkValue } from './utils';
import {
	getFormattedString,
	applyLinkFormat,
	removeLinkFormat,
	getFormatPosition,
	textContext,
} from '../../../../extensions/text/formats';
import Link from '../link';

/**
 * External dependencies
 */
import { isEmpty, isEqual, isNil } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * TextLink
 */

const LinkContent = props => {
	const {
		onChange,
		isList,
		textLevel,
		onClose,
		blockStyle,
		styleCard,
		content,
	} = props;
	const typography = { ...getGroupAttributes(props, 'typography') };
	const formatName = 'maxi-blocks/text-link';

	console.log('isList', isList);
	console.log('content', content);

	const { formatValue, onChangeTextFormat } = useContext(textContext);

	console.log('formatValue at start', formatValue);

	const getFormatOptions = () => {
		// Checks if the whole text string is under same link
		let linkChecker;
		const isWholeLink =
			isEqual(
				getFormatPosition({
					formatValue,
					formatName: 'maxi-blocks/text-link',
					formatClassName: null,
					formatAttributes: null,
				}),
				[0, formatValue?.formats?.length]
			) &&
			formatValue?.formats?.every(formatArray => {
				return formatArray.every(format => {
					if (format.type !== formatName) return true;

					if (!linkChecker) linkChecker = format.attributes.url;

					return (
						format.type === 'maxi-blocks/text-link' &&
						format.attributes.url === linkChecker
					);
				});
			});
		const end = formatValue?.end || (formatValue?.formats?.length || 0) + 1;
		const start =
			isWholeLink && formatValue?.start === formatValue?.end
				? 0
				: formatValue?.start;
		const formatOptions = getActiveFormat(
			{ ...formatValue, start, end },
			formatName
		);

		return formatOptions;
	};

	const formatOptions = useRef(getFormatOptions());

	const [linkValue, setLinkValue] = useState(
		createLinkValue({
			formatOptions: formatOptions.current,
			formatValue,
		})
	);

	useEffect(() => {
		formatOptions.current = getFormatOptions();

		if (formatOptions.current) {
			const newLinkValue = createLinkValue({
				formatOptions: formatOptions.current,
				formatValue,
			});

			if (!isEqual(linkValue, newLinkValue)) setLinkValue(newLinkValue);
		}
	}, [formatValue.start, formatValue.end]);

	useEffect(() => {
		if (isEmpty(linkValue.url) && Object.keys(linkValue).length > 1)
			onClose();
	}, [linkValue.url]);

	const getUpdatedFormatValue = (formatValue, attributes) => {
		const [posStart] = getFormatPosition({
			formatValue,
			formatName,
			formatClassName: null,
			formatAttributes: formatOptions.current?.attributes,
		}) || [formatValue.start ?? 0];

		// Just need to change one format to change the rest with the same structure,
		// as they share THE SAME object. For example, a word in a sentence that shares same link
		// with position from 5 to 10, will mean format[5] === format[6] === format[7]...=== format[10]
		formatValue?.formats?.[posStart]?.forEach((format, j) => {
			if (format.type === 'maxi-blocks/text-link')
				formatValue.formats[posStart][j].attributes = attributes;
		});

		return formatValue;
	};

	const setLinkFormat = (attributes, newLinkValue) => {
		if (!isList) {
			const { start, end } = formatValue;

			const isWholeContent = start === end;

			const updatedFormatValue = getUpdatedFormatValue(
				formatValue,
				attributes
			);

			const obj = applyLinkFormat({
				formatValue: isWholeContent
					? {
							...updatedFormatValue,
							start: 0,
							end: updatedFormatValue.formats.length,
					  }
					: updatedFormatValue,
				typography,
				linkAttributes: createLinkAttributes({
					...attributes,
					newLinkValue,
				}),
				isList,
				textLevel,
				saveFormatValue: true,
				onChangeTextFormat,
				returnFormatValue: true,
			});

			onChangeTextFormat({
				...obj.formatValue,
				start: updatedFormatValue.start,
				end: updatedFormatValue.end,
			});
			delete obj.formatValue;

			onChange(newLinkValue, obj);
		} else {
			console.log('list link');
			console.log('content', content);
		}
	};

	const onRemoveLink = () => {
		const obj = removeLinkFormat({
			formatValue,
			isList,
			typography,
			textLevel,
			attributes: linkValue,
			blockStyle,
			styleCard,
		});

		const newLinkAttributes = createLinkAttributes({
			url: '',
			linkValue,
		});

		const newLinkValue = createLinkValue({
			formatOptions: { attributes: newLinkAttributes },
			formatValue,
		});

		setLinkValue(newLinkValue);

		onChange(newLinkAttributes, obj);
	};

	const prepareUrl = attributes => {
		const { url } = attributes;

		if (
			url?.startsWith('#') ||
			url?.startsWith('http') ||
			url.startsWith('localhost')
		)
			return attributes;

		if (!url.includes('http:')) attributes.url = `https://${url}`;
		else if (url.includes('http:'))
			attributes.url = url.replace(/^http:\/\//i, 'https://');

		return attributes;
	};

	const updateLinkString = attributes => {
		const newLinkAttributes = createLinkAttributes({
			...attributes,
			linkValue,
		});
		const content = getFormattedString({
			formatValue: getUpdatedFormatValue(formatValue, newLinkAttributes),
			isList,
		});

		onChange(newLinkAttributes, { content });
	};

	const onChangeLink = attributes => {
		console.log('onChangeLink');
		console.log(attributes);
		const newAttributes = prepareUrl(attributes);
		const newLinkAttributes = createLinkAttributes({
			...newAttributes,
			linkValue,
		});

		if (!formatOptions.current && !isEmpty(newAttributes.url))
			setLinkFormat(newAttributes, newLinkAttributes, content);
		else updateLinkString(newAttributes);

		const newLinkValue = createLinkValue({
			formatOptions: { attributes: newLinkAttributes },
			formatValue,
		});

		setLinkValue(newLinkValue);
	};

	return (
		<LinkControl
			linkValue={linkValue}
			onChangeLink={onChangeLink}
			onRemoveLink={onRemoveLink}
			content={content}
		/>
	);
};

const TextLink = props => {
	const {
		blockName,
		isCaptionToolbar = false,
		'dc-status': dcStatus = false,
		linkSettings,
		content,
	} = props;

	let formatValue;

	if (textContext) {
		const contextValue = useContext(textContext);
		formatValue = contextValue?.formatValue
			? contextValue?.formatValue
			: {};
	} else {
		formatValue = {};
	}

	const hasLink =
		!isEmpty(formatValue) &&
		!isEmpty(formatValue?.formats) &&
		formatValue?.formats?.some(formatArray => {
			return formatArray.some(format => {
				return !isEmpty(format?.attributes?.url);
			});
		});

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	if (!dcStatus)
		return (
			<ToolbarPopover
				icon={toolbarLink}
				tooltip={__('Link', 'maxi-blocks')}
				className={
					(!isNil(linkSettings) && !isEmpty(linkSettings.url)) ||
					hasLink
						? 'toolbar-item__link--active toolbar-item__text-link'
						: 'toolbar-item__text-link'
				}
			>
				<ToolbarContext.Consumer>
					{({ isOpen, onClose }) => {
						if (isOpen)
							return (
								<LinkContent
									isOpen={isOpen}
									onClose={onClose}
									content={content}
									{...props}
								/>
							);

						return null;
					}}
				</ToolbarContext.Consumer>
			</ToolbarPopover>
		);

	return <Link {...props} />;
};

export default TextLink;
