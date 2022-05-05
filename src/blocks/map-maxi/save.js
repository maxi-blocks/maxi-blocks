/**
 * Internal dependencies
 */
import MaxiBlock from '../../components/maxi-block';
import { getMaxiBlockAttributes } from '../../extensions/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID } = attributes;

	const classes = 'maxi-map-block';

	return (
		<MaxiBlock.save
			className={classes}
			id={uniqueID}
			{...getMaxiBlockAttributes(props)}
		>
			<div
				className='maxi-map-container'
				id={`map-container-${uniqueID}`}
			/>
		</MaxiBlock.save>
	);
};

export default save;
