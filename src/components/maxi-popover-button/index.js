/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { Popover } from '@wordpress/components';
import { forwardRef, useRef } from '@wordpress/element';
import { getScrollContainer } from '@wordpress/dom';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNaN } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const MaxiPopoverButton = forwardRef((props, ref) => {
	const { isSelected, attributes, isOpen = false, className } = props;
	const { uniqueID } = attributes;

	const popoverRef = useRef(null);

	const { receiveMaxiSettings } = select('maxiBlocks');
	const maxiSettings = receiveMaxiSettings();
	const version = !isEmpty(maxiSettings.editor)
		? maxiSettings.editor.version
		: null;

	if (!isSelected || !ref.current) return null;

	const classes = classnames(
		'maxi-popover-button',
		isOpen && 'maxi-popover-button--open',
		version <= 13.0 && 'maxi-popover-button--old',
		className
	);

	const boundaryElement =
		document.defaultView.frameElement ||
		getScrollContainer(ref.current) ||
		document.body;

	const popoverPropsByVersion = {
		...((parseFloat(version) <= 13.0 && {
			shouldAnchorIncludePadding: true,
			__unstableStickyBoundaryElement: boundaryElement,
			getAnchorRect: () => {
				// Return default anchor rect if no ref is available.
				if (!ref.current) return DOMRect.fromRect();

				const { x, y, width, height } =
					ref.current.getBoundingClientRect();

				const { width: popoverWidth, height: popoverHeight } =
					popoverRef.current
						.querySelector('.components-popover__content')
						.getBoundingClientRect();

				const videoWidth =
					props.refWidth.current.children[0].getBoundingClientRect()
						.width;

				const totalWidthWithVideo =
					x + videoWidth / 2 - popoverWidth / 2;
				const totalWidthWithoutVideo = x + width / 2 - popoverWidth / 2;

				const newRect = DOMRect.fromRect({
					x:
						props.name === 'maxi-blocks/video-maxi'
							? props.attributes['overlay-mediaID']
								? totalWidthWithVideo
								: props.attributes[
										'video-width-fit-content-general'
								  ] === true
								? totalWidthWithVideo
								: !props.attributes['video-width-general'] &&
								  !props.attributes['video-max-width-general']
								? totalWidthWithoutVideo
								: props.attributes['video-max-width-general']
								? totalWidthWithVideo
								: videoWidth > width
								? totalWidthWithoutVideo
								: totalWidthWithVideo
							: totalWidthWithoutVideo,
					y: y + popoverHeight,
					width,
					height,
				});

				return newRect;
			},
			position: 'top right',
		}) ||
			(!isNaN(parseFloat(version)) && {
				anchor: ref.current,
				placement: 'top-end',
				flip: false,
				resize: false,
				variant: 'unstyled',
			})),
	};

	return (
		<Popover
			ref={popoverRef}
			className={classes}
			noArrow
			animate={false}
			focusOnMount={false}
			__unstableSlotName='block-toolbar'
			uniqueid={uniqueID}
			{...popoverPropsByVersion}
		>
			{props.children}
		</Popover>
	);
});

export default MaxiPopoverButton;
