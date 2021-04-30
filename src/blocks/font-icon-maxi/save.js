/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID } = attributes;

	const classes = 'maxi-font-icon-block';

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			{!isEmpty(attributes['icon-name']) && (
				<span className='maxi-font-icon-block__icon'>
					<i className={attributes['icon-name']} />
				</span>
			)}
		</MaxiBlock>
	);
};

export default save;
