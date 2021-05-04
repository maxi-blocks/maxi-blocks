/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const NumberCounter = props => {
	const { className, radius = 85, stroke = 8 } = props;

	const classes = classnames('maxi-number-counter', className);

	const [count, setCount] = useState(0);

	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		if (count === 360) return;

		const interval = setInterval(() => {
			setCount(count + 1);
		}, 10);
		return () => clearInterval(interval);
	}, [count]);

	return (
		<div className={classes}>
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
					{parseInt((count / 360) * 100) + '%'}
				</text>
			</svg>
		</div>
	);
};

export default NumberCounter;
