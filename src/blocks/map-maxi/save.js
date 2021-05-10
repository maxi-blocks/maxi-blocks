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
	const { uniqueID } = attributes;

	const classes = 'maxi-map-block';

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			<div className='maxi-map-container' id='map'>
				<h1>Map</h1>
			</div>
		</MaxiBlock>
	);
};

export default save;
