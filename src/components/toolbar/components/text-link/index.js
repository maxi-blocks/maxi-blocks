/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLinkControl } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { getActiveFormat } from '@wordpress/rich-text';
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../../../../extensions/styles';
import Button from '../../../button';
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

/**
 * External dependencies
 */
import { isEmpty, isEqual, isNil } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';
import Link from '../link';

/**
 * TextLink
 */

const LinkContent = props => {
	const { onChange, isList, textLevel, onClose, blockStyle, styleCard } =
		props;

	const { formatValue, onChangeTextFormat } = useContext(textContext);

	const formatName = 'maxi-blocks/text-link';

	const { formatOptions } = useSelect(() => {
		const isWholeLink = isEqual(
			getFormatPosition({
				formatValue,
				formatName: 'maxi-blocks/text-link',
				formatClassName: null,
				formatAttributes: null,
			}),
			[0, formatValue.formats.length]
		);
		const end = formatValue.formats.length + 1;
		const start =
			isWholeLink && formatValue.start === formatValue.end
				? 0
				: formatValue.start;
		const formatOptions = getActiveFormat(
			{ ...formatValue, start, end },
			formatName
		);

		return {
			formatOptions,
		};
	}, [getActiveFormat, formatValue, formatName]);

	const typography = { ...getGroupAttributes(props, 'typography') };

	const [linkValue, setLinkValue] = useState(
		createLinkValue({
			formatOptions,
			formatValue,
		})
	);

	useEffect(() => {
		if (formatOptions) {
			const newLinkValue = createLinkValue({
				formatOptions,
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
		const [posStart, posEnd] = getFormatPosition({
			formatValue,
			formatName: 'maxi-blocks/text-link',
			formatClassName: null,
		}) || [0, 0];

		formatValue.formats = formatValue.formats.map((formatEl, i) => {
			return formatEl.map(format => {
				if (
					format.type === 'maxi-blocks/text-link' &&
					posStart <= i &&
					i - 1 <= posEnd
				)
					format.attributes = attributes;

				return format;
			});
		});

		return formatValue;
	};

	const setLinkFormat = (attributes, newLinkValue) => {
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
	};

	const removeLinkFormatHandle = () => {
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

	const forceSSL = attributes => {
		const { url } = attributes;

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

	const onClick = attributes => {
		const newAttributes = forceSSL(attributes);
		const newLinkAttributes = createLinkAttributes({
			...newAttributes,
			linkValue,
		});

		if (!formatOptions && !isEmpty(newAttributes.url))
			setLinkFormat(newAttributes, newLinkAttributes);
		else updateLinkString(newAttributes);

		const newLinkValue = createLinkValue({
			formatOptions: { attributes: newLinkAttributes },
			formatValue,
		});

		setLinkValue(newLinkValue);
	};

	return (
		<>
			<__experimentalLinkControl
				value={linkValue}
				onChange={onClick}
				settings={[
					{
						id: 'opensInNewTab',
						title: __('Open in new tab', 'maxi-blocks'),
					},
					{
						id: 'noFollow',
						title: __('"nofollow"', 'maxi-blocks'),
					},
					{
						id: 'sponsored',
						title: __('"sponsored"', 'maxi-blocks'),
					},
					{
						id: 'ugc',
						title: __('"UGC"', 'maxi-blocks'),
					},
				]}
			/>
			{!isEmpty(linkValue.url) && (
				<Button
					className='toolbar-popover-link-destroyer'
					onClick={removeLinkFormatHandle}
				>
					{__('Remove link', 'maxi-blocks')}
				</Button>
			)}
		</>
	);
};

const TextLink = props => {
	const {
		blockName,
		isCaptionToolbar = false,
		'dc-status': dcStatus = false,
		linkSettings,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	if (!dcStatus)
		return (
			<ToolbarPopover
				icon={toolbarLink}
				tooltip={__('Link', 'maxi-blocks')}
				className={
					!isNil(linkSettings) && !isEmpty(linkSettings.url)
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
