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

	const classes = 'maxi-number-counter-block';

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			<div className='maxi-number-counter__box'>
				{!attributes['number-counter-circle-status'] && (
					<svg viewBox='0 0 180 180'>
						<circle
							className='maxi-number-counter__box__background'
							stroke-width={attributes['number-counter-stroke']}
							fill='none'
							cx='90'
							cy='90'
							r={attributes['number-counter-radius']}
						/>
						<circle
							className='maxi-number-counter__box__circle'
							stroke-width={attributes['number-counter-stroke']}
							fill='none'
							cx='90'
							cy='90'
							r={attributes['number-counter-radius']}
							stroke-linecap={
								attributes['number-counter-rounded-status']
									? 'round'
									: ''
							}
							stroke-dasharray={`0 ${
								2 *
								Math.PI *
								attributes['number-counter-radius']
							}`}
						/>
					</svg>
				)}
				<span className='maxi-number-counter__box__text'></span>
			</div>
		</MaxiBlock>
	);
};

export default save;
