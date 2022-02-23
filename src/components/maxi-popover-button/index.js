/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { forwardRef, useRef } from '@wordpress/element';

const MaxiPopoverButton = forwardRef((props, ref) => {
	const { isSelected, attributes } = props;
	const { uniqueID } = attributes;

	const popoverRef = useRef(null);

	return (
		<>
			{isSelected && ref.current && (
				<Popover
					ref={popoverRef}
					noArrow
					animate={false}
					focusOnMount={false}
					getAnchorRect={() => {
						const { x, y, width, height } =
							ref.current.getBoundingClientRect();

						const { width: popoverWidth, height: popoverHeight } =
							popoverRef.current
								.querySelector(
									'.maxi-image-block__settings__upload-button'
								)
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
			)}
		</>
	);
});

export default MaxiPopoverButton;
