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
import { toolbarReplaceImage } from '../../icons';

/**
 * Component
 */
const NumberCounter = props => {
	const { className, radius = 85, stroke = 8 } = props;

	const classes = classnames('maxi-number-counter', className);

	const countRef = useRef(null);

	const StartCountValue = Math.ceil(
		(props['number-counter-start'] * 360) / 100
	);
	const endCountValue = Math.ceil((props['number-counter-end'] * 360) / 100);

	const [count, setCount] = useState(StartCountValue);

	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		if (count === endCountValue) return;

		countRef.current = setInterval(() => {
			setCount(count + 1);
		}, 10);

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
				icon={toolbarReplaceImage}
			/>
			<svg viewBox='0 0 180 180' width='180' height='180'>
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
					stroke='#ff4a17'
					strokeWidth={stroke}
					fill='none'
					cx='90'
					cy='90'
					r={radius}
					strokeLinecap={
						props['number-counter-rounded-status'] ? 'round' : ''
					}
					strokeDasharray={`${parseInt(
						(count / 360) * circumference
					)} ${circumference}`}
				/>
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
