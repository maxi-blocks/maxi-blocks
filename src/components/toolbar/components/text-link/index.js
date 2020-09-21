/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { __experimentalLinkControl } = wp.blockEditor;
const { useSelect } = wp.data;
const { getActiveFormat } = wp.richText;
const { Button } = wp.components;

/**
 * Internal dependencies
 */
import {
	__experimentalGetUpdatedString,
	__experimentalApplyLinkFormat,
	__experimentalRemoveLinkFormat,
} from '../../../../extensions/text/formats';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isEmpty, isObject } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = props => {
	const { blockName, onChange, isList, formatValue, typography } = props;

	const formatName = 'maxi-blocks/text-link';

	const { formatOptions } = useSelect(() => {
		const formatOptions = getActiveFormat(formatValue, formatName);

		return {
			formatOptions,
		};
	}, [getActiveFormat, formatValue, formatName]);

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typographyValue = !isObject(typography)
		? JSON.parse(typography)
		: typography;

	const createLinkValue = formatOptions => {
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

		if (start === end) {
			formatValue.start = 0;
			formatValue.end = formatValue.formats.length;
		}

		const {
			typography: newTypography,
			content: newContent,
		} = __experimentalApplyLinkFormat({
			formatValue,
			typography: typographyValue,
			linkAttributes: createLinkAttribute(attributes),
			isList,
		});

		onChange({
			typography: newTypography,
			content: newContent,
		});
	};

	const removeLinkFormat = () => {
		const {
			typography: newTypography,
			content: newContent,
		} = __experimentalRemoveLinkFormat({
			formatValue,
			isList,
			typography: typographyValue,
		});

		onChange({
			typography: JSON.stringify(newTypography),
			content: newContent,
		});
	};

	const updateLinkString = attributes => {
		const newContent = __experimentalGetUpdatedString({
			formatValue: getUpdatedFormatValue(
				formatValue,
				createLinkAttribute(attributes)
			),
			isList,
		});

		onChange({
			typography: JSON.stringify(typographyValue),
			content: newContent,
		});
	};

	const onClick = attributes => {
		if (!formatOptions) setLinkFormat(attributes);
		else if (isEmpty(attributes.url)) removeLinkFormat();
		else updateLinkString(attributes);
	};

	return (
		<ToolbarPopover
			icon={toolbarLink}
			tooltip={__('Link', 'maxi-blocks')}
			content={
				<Fragment>
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
					<Fragment>
						<Button
							className='toolbar-popover-link-destroyer'
							onClick={() => onClick({ url: '' })}
						>
							Remove link
						</Button>
					</Fragment>
				</Fragment>
			}
		/>
	);
};

export default Link;
