/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

// Constants
const NAME = 'Number Counter';
const VERSIONS = new Set([
	'0.1',
	'0.0.1 SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
	'0.0.1-SC5',
	'0.0.1-SC6',
]);

// Pre-compute class name
const BLOCK_CLASS = 'maxi-number-counter-block';
const BOX_CLASS = 'maxi-number-counter__box';
const BACKGROUND_CLASS = 'maxi-number-counter__box__background';
const CIRCLE_CLASS = 'maxi-number-counter__box__circle';
const TEXT_CLASS = 'maxi-number-counter__box__text';

const isEligible = blockAttributes =>
	VERSIONS.has(blockAttributes['maxi-version-current']) ||
	!blockAttributes['maxi-version-origin'];

const save = props => {
	const {
		uniqueID,
		'number-counter-stroke': stroke,
		'number-counter-circle-status': circleStatus,
		'number-counter-rounded-status': roundedStatus,
	} = props.attributes;

	const radius = 90;
	const strokeWidth = stroke || 0;
	const centerPoint = radius + strokeWidth / 2;
	const viewBoxSize = radius * 2 + strokeWidth;
	const circleProps = {
		strokeWidth,
		fill: 'none',
		cx: centerPoint,
		cy: centerPoint,
		r: radius,
	};

	return (
		<MaxiBlock.save
			className={BLOCK_CLASS}
			id={uniqueID}
			{...getMaxiBlockAttributes(props)}
		>
			<div className={BOX_CLASS}>
				{!circleStatus && (
					<svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
						<circle
							className={BACKGROUND_CLASS}
							{...circleProps}
						/>
						<circle
							className={CIRCLE_CLASS}
							{...circleProps}
							strokeLinecap={roundedStatus ? 'round' : undefined}
							strokeDasharray={`0 ${2 * Math.PI * radius}`}
						/>
						<text
							className={TEXT_CLASS}
							textAnchor='middle'
							x='50%'
							y='50%'
						/>
					</svg>
				)}
				{circleStatus && (
					<span className={TEXT_CLASS} />
				)}
			</div>
		</MaxiBlock.save>
	);
};

export default { name: NAME, isEligible, save };
