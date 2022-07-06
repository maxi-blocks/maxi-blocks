/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Save
 */
const addAlt = (content, title, description) => {
	if (isEmpty(title) && isEmpty(description)) {
		return content;
	}
	let withAlt = content;
	if (!isEmpty(title)) {
		withAlt = withAlt.replace(
			/<svg.*?>/,
			`${withAlt.match(/<svg.*?>/)[0]}<title>${title}</title>`
		);
	}
	if (!isEmpty(description)) {
		if (!isEmpty(title))
			withAlt = withAlt.replace(
				'</title>',
				`</title><desc>${description}</desc>`
			);
		else
			withAlt = withAlt.replace(
				/<svg.*?>/,
				`${withAlt.match(/<svg.*?>/)[0]}<desc>${description}</desc>`
			);
	}

	return withAlt;
};

const save = (props, extendedAttributes = {}) => {
	const { attributes } = props;

	const name = 'maxi-blocks/svg-icon-maxi';

	return (
		<MaxiBlock.save
			{...getMaxiBlockAttributes({ ...props, name })}
			{...extendedAttributes}
		>
			<RawHTML className='maxi-svg-icon-block__icon'>
				{addAlt(
					attributes.content,
					attributes.altTitle,
					attributes.altDescription
				)}
			</RawHTML>
		</MaxiBlock.save>
	);
};

export default save;
