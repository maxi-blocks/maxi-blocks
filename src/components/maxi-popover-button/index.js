/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { forwardRef, useRef } from '@wordpress/element';
import { getScrollContainer } from '@wordpress/dom';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

const MaxiPopoverButton = forwardRef((props, ref) => {
	const { isSelected, attributes, isOpen = false, className } = props;
	const { uniqueID } = attributes;

	const popoverRef = useRef(null);

	if (!isSelected || !ref.current) return null;

	const classes = classnames(
		'maxi-popover-button',
		isOpen && 'maxi-popover-button--open',
		className
	);

	const boundaryElement =
		document.defaultView.frameElement ||
		getScrollContainer(ref.current) ||
		document.body;

	return (
		<Popover
			ref={popoverRef}
			className={classes}
			noArrow
			animate={false}
			focusOnMount={false}
			__unstableSlotName='block-toolbar'
			shouldAnchorIncludePadding
			__unstableStickyBoundaryElement={boundaryElement}
			getAnchorRect={() => {
				const { x, y, width, height } =
					ref.current.getBoundingClientRect();

				const { width: popoverWidth, height: popoverHeight } =
					popoverRef.current
						.querySelector('.components-popover__content')
						.getBoundingClientRect();

				const newRect = DOMRect.fromRect({
					x: x + width / 2 - popoverWidth / 2,
					y: y + popoverHeight,
					width,
					height,
				});

				return newRect;
			}}
			position='top right'
			uniqueid={uniqueID}
		>
			{props.children}
		</Popover>
	);
});

export default MaxiPopoverButton;
