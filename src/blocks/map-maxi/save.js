/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getAttributesValue } from '../../extensions/attributes';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const uniqueID = getAttributesValue({
		target: 'uniqueID',
		props: attributes,
	});

	const classes = 'maxi-map-block';

	return (
		<MaxiBlock.save
			className={classes}
			id={uniqueID}
			{...getMaxiBlockAttributes(props)}
		>
			<div
				className='maxi-map-block__container'
				id={`maxi-map-block__container-${uniqueID}`}
			/>
		</MaxiBlock.save>
	);
};

export default save;
