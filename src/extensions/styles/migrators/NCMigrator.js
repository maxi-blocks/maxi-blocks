/**
 * Internal dependencies
 */
import {
	MaxiBlock,
	getMaxiBlockAttributes,
} from '@components/maxi-block';

const name = 'Number Counter migrator';

const versions = [
	'0.1',
	'0.0.1 SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
	'0.0.1-SC5',
	'0.0.1-SC6',
];

// No attributes to check except the version
const isEligible = blockAttributes =>
	versions.includes(blockAttributes['maxi-version-current']) ||
	!blockAttributes['maxi-version-origin'];

const save = props => {
	const { attributes } = props;
	const {
		uniqueID,
		'number-counter-stroke': stroke,
		'number-counter-circle-status': circleStatus,
		'number-counter-rounded-status': roundedStatus,
	} = attributes;

	const classes = 'maxi-number-counter-block';

	const radius = 90;

	return (
		<MaxiBlock.save
			className={classes}
			id={uniqueID}
			{...getMaxiBlockAttributes(props)}
		>
			<div className='maxi-number-counter__box'>
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
						<text
							className='maxi-number-counter__box__text'
							textAnchor='middle'
							x='50%'
							y='50%'
						/>
					</svg>
				)}
				{circleStatus && (
					<span className='maxi-number-counter__box__text' />
				)}
			</div>
		</MaxiBlock.save>
	);
};

export default { name, isEligible, save };
