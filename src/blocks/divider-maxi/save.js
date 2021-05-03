/**
 * Internal dependencies
 */
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
	const { uniqueID, lineOrientation } = attributes;

	const classes = classnames(
		'maxi-divider-block',
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal'
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
