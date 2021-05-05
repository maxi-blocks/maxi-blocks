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

	const StartCountValue = Math.ceil(
		(props['number-counter-start'] * 360) / 100
	);
	const endCountValue = Math.ceil((props['number-counter-end'] * 360) / 100);
	const radius = props['number-counter-radius'];
	const stroke = props['number-counter-stroke'];

	const [count, setCount] = useState(StartCountValue);

	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		if (count === endCountValue) return;

		countRef.current = setInterval(() => {
			setCount(count + 1);
		}, props['number-counter-duration']);

		return () => clearInterval(countRef.current);
	}, [count]);

	return (
		<div className={classes}>
			<Button
				className='maxi-number-counter__replay'
				onClick={() => {
					setCount(StartCountValue);
					clearInterval(countRef.current);
				}}
				icon={replay}
			/>
			<svg viewBox='0 0 180 180'>
				{!props['number-counter-circle-status'] && (
					<>
						<circle
							className='maxi-number-counter__background'
							stroke='#f2f9fd'
							strokeWidth={stroke}
							fill='none'
							cx='90'
							cy='90'
							r={radius}
						/>
						<circle
							className='maxi-number-counter__circle'
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
					</>
				)}

				<text
					className='maxi-number-counter__text'
					x='50%'
					y='50%'
					dominantBaseline='middle'
					textAnchor='middle'
				>
					{`${parseInt((count / 360) * 100)}${
						props['number-counter-percentage-sign-status']
							? '%'
							: ''
					}`}
				</text>
			</svg>
		</div>
	);
};

export default NumberCounter;
