/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { forwardRef, useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Popover from '../popover';

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
		className,
		props.isSmall && 'maxi-popover-button--small-block'
	);

	const popoverPropsByVersion = {
		anchorRef: ref.current,
		placement: 'top-end',
		variant: 'unstyled',
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
