/**
 * Internal dependencies
 */
import { getTransitionTimingFunction } from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Component
 */
const HoverPreview = props => {
	const {
		children,
		wrapperClassName,
		hoverClassName,
		'hover-type': hoverType,
		'hover-transition-duration': hoverTransitionDuration,
		'hover-transition-easing': hoverTransitionEasing,
		'hover-transition-easing-cubic-bezier': hoverTransitionEasingCB,
		isSave = false,
	} = props;

	const showEffects = props['hover-preview'] || isSave;

	const classes = classnames(
		'maxi-hover-preview',
		wrapperClassName,
		showEffects && hoverType !== 'none' && hoverClassName
	);

	return (
		<div className={classes}>
			{children}
			{hoverType !== 'none' && hoverType !== 'basic' && showEffects && (
				<div
					style={{
						transitionDuration: `${hoverTransitionDuration}s`,
						transitionTimingFunction: getTransitionTimingFunction(
							hoverTransitionEasing,
							hoverTransitionEasingCB
						),
					}}
					className='maxi-hover-details'
				>
					<div
						className={`maxi-hover-details__content maxi-hover-details__content--${props['hover-text-preset']}`}
					>
						{!isEmpty(props['hover-title-typography-content']) && (
							<h4>{props['hover-title-typography-content']}</h4>
						)}
						{!isEmpty(
							props['hover-content-typography-content']
						) && <p>{props['hover-content-typography-content']}</p>}
					</div>
				</div>
			)}
		</div>
	);
};

export default HoverPreview;
