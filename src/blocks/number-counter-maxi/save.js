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
			<div className='maxi-number-counter'>
				<svg viewBox='0 0 180 180'>
					{!attributes['number-counter-circle-status'] && (
						<>
							<circle
								className='maxi-number-counter__background'
								stroke-width={
									attributes['number-counter-stroke']
								}
								fill='none'
								cx='90'
								cy='90'
								r={attributes['number-counter-radius']}
							/>
							<circle
								className='maxi-number-counter__circle'
								stroke-width={
									attributes['number-counter-stroke']
								}
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
						</>
					)}
					<text
						className='maxi-number-counter__text'
						x='50%'
						y='50%'
						dominant-baseline='middle'
						text-anchor='middle'
					></text>
				</svg>
			</div>
		</MaxiBlock>
	);
};

export default save;
