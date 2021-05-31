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
import {
	getFormattedString,
	applyLinkFormat,
	removeLinkFormat,
	withFormatValue,
	setFormat,
	getFormatPosition,
} from '../../../../extensions/text/formats';

/**
 * External dependencies
 */
import { isEmpty, trim, isEqual } from 'lodash';

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
		linkSettings,
		onClose,
	} = props;

	const formatName = 'maxi-blocks/text-link';

	const { formatOptions } = useSelect(() => {
		const formatOptions = getActiveFormat(formatValue, formatName);

		return {
			formatOptions,
		};
	}, [getActiveFormat, formatValue, formatName]);

	const typography = { ...getGroupAttributes(props, 'typography') };

	const createLinkValue = formatOptions => {
		if (!isEmpty(linkSettings)) return linkSettings;
		if (!formatOptions || isEmpty(formatValue)) return { url: '' };

		const {
			attributes: { url, target, id, rel, title = '' },
		} = formatOptions;

		const value = {
			url,
			opensInNewTab: target === '_blank',
			id,
			noFollow: rel && rel.indexOf('nofollow') >= 0,
			sponsored: rel && rel.indexOf('sponsored') >= 0,
			ugc: rel && rel.indexOf('ugc') >= 0,
			title,
		};

		return value;
	};

	const [linkValue, setLinkValue] = useState(
		createLinkValue(linkSettings || formatOptions)
	);

	useEffect(() => {
		const newLinkValue = createLinkValue(linkSettings || formatOptions);

		if (!isEqual(linkValue, newLinkValue)) setLinkValue(newLinkValue);
	}, [formatValue.start, formatValue.end]);

	const createLinkAttributes = ({
		url,
		type,
		id,
		opensInNewTab,
		noFollow,
		sponsored,
		ugc,
		title = '',
	}) => {
		const attributes = {
			url,
			rel: '',
			title,
		};

		if (type) attributes.type = type;
		if (id) attributes.id = id;

		if (opensInNewTab) {
			attributes.target = '_blank';
			attributes.rel += 'noreferrer noopener';
		}
		if (noFollow) attributes.rel += ' nofollow';
		if (sponsored) attributes.rel += ' sponsored';
		if (ugc) attributes.rel += ' ugc';

		// Clean empty attributes, as it returns error on RichText
		// and trims the rest
		Object.entries(attributes).forEach(([key, val]) => {
			if (isEmpty(val)) delete attributes[key];

			attributes[key] = trim(val);
		});
		if (url !== linkValue.url && title === linkValue.title)
			attributes.title = '';

		return attributes;
	};

	const getUpdatedFormatValue = (formatValue, attributes) => {
		const [posStart, posEnd] = getFormatPosition({
			formatValue,
			formatName: 'maxi-blocks/text-link',
			formatClassName: null,
			formatAttributes: linkSettings,
		});

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

		if (isWholeContent || !isEmpty(linkSettings)) {
			const newTypography = setFormat({
				formatValue,
				typography,
				isList,
				value: {
					color: '#ff4a17',
					'text-decoration': 'underline',
				},
				textLevel,
			});

			onChange({ linkSettings: attributes, ...newTypography });
		} else {
			const obj = applyLinkFormat({
				formatValue,
				typography,
				linkAttributes: createLinkAttributes(attributes),
				isList,
				textLevel,
				linkSettings,
			});

			onChange(obj);
		}
	};

	const removeLinkFormatHandle = () => {
		if (!isEmpty(linkSettings)) {
			const newTypography = setFormat({
				formatValue: { ...formatValue, start: 0, end: 0 },
				typography,
				isList,
				value: {
					color: '',
					'text-decoration': '',
				},
				textLevel,
			});

			onChange({ linkSettings: null, ...newTypography });
		} else {
			const obj = removeLinkFormat({
				formatValue,
				isList,
				typography,
				textLevel,
				attributes: linkValue,
			});

			onChange(obj);
		}

		const newLinkAttributes = createLinkAttributes({ url: '' });
		const newLinkValue = createLinkValue({
			attributes: newLinkAttributes,
		});

		setLinkValue(newLinkValue);

		onClose();
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
				createLinkAttributes(attributes)
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

		const newLinkAttributes = createLinkAttributes(newAttributes);
		const newLinkValue = createLinkValue({
			attributes: newLinkAttributes,
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
	const { blockName } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

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
