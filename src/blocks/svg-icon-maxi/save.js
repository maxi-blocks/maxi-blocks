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
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { parentBlockStyle } = attributes;

	const name = 'maxi-blocks/svg-icon-maxi';

	const paletteClasses = classnames(
		getPaletteClasses(
			attributes,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
				'svgColorFill',
				'svgColorLine',
			],
			name,
			parentBlockStyle
		)
	);

	return (
		<MaxiBlock
			paletteClasses={paletteClasses}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			<RawHTML className='maxi-svg-icon-block__icon'>
				{attributes.content}
			</RawHTML>
		</MaxiBlock>
	);
};

export default save;
