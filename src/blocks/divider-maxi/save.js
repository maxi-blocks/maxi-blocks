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
	const { uniqueID, lineOrientation, parentBlockStyle } = attributes;

	const classes = classnames(
		'maxi-divider-block',
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal',
		getPaletteClasses(
			attributes,
			[
				'background',
				'background-hover',
				'divider',
				'divider-hover',
				'box-shadow',
				'box-shadow-hover',
			],
			'maxi-blocks/divider-maxi',
			parentBlockStyle
		)
	);

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			{attributes['divider-border-style'] !== 'none' && (
				<hr className='maxi-divider-block__divider' />
			)}
		</MaxiBlock>
	);
};

export default save;
