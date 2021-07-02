/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getPaletteClasses } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { parentBlockStyle } = attributes;

	const name = 'maxi-blocks/svg-icon-maxi';

	const paletteClasses = getPaletteClasses(attributes, parentBlockStyle);

	return (
		<MaxiBlock
			paletteClasses={paletteClasses}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			<RawHTML className='maxi-shape-block__icon'>
				{attributes.content}
			</RawHTML>
		</MaxiBlock>
	);
};

export default save;
