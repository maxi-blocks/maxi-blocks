/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { forwardRef, useRef, useState, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEqual } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const MaxiPopoverButton = forwardRef((props, ref) => {
	const { isSelected, attributes, isOpen = false, className } = props;
	const { uniqueID } = attributes;

	const popoverRef = useRef(null);

	const [anchor, setAnchor] = useState(null);

	const getAnchor = () => {
		// Return default anchor rect if no ref is available.
		if (!ref.current)
			return {
				getBoundingClientRect: () => DOMRect.fromRect(),
				ownerDocument: document,
			};

		const { x, y, width, height } = ref.current.getBoundingClientRect();

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

		return {
			getBoundingClientRect: () => newRect,
			ownerDocument: ref.current.ownerDocument,
		};
	};

	useEffect(() => {
		if (popoverRef.current) {
			const newAnchor = getAnchor(popoverRef.current);

			if (
				!anchor ||
				(anchor &&
					!isEqual(
						JSON.stringify(anchor.getBoundingClientRect()),
						JSON.stringify(newAnchor.getBoundingClientRect())
					))
			)
				setAnchor(newAnchor);
		}
	});

	if (!isSelected || !ref.current) return null;

	const classes = classnames(
		'maxi-popover-button',
		isOpen && 'maxi-popover-button--open',
		className
	);

	return (
		<Popover
			ref={popoverRef}
			className={classes}
			noArrow
			animate={false}
			focusOnMount={false}
			__unstableSlotName='block-toolbar'
			// anchor={anchor}
			anchor={ref.current}
			// position='top right'
			placement='top-end'
			uniqueid={uniqueID}
		>
			{props.children}
		</Popover>
	);
});

export default MaxiPopoverButton;
