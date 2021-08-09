/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { __experimentalLinkControl } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { getActiveFormat } from '@wordpress/rich-text';
import { useEffect, useState } from '@wordpress/element';

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
	withFormatValue,
	getFormatPosition,
} from '../../../../extensions/text/formats';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const LinkContent = withFormatValue(props => {
	const {
		onChange,
		isList,
		formatValue,
		textLevel,
		onClose,
		blockStyle,
		styleCard,
	} = props;

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

	const setLinkFormat = attributes => {
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
				linkValue,
			}),
			isList,
			textLevel,
			saveFormatValue: true,
		});

		onChange(obj);
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

		onChange(obj);

		const newLinkAttributes = createLinkAttributes({
			url: '',
			linkValue,
		});

		const newLinkValue = createLinkValue({
			formatOptions: { attributes: newLinkAttributes },
			formatValue,
		});

		setLinkValue(newLinkValue);
	};

	const forceSSL = attributes => {
		const { url } = attributes;

		attributes.url = url.replace(/^http:\/\//i, 'https://');

		return attributes;
	};

	const updateLinkString = attributes => {
		const content = getFormattedString({
			formatValue: getUpdatedFormatValue(
				formatValue,
				createLinkAttributes({ ...attributes, linkValue })
			),
			isList,
		});

		onChange({ content });
	};

	const onClick = attributes => {
		const newAttributes = forceSSL(attributes);

		if (!formatOptions && !isEmpty(newAttributes.url))
			setLinkFormat(newAttributes);
		else updateLinkString(newAttributes);

		const newLinkAttributes = createLinkAttributes({
			...newAttributes,
			linkValue,
		});
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
						title: __('Add "nofollow" rel', 'maxi-blocks'),
					},
					{
						id: 'sponsored',
						title: __('Add "sponsored" rel', 'maxi-blocks'),
					},
					{
						id: 'ugc',
						title: __('Add "UGC" rel', 'maxi-blocks'),
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
});

const Link = props => {
	const { blockName, isCaptionToolbar = false } = props;

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	return (
		<ToolbarPopover
			icon={toolbarLink}
			tooltip={__('Link', 'maxi-blocks')}
			className='toolbar-item__text-link'
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
};

export default Link;
