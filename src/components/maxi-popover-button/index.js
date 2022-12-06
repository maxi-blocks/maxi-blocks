/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { forwardRef, useRef } from '@wordpress/element';
import { getScrollContainer } from '@wordpress/dom';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNaN } from 'lodash';

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
		className,
		props.isSmall && 'maxi-popover-button--small-block'
	);

	const boundaryElement =
		document.defaultView.frameElement ||
		getScrollContainer(ref.current) ||
		document.body;

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
