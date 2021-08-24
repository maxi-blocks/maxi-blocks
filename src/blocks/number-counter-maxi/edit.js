/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar, Button } from '../../components';
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
 * NumberCounter
 */

const NumberCounter = attributes => {
	const countRef = useRef(null);

	const startCountValue = Math.ceil(
		(attributes['number-counter-start'] * 360) / 100
	);
	const endCountValue = Math.ceil(
		(attributes['number-counter-end'] * 360) / 100
	);
	const countDuration = attributes['number-counter-duration'];
	const radius = 90;
	const stroke = attributes['number-counter-stroke'];
	const circleStatus = attributes['number-counter-circle-status'];
	const preview = attributes['number-counter-preview'];

	const [count, setCount] = useState(startCountValue);
	const [replyStatus, setReplyStatus] = useState(false);

	const circumference = 2 * Math.PI * radius;

	const frameDuration = countDuration / 60;

	useEffect(() => {
		if ((startCountValue < endCountValue && preview) || replyStatus) {
			if (count >= endCountValue) {
				setCount(endCountValue);
				return;
			}

			countRef.current = setInterval(() => {
				setCount(count + 1);
			}, frameDuration);

			return () => clearInterval(countRef.current);
		}
	}, [count, replyStatus, preview, endCountValue]);

	useEffect(() => {
		if ((startCountValue < endCountValue && preview) || replyStatus) {
			if (count >= endCountValue) {
				setCount(startCountValue);
				setReplyStatus(false);
				clearInterval(countRef.current);
			}
		}
	}, [
		startCountValue,
		replyStatus,
		endCountValue,
		countDuration,
		radius,
		stroke,
	]);

	return (
		<div className='maxi-number-counter'>
			<Button
				className='maxi-number-counter__replay'
				onClick={() => {
					setCount(startCountValue);
					setReplyStatus(true);
					clearInterval(countRef.current);
				}}
				icon={replay}
			/>
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
							strokeLinecap={
								attributes['number-counter-rounded-status']
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

					{attributes['number-counter-percentage-sign-status'] && (
						<sup>
							{attributes['number-counter-percentage-sign-status']
								? '%'
								: ''}
						</sup>
					)}
				</span>
			</div>
		</div>
	);
};

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

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-number-counter--${uniqueID}`}
				ref={this.blockRef}
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
