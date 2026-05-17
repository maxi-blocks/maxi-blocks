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
	const shouldWrapCanvas = linkSettings?.linkElement === 'canvas';
	const shouldWrapIcon =
		!shouldWrapCanvas && getHasLink(linkSettings, dynamicContent);
	const icon = (
		<RawHTML className='maxi-svg-icon-block__icon'>
			{iconContent}
		</RawHTML>
	);

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={attributes.ariaLabels?.canvas}
		>
			{shouldWrapIcon ? (
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
				icon
			)}
		</MaxiBlock.save>
	);
};

export default save;
