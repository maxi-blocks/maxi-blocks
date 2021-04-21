/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLinkControl } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { getActiveFormat } from '@wordpress/rich-text';
import { Button } from '@wordpress/components';
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getFormattedString,
	applyLinkFormat,
	removeLinkFormat,
	withFormatValue,
	setFormat,
} from '../../../../extensions/text/formats';
import ToolbarPopover from '../toolbar-popover';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = withFormatValue(props => {
	const {
		blockName,
		onChange,
		isList,
		formatValue,
		textLevel,
		linkSettings,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const formatName = 'maxi-blocks/text-link';

	const { formatOptions } = useSelect(() => {
		const formatOptions = getActiveFormat(formatValue, formatName);

		return {
			formatOptions,
		};
	}, [getActiveFormat, formatValue, formatName]);

	const typography = { ...getGroupAttributes(props, 'typography') };

	const ref = useRef();

	const createLinkValue = formatOptions => {
		if (!isEmpty(linkSettings)) return linkSettings;
		if (!formatOptions || isEmpty(formatValue)) return {};

		const {
			attributes: { url, target, id, rel },
		} = formatOptions;

		const value = {
			url,
			opensInNewTab: target === '_blank',
			id,
			noFollow: rel && rel.indexOf('nofollow') >= 0,
			sponsored: rel && rel.indexOf('sponsored') >= 0,
			ugc: rel && rel.indexOf('ugc') >= 0,
		};

		return value;
	};

	const createLinkAttribute = ({
		url,
		type,
		id,
		opensInNewTab,
		noFollow,
		sponsored,
		ugc,
	}) => {
		const attributes = {
			url,
			rel: '',
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

		return attributes;
	};

	const getUpdatedFormatValue = (formatValue, attributes) => {
		formatValue.formats = formatValue.formats.map(formatEl => {
			return formatEl.map(format => {
				if (format.type === 'maxi-blocks/text-link') {
					format.attributes = attributes;
				}

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
				linkAttributes: createLinkAttribute(attributes),
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
			});

			onChange(obj);
		}

		if (ref.current) ref.current.node.state.isOpen = false;
	};

	const updateLinkString = attributes => {
		const content = getFormattedString({
			formatValue: getUpdatedFormatValue(
				formatValue,
				createLinkAttribute(attributes)
			),
			isList,
		});

		onChange({ content });
	};

	const onClick = attributes => {
		if (!formatOptions) setLinkFormat(attributes);
		else updateLinkString(attributes);
	};

	return (
		<ToolbarPopover
			ref={ref}
			icon={toolbarLink}
			tooltip={__('Link', 'maxi-blocks')}
		>
			<div>
				<__experimentalLinkControl
					value={createLinkValue(formatOptions)}
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
				<Button
					className='toolbar-popover-link-destroyer'
					onClick={() => {
						removeLinkFormatHandle();
					}}
				>
					Remove link
				</Button>
			</div>
		</ToolbarPopover>
	);
});

export default Link;
