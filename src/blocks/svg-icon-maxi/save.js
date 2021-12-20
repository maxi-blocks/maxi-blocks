/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import MaxiBlock, { getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;

	const name = 'maxi-blocks/svg-icon-maxi';

	return (
		<MaxiBlock {...getMaxiBlockAttributes({ ...props, name })} isSave>
			<RawHTML className='maxi-svg-icon-block__icon'>
				{attributes.content}
			</RawHTML>
		</MaxiBlock>
	);
};

export default save;
