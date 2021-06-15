/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

/**
 * Component
 */
const HoverPreview = props => {
	const {
		wrapperClassName,
		hoverClassName,
		target,
		'hover-type': hoverType,
		'hover-basic-effect-type': hoverBasicEffectType,
		'hover-transition-duration': hoverTransitionDuration,
		'hover-transition-easing': hoverTransitionEasing,
		'hover-transition-easing-cubic-bezier': hoverTransitionEasingCB,
	} = props;

	const transitionDurationEffects = [
		'zoom-in',
		'zoom-out',
		'slide',
		'rotate',
		'blur',
		'sepia',
		'clear-sepia',
		'grey-scale',
		'clear-greay-scale',
	];

	const classes = classnames(
		'maxi-hover-preview',
		wrapperClassName,
		hoverType !== 'none' && hoverClassName
	);

	const mouseHoverHandle = () => {
		if (
			hoverType === 'text' ||
			transitionDurationEffects.includes(hoverBasicEffectType)
		) {
			target.style.transitionDuration = `${hoverTransitionDuration}s`;
			target.style.transitionTimingFunction = `
	${
		hoverTransitionEasing !== 'cubic-bezier'
			? hoverTransitionEasing
			: !isNil(hoverTransitionEasingCB)
			? `cubic-bezier(${hoverTransitionEasingCB.join()})`
			: 'easing'
	}
	`;
		}

		if (hoverType === 'basic') {
			if (hoverBasicEffectType === 'zoom-in')
				target.style.transform = `scale(${props['hover-basic-zoom-in-value']})`;
			else if (hoverBasicEffectType === 'rotate')
				target.style.transform = `rotate(${props['hover-basic-rotate-value']}deg)`;
			else if (hoverBasicEffectType === 'zoom-out')
				target.style.transform = 'scale(1)';
			else if (hoverBasicEffectType === 'slide')
				target.style.marginLeft = `${props['hover-basic-slide-value']}px`;
			else if (hoverBasicEffectType === 'blur')
				target.style.filter = `blur(${props['hover-basic-blur-value']}px)`;
			else {
				target.style.transform = '';
				target.style.marginLeft = '';
				target.style.filter = '';
			}
		}
	};

	const mouseOutHandle = () => {
		if (hoverType === 'basic') {
			if (hoverBasicEffectType === 'zoom-in')
				target.style.transform = 'scale(1)';
			else if (hoverBasicEffectType === 'rotate')
				target.style.transform = 'rotate(0)';
			else if (hoverBasicEffectType === 'zoom-out')
				target.style.transform = `scale(${props['hover-basic-zoom-out-value']})`;
			else if (hoverBasicEffectType === 'slide')
				target.style.marginLeft = 0;
			else if (hoverBasicEffectType === 'blur')
				target.style.filter = 'blur(0)';
			else {
				target.style.transform = '';
				target.style.marginLeft = '';
				target.style.filter = '';
			}
		}
	};

	return (
		<>
			{hoverType === 'none' && (
				<div className={classes}>{props.children}</div>
			)}
			{hoverType !== 'none' && (
				<div
					className={classes}
					onMouseOver={target ? mouseHoverHandle : null}
					onMouseOut={target ? mouseOutHandle : null}
				>
					{props.children}
					{hoverType !== 'none' &&
						hoverType !== 'basic' &&
						props['hover-preview'] && (
							<div
								style={{
									transitionDuration: `${hoverTransitionDuration}s`,
									transitionTimingFunction:
										hoverTransitionEasing !== 'cubic-bezier'
											? hoverTransitionEasing
											: !isNil(
													props[
														'hover-transition-easing-cubic-bezier'
													]
											  )
											? `cubic-bezier(${props[
													'hover-transition-easing-cubic-bezier'
											  ].join()})`
											: 'easing',
								}}
								className='maxi-hover-details'
							>
								<div
									className={`maxi-hover-details__content maxi-hover-details__content--${props['hover-text-preset']}`}
								>
									{!isEmpty(
										props['hover-title-typography-content']
									) && (
										<h3>
											{
												props[
													'hover-title-typography-content'
												]
											}
										</h3>
									)}
									{!isEmpty(
										props[
											'hover-content-typography-content'
										]
									) && (
										<p>
											{
												props[
													'hover-content-typography-content'
												]
											}
										</p>
									)}
								</div>
							</div>
						)}
				</div>
			)}
		</>
	);
};

export default HoverPreview;
