/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getPaletteClasses } from '../../extensions/styles';
/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { lineOrientation, parentBlockStyle } = attributes;

	const name = 'maxi-blocks/divider-maxi';

	const classes = classnames(
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal'
	);

	const paletteClasses = getPaletteClasses(
		attributes,
		[
			'background',
			'background-hover',
			'divider',
			'divider-hover',
			'box-shadow',
			'box-shadow-hover',
		],
		name,
		parentBlockStyle
	);

	return (
		<MaxiBlock
			classes={classes}
			paletteClasses={paletteClasses}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			{attributes['divider-border-style'] !== 'none' && (
				<hr className='maxi-divider-block__divider' />
			)}
		</MaxiBlock>
	);
};

export default save;
