/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './style.scss';
import { replay } from '../../icons';

/**
 * Component
 */
const NumberCounter = props => {
	const { className } = props;

	const classes = classnames('maxi-number-counter', className);

	const countRef = useRef(null);

	const durationSteps = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45];
	const startCountValue = Math.ceil(
		(props['number-counter-start'] * 360) / 100
	);
	const endCountValue = Math.ceil((props['number-counter-end'] * 360) / 100);
	const countDuration = props['number-counter-duration'];
	const radius = props['number-counter-radius'];
	const stroke = props['number-counter-stroke'];
	const circleStatus = props['number-counter-circle-status'];

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
		<div className={classes}>
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
								props['number-counter-rounded-status']
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
						{props['number-counter-percentage-sign-status']
							? '%'
							: ''}
					</sup>
				</span>
			</div>
		</div>
	);
};

export default NumberCounter;
