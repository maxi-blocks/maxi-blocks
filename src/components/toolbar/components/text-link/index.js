/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { __experimentalLinkControl } = wp.blockEditor;
const { useSelect } = wp.data;
const { getActiveFormat } = wp.richText;

/**
 * Internal dependencies
 */
import {
	getFormatSettings,
	getFormattedString,
} from '../../../../extensions/text/formats';
import ToolbarPopover from '../toolbar-popover';

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
const Link = props => {
	const { blockName, content, onChange, node, isList, typeOfList } = props;

	const formatName = 'maxi-blocks/text-link';

	const formatElement = {
		element: node,
		html: content,
		multilineTag: isList ? 'li' : undefined,
		multilineWrapperTags: isList ? typeOfList : undefined,
		__unstableIsEditableTree: true,
	};

	const { formatValue, isActive, formatOptions } = useSelect(() => {
		const { formatValue, isActive } = getFormatSettings(
			formatElement,
			formatName
		);

		/**
		 * As '__unstablePasteRule' is not working correctly, let's do some cheats
		 */
		formatValue.formats = formatValue.formats.map(formatEl => {
			return formatEl.map(format => {
				if (format.type === 'core/link') format.type = formatName;

				return format;
			});
		});

		const formatOptions = getActiveFormat(formatValue, formatName);

		return {
			formatValue,
			isActive,
			formatOptions,
		};
	}, [getActiveFormat, formatElement]);

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const createLinkValue = formatOptions => {
		if (isEmpty(formatOptions)) return;

		const {
			attributes: { url, target, id },
			unregisteredAttributes: { rel },
		} = formatOptions;

		const value = {
			url,
			opensInNewTab: target === '_blank',
			id,
		};

		if (rel) {
			value.noFollow = rel.indexOf('nofollow') >= 0;
			value.sponsored = rel.indexOf('sponsored') >= 0;
			value.ugc = rel.indexOf('ugc') >= 0;
		}

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
		const format = {
			type: formatName,
			attributes: {
				url,
				rel: '',
			},
		};

		if (type) format.attributes.type = type;
		if (id) format.attributes.type = id;

		if (opensInNewTab) {
			format.attributes.target = '_blank';
			format.attributes.rel += 'noreferrer noopener';
		}
		if (noFollow) format.attributes.rel += ' nofollow';
		if (sponsored) format.attributes.rel += ' sponsored';
		if (ugc) format.attributes.rel += ' ugc';

		return format;
	};

	const onClick = attributes => {
		const newContent = getFormattedString({
			formatValue,
			formatName,
			isActive,
			isList,
			attributes: createLinkAttribute(attributes),
		});

		onChange(newContent);
	};

	return (
		<ToolbarPopover
			icon={toolbarLink}
			tooltip={__('Link', 'maxi-blocks')}
			content={
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
			}
		/>
	);
};

export default Link;
