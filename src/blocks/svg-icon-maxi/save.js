/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Save
 */
const addAlt = (content, title, description, uniqueID) => {
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

	const name = 'maxi-blocks/svg-icon-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			aria-label={attributes.ariaLabels?.canvas}
		>
			<RawHTML className='maxi-svg-icon-block__icon'>
				{addAlt(
					attributes.content,
					attributes.altTitle,
					attributes.altDescription,
					attributes.uniqueID
				)}
			</RawHTML>
		</MaxiBlock.save>
	);
};

export default save;
