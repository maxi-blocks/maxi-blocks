/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { getHasLink, WithLink } from '@extensions/save/utils';
import { getGroupAttributes } from '@extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Save
 */
export const addAlt = (content, title, description, uniqueID) => {
	if (isEmpty(title) && isEmpty(description)) {
		return content;
	}
	let withAlt = content;
	const titleID = isEmpty(title) ? '' : `title-${uniqueID}`;
	const descID = isEmpty(description) ? '' : `desc-${uniqueID}`;

	if (!isEmpty(title)) {
		withAlt = withAlt.replace(
			/<svg.*?>/,
			`<svg${withAlt.match(/<svg(.*?)>/)[1]} aria-labelledby="${titleID}${
				!isEmpty(description) ? ` ${descID}` : ''
			}"><title id="${titleID}">${title}</title>`
		);
	}
	if (!isEmpty(description)) {
		if (!isEmpty(title))
			withAlt = withAlt.replace(
				'</title>',
				`</title><desc id="${descID}">${description}</desc>`
			);
		else
			withAlt = withAlt.replace(
				/<svg.*?>/,
				`<svg${
					withAlt.match(/<svg(.*?)>/)[1]
				} aria-labelledby="${descID}"><desc id="${descID}">${description}</desc>`
			);
	}

	return withAlt;
};

const save = props => {
	const { attributes } = props;
	const { linkSettings } = attributes;
	const dynamicContent = getGroupAttributes(attributes, 'dynamicContent');

	const name = 'maxi-blocks/svg-icon-maxi';
	const iconContent = addAlt(
		attributes.content,
		attributes.altTitle,
		attributes.altDescription,
		attributes.uniqueID
	);
	const hasLink = getHasLink(linkSettings, dynamicContent);

	// 'svg' = link wraps just the icon (internal <a> inside the block)
	// 'canvas' or undefined = link wraps the whole block (external <a>)
	const wrapIcon =
		linkSettings?.linkElement === 'svg' && hasLink;
	const wrapCanvas =
		!wrapIcon && hasLink;

	const icon = wrapIcon ? (
		<div className='maxi-svg-icon-block__icon-wrapper'>
			<WithLink
				linkSettings={linkSettings ?? {}}
				dynamicContent={dynamicContent}
				className='maxi-svg-icon-block__icon'
			>
				<RawHTML>{iconContent}</RawHTML>
			</WithLink>
		</div>
	) : (
		<RawHTML className='maxi-svg-icon-block__icon'>
			{iconContent}
		</RawHTML>
	);

	const block = (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={attributes.ariaLabels?.canvas}
		>
			{icon}
		</MaxiBlock.save>
	);

	if (wrapCanvas) {
		return (
			<WithLink
				linkSettings={linkSettings ?? {}}
				dynamicContent={dynamicContent}
			>
				{block}
			</WithLink>
		);
	}

	return block;
};

export default save;
