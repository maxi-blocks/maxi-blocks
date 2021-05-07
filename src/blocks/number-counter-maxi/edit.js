/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import { replay } from '../../icons';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus = !isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'entrance',
						'numberCounter',
					]),
				}),
			},
		};
	}

	render() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const classes = 'maxi-number-counter-block';

		const NumberCounter = attributes => {
			const countRef = useRef(null);

			const durationSteps = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45];
			const startCountValue = Math.ceil(
				(attributes['number-counter-start'] * 360) / 100
			);
			const endCountValue = Math.ceil(
				(attributes['number-counter-end'] * 360) / 100
			);
			const countDuration = attributes['number-counter-duration'];
			const radius = attributes['number-counter-radius'];
			const stroke = attributes['number-counter-stroke'];
			const circleStatus = attributes['number-counter-circle-status'];

			const [count, setCount] = useState(startCountValue);

			const circumference = 2 * Math.PI * radius;

			useEffect(() => {
				if (count >= endCountValue) {
					setCount(endCountValue);
					return;
				}

				countRef.current = setInterval(() => {
					setCount(count + durationSteps[countDuration - 1]);
				}, countDuration);

				return () => clearInterval(countRef.current);
			}, [count]);

			return (
				<div className='maxi-number-counter'>
					<Button
						className='maxi-number-counter__replay'
						onClick={() => {
							setCount(startCountValue);
							clearInterval(countRef.current);
						}}
						icon={replay}
					/>
					<div className='maxi-number-counter__box'>
						{!circleStatus && (
							<svg viewBox='0 0 180 180'>
								<circle
									className='maxi-number-counter__box__background'
									strokeWidth={stroke}
									fill='none'
									cx='90'
									cy='90'
									r={radius}
								/>
								<circle
									className='maxi-number-counter__box__circle'
									strokeWidth={stroke}
									fill='none'
									cx='90'
									cy='90'
									r={radius}
									strokeLinecap={
										attributes[
											'number-counter-rounded-status'
										]
											? 'round'
											: ''
									}
									strokeDasharray={`${parseInt(
										(count / 360) * circumference
									)} ${circumference}`}
								/>
							</svg>
						)}
						<span className='maxi-number-counter__box__text'>
							{`${parseInt((count / 360) * 100)}`}
							<sup>
								{attributes[
									'number-counter-percentage-sign-status'
								]
									? '%'
									: ''}
							</sup>
						</span>
					</div>
				</div>
			);
		};

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<MaxiBlock
				key={`maxi-number-counter--${uniqueID}`}
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<NumberCounter
					{...getGroupAttributes(attributes, 'numberCounter')}
				/>
			</MaxiBlock>,
		];
	}
}

const editSelect = withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
});

export default compose(editSelect)(edit);
