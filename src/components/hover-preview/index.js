/**
 * WordPress dependencies
 */
import { cloneElement } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

/**
 * Component
 */
const HoverPreview = props => {
	const {
		wrapperClassName,
		hoverClassName,
		'hover-type': hoverType,
		'hover-basic-effect-type': hoverBasicEffectType,
		'hover-transition-duration': hoverTransitionDuration,
		'hover-transition-easing': hoverTransitionEasing,
		'hover-transition-easing-cubic-bezier': hoverTransitionEasingCB,
		isSave = false,
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
		'clear-grey-scale',
	];

	const showEffects = props['hover-preview'] || isSave;

	const classes = classnames(
		'maxi-hover-preview',
		wrapperClassName,
		showEffects && hoverType !== 'none' && hoverClassName
	);

	const transitionTimingFunction = `${
		hoverTransitionEasing !== 'cubic-bezier'
			? hoverTransitionEasing
			: !isNil(hoverTransitionEasingCB)
			? `cubic-bezier(${hoverTransitionEasingCB.join()})`
			: 'easing'
	}`;

	const mouseHoverHandle = ({ target }) => {
		const targetWrapper = target.closest('.maxi-hover-preview img');
		if (
			hoverType !== 'none' &&
			(hoverType === 'text' ||
				transitionDurationEffects.includes(hoverBasicEffectType)) &&
			showEffects
		) {
			targetWrapper.style.transform = '';
			targetWrapper.style.filter = '';
			targetWrapper.style.transitionDuration = `${hoverTransitionDuration}s`;
			targetWrapper.style.transitionTimingFunction =
				transitionTimingFunction;
		}

		if (hoverType === 'basic' && showEffects) {
			if (hoverBasicEffectType === 'zoom-in')
				targetWrapper.style.transform = `scale(${props['hover-basic-zoom-in-value']})`;
			else if (hoverBasicEffectType === 'rotate')
				targetWrapper.style.transform = `rotate(${props['hover-basic-rotate-value']}deg)`;
			else if (hoverBasicEffectType === 'zoom-out')
				targetWrapper.style.transform = 'scale(1)';
			else if (hoverBasicEffectType === 'slide')
				targetWrapper.style.transform = `translateX(${props['hover-basic-slide-value']}%)`;
			else if (hoverBasicEffectType === 'blur')
				targetWrapper.style.filter = `blur(${props['hover-basic-blur-value']}px)`;
			else {
				targetWrapper.style.transform = '';
				targetWrapper.style.filter = '';
			}
		}
	};

	const mouseOutHandle = ({ target }) => {
		const targetWrapper = target.closest('.maxi-hover-preview img');
		if (hoverType === 'basic') {
			if (hoverBasicEffectType === 'zoom-in')
				targetWrapper.style.transform = 'scale(1)';
			else if (hoverBasicEffectType === 'rotate')
				targetWrapper.style.transform = 'rotate(0)';
			else if (hoverBasicEffectType === 'zoom-out')
				targetWrapper.style.transform = `scale(${props['hover-basic-zoom-out-value']})`;
			else if (hoverBasicEffectType === 'slide')
				targetWrapper.style.transform = 'translateX(0%)';
			else if (hoverBasicEffectType === 'blur')
				targetWrapper.style.filter = 'blur(0)';
			else {
				targetWrapper.style.transform = '';
				targetWrapper.style.filter = '';
			}
		}
	};

	const getEnhancedChildren = children => {
		if (children.type === 'img') {
			return cloneElement(children, {
				onMouseOver: mouseHoverHandle,
				onMouseOut: mouseOutHandle,
			});
		}
		if (children?.props?.children) {
			const cleanedChildren = DOMPurify.sanitize(children.props.children);
			const parsedContent = parse(cleanedChildren, {
				replace: domNode => {
					hoverType === 'text'
						? (domNode.attribs = {
								...domNode.attribs,
								onMouseOver: mouseHoverHandle,
								onMouseOut: mouseOutHandle,
						  })
						: (domNode.attribs = {
								...domNode.attribs,
						  });

					return domNode;
				},
			});

			return parsedContent;
		}

		return children;
	};

	const enhancedChildren = getEnhancedChildren(props.children);

	return (
		<div className={classes}>
			{enhancedChildren}
			{hoverType !== 'none' && hoverType !== 'basic' && showEffects && (
				<div
					style={{
						transitionDuration: `${hoverTransitionDuration}s`,
						transitionTimingFunction,
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
