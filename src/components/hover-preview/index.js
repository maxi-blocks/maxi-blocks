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
import { getAttributesValue } from '../../extensions/styles';

/**
 * Component
 */
const HoverPreview = props => {
	const { wrapperClassName, hoverClassName, isSave = false } = props;
	const {
		hoverType,
		hoverBasicEffectType,
		hoverTransitionDuration,
		hoverTransitionEasing,
		hoverTransitionEasingCB,
		hoverPreview,
		hoverBasicZoomInValue,
		hoverBasicRotateValue,
		HoverBasicSlideValue,
		hoverBasicBlurValue,
		hoverBasicZoomOutValue,
		hoverTextPreset,
		hoverTitleTypographyContent,
		hoverContentTypographyContent,
	} = getAttributesValue({
		target: [
			'hover-type',
			'hover-basic-effect-type',
			'hover-transition-duration',
			'hover-transition-easing',
			'hover-transition-easing-cb',
			'hover-preview',
			'hover-basic-zoom-in-value',
			'hover-basic-rotate-value',
			'hover-basic-slide-value',
			'hover-basic-blur-value',
			'hover-basic-zoom-out-value',
			'hover-text-preset',
			'hover-title-typography-content',
			'hover-content-typography-content',
		],
		props,
	});

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

	const showEffects = hoverPreview || isSave;

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
				targetWrapper.style.transform = `scale(${hoverBasicZoomInValue})`;
			else if (hoverBasicEffectType === 'rotate')
				targetWrapper.style.transform = `rotate(${hoverBasicRotateValue}deg)`;
			else if (hoverBasicEffectType === 'zoom-out')
				targetWrapper.style.transform = 'scale(1)';
			else if (hoverBasicEffectType === 'slide')
				targetWrapper.style.transform = `translateX(${HoverBasicSlideValue}%)`;
			else if (hoverBasicEffectType === 'blur')
				targetWrapper.style.filter = `blur(${hoverBasicBlurValue}px)`;
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
				targetWrapper.style.transform = `scale(${hoverBasicZoomOutValue})`;
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
						className={`maxi-hover-details__content maxi-hover-details__content--${hoverTextPreset}`}
					>
						{!isEmpty(hoverTitleTypographyContent) && (
							<h4>{hoverTitleTypographyContent}</h4>
						)}
						{!isEmpty(hoverContentTypographyContent) && (
							<p>{hoverContentTypographyContent}</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default HoverPreview;
