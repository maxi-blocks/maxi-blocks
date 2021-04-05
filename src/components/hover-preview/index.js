/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Component
 */
const HoverPreview = props => {
	const { className } = props;

	const classes = classnames('maxi-hover-preview', className);

	return (
		<div className={classes}>
			<img
				style={
					props['hover-type'] === 'text' ||
					props['hover-basic-effect-type'] === 'zoom-in' ||
					props['hover-basic-effect-type'] === 'zoom-out' ||
					props['hover-basic-effect-type'] === 'slide'
						? {
								'transition-duration': `${props['hover-transition-duration']}s`,
						  }
						: null
				}
				onMouseOver={e => {
					if (props['hover-type'] === 'basic') {
						if (props['hover-basic-effect-type'] === 'zoom-in')
							e.target.style.transform = `scale(${props['hover-basic-zoom-in-value']})`;
						if (props['hover-basic-effect-type'] === 'rotate')
							e.target.style.transform = `rotate(${props['hover-basic-rotate-value']}deg)`;
						if (props['hover-basic-effect-type'] === 'zoom-out')
							e.target.style.transform = 'scale(1)';
						if (props['hover-basic-effect-type'] === 'slide')
							e.target.style.marginLeft = `${props['hover-basic-slide-value']}px`;
						if (props['hover-basic-effect-type'] === 'blur')
							e.target.style.filter = `blur(${props['hover-basic-blur-value']}px)`;
					}
				}}
				onMouseOut={e => {
					if (props['hover-type'] === 'basic') {
						if (props['hover-basic-effect-type'] === 'zoom-in')
							e.target.style.transform = 'scale(1)';
						if (props['hover-basic-effect-type'] === 'rotate')
							e.target.style.transform = 'rotate(0)';
						if (props['hover-basic-effect-type'] === 'zoom-out')
							e.target.style.transform = `scale(${props['hover-basic-zoom-out-value']})`;
						if (props['hover-basic-effect-type'] === 'slide')
							e.target.style.marginLeft = 0;
						if (props['hover-basic-effect-type'] === 'blur')
							e.target.style.filter = 'blur(0)';
					}
				}}
				className={`maxi-image-block__image wp-image-${props.mediaID}`}
				src={props.src}
				width={props.width}
				height={props.height}
				alt={props.alt}
			/>
			{props['hover-type'] !== 'none' &&
				props['hover-type'] !== 'basic' &&
				props['hover-preview'] && (
					<div
						style={
							props['hover-type'] === 'text'
								? {
										'transition-duration': `${props['hover-transition-duration']}s`,
								  }
								: null
						}
						className='maxi-hover-details'
					>
						<div
							className={`maxi-hover-details__content maxi-hover-details__content--${props['hover-text-preset']}`}
						>
							{!isEmpty(
								props['hover-title-typography-content']
							) && (
								<h3>
									{props['hover-title-typography-content']}
								</h3>
							)}
							{!isEmpty(
								props['hover-content-typography-content']
							) && (
								<p>
									{props['hover-content-typography-content']}
								</p>
							)}
						</div>
					</div>
				)}
		</div>
	);
};

export default HoverPreview;
