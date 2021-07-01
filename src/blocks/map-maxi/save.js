/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getPaletteClasses } from '../../extensions/styles';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID, parentBlockStyle } = attributes;

	const classes = 'maxi-map-block';

	const paletteClasses = getPaletteClasses(attributes, parentBlockStyle);

	return (
		<MaxiBlock
			className={classes}
			paletteClasses={paletteClasses}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			<div
				className='maxi-map-container'
				id={`map-container-${uniqueID}`}
			/>
		</MaxiBlock>
	);
};

export default save;
