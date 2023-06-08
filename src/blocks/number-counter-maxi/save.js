// Related to the gutenberg issue for SVG https://github.com/WordPress/gutenberg/issues/30241
/*
eslint-disable react/no-unknown-property
*/

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const {
		uniqueID,
		'number-counter-stroke': stroke,
		'number-counter-circle-status': circleStatus,
		'number-counter-rounded-status': roundedStatus,
		styleID,
	} = attributes;

	const classes = 'maxi-number-counter-block';

	const radius = 90;

	return (
		<MaxiBlock.save
			className={classes}
			id={uniqueID}
			{...getMaxiBlockAttributes(props)}
			data-maxi-style-id={styleID}
		>
			<div className='maxi-number-counter__box'>
				{!circleStatus && (
					<div className='maxi-number-counter__box__container'>
						<svg
							viewBox={`0 0 ${radius * 2 + stroke} ${
								radius * 2 + stroke
							}`}
						>
							<circle
								className='maxi-number-counter__box__background'
								stroke-width={stroke}
								fill='none'
								cx={radius + stroke / 2}
								cy={radius + stroke / 2}
								r={radius}
							/>
							<circle
								className='maxi-number-counter__box__circle'
								stroke-width={stroke}
								fill='none'
								cx={radius + stroke / 2}
								cy={radius + stroke / 2}
								r={radius}
								stroke-linecap={roundedStatus ? 'round' : ''}
								stroke-dasharray={`0 ${2 * Math.PI * radius}`}
							/>
						</svg>
						<span className='maxi-number-counter__box__text' />
					</div>
				)}
				{circleStatus && (
					<span className='maxi-number-counter__box__text circle-hidden' />
				)}
			</div>
		</MaxiBlock.save>
	);
};

export default save;
