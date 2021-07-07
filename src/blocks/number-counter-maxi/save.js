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

	const radius = attributes['number-counter-radius'];
	const stroke = attributes['number-counter-stroke'];
	const circleStatus = attributes['number-counter-circle-status'];
	const roundedStatus = attributes['number-counter-rounded-status'];

	return (
		<MaxiBlock
			className={classes}
			id={uniqueID}
			{...getMaxiBlockBlockAttributes(props)}
			isSave
		>
			<div
				className='maxi-number-counter__box'
				style={{
					width: `${radius + stroke / 2}px`,
				}}
			>
				{!circleStatus && (
					<svg
						viewBox={`0 0 ${radius * 2 + stroke} ${
							radius * 2 + stroke
						}`}
					>
						<circle
							className='maxi-number-counter__box__background'
							strokeWidth={stroke}
							fill='none'
							cx={radius + stroke / 2}
							cy={radius + stroke / 2}
							r={radius}
						/>
						<circle
							className='maxi-number-counter__box__circle'
							strokeWidth={stroke}
							fill='none'
							cx={radius + stroke / 2}
							cy={radius + stroke / 2}
							r={radius}
							strokeLinecap={roundedStatus ? 'round' : ''}
							strokeDasharray={`0 ${2 * Math.PI * radius}`}
						/>
					</svg>
				)}
				<span className='maxi-number-counter__box__text' />
			</div>
		</MaxiBlock>
	);
};

export default save;
