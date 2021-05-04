/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { NumberCounter } from '../../components';

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
			<div className='maxi-number-counter-block__counter'>
				<svg>
					<circle
						cx='100'
						cy='100'
						r='57'
						id='green-halo'
						fill='none'
						stroke='#00CC33'
						stroke-width='15'
						stroke-dasharray='360 2000'
						transform='rotate(-90,100,100)'
					/>
					<text id='myTimer' text-anchor='middle' x='100' y='110'>
						0%
					</text>
				</svg>
			</div>
		</MaxiBlock>
	);
};

export default save;
