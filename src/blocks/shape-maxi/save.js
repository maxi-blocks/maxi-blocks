/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { shapeSVGElement } = attributes;

	const name = 'maxi-blocks/shape-maxi';

	return (
		<MaxiBlock {...getMaxiBlockBlockAttributes({ ...props, name })} isSave>
			<RawHTML className='maxi-shape-block__icon'>
				{shapeSVGElement}
			</RawHTML>
		</MaxiBlock>
	);
};

export default save;
