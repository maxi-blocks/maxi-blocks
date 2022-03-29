/**
 * WordPress dependencies
 */
import { useRef, useEffect, useState, forwardRef } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

function useObservableState(initialState, onStateChange) {
	const [state, setState] = useState(initialState);
	return [
		state,
		value => {
			setState(value);
			if (onStateChange) {
				onStateChange(value);
			}
		},
	];
}

const Dropdown = forwardRef(
	(
		{
			renderContent,
			renderToggle,
			position = 'bottom right',
			className,
			contentClassName,
			expandOnMobile,
			headerTitle,
			focusOnMount,
			popoverProps,
			onClose,
			onToggle,
		},
		ref
	) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const containerRef = ref ?? useRef();

		const [isOpen, setIsOpen] = useObservableState(false, onToggle);

		useEffect(
			() => () => {
				if (onToggle) {
					onToggle(false);
				}
			},
			[]
		);

		function toggle() {
			setIsOpen(!isOpen);
		}

		/**
		 * Closes the dropdown if a focus leaves the dropdown wrapper. This is
		 * intentionally distinct from `onClose` since focus loss from the popover
		 * is expected to occur when using the Dropdown's toggle button, in which
		 * case the correct behavior is to keep the dropdown closed. The same applies
		 * in case when focus is moved to the modal dialog.
		 */
		function closeIfFocusOutside() {
			const { ownerDocument } = containerRef.current;
			if (
				!containerRef.current.contains(ownerDocument.activeElement) &&
				!ownerDocument.activeElement.closest('[role="dialog"]')
			) {
				close();
			}
		}

		function close() {
			if (onClose) {
				onClose();
			}
			setIsOpen(false);
		}

		const args = { isOpen, onToggle: toggle, onClose: close };

		return (
			<div
				className={classnames('maxi-dropdown', className)}
				ref={containerRef}
			>
				{renderToggle(args)}
				{isOpen && (
					<Popover
						position={position}
						onClose={close}
						onFocusOutside={closeIfFocusOutside}
						expandOnMobile={expandOnMobile}
						headerTitle={headerTitle}
						focusOnMount={focusOnMount}
						{...popoverProps}
						anchorRef={
							popoverProps?.anchorRef ?? containerRef.current
						}
						className={classnames(
							'maxi-dropdown__content',
							popoverProps ? popoverProps.className : undefined,
							contentClassName
						)}
					>
						{renderContent(args)}
					</Popover>
				)}
			</div>
		);
	}
);

export default Dropdown;
