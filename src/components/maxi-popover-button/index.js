/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { forwardRef, memo, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { getScrollContainer } from '@wordpress/dom';

/**
 * External dependencies
 */
import { isEmpty, isNaN } from 'lodash';

const MaxiPopoverButton = memo(
	forwardRef((props, ref) => {
		const { isSelected, attributes } = props;
		const { uniqueID } = attributes;
		const [anchorRef, setAnchorRef] = useState(ref.current);

		useEffect(() => {
			setAnchorRef(ref.current);
		});

		const { editorVersion } = useSelect(select => {
			const { receiveMaxiSettings, receiveMaxiDeviceType } =
				select('maxiBlocks');
			const { receiveMaxiSelectedStyleCard } = select(
				'maxiBlocks/style-cards'
			);

			const maxiSettings = receiveMaxiSettings();
			const version = !isEmpty(maxiSettings.editor)
				? maxiSettings.editor.version
				: null;

			const breakpoint = receiveMaxiDeviceType();

			const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

			return {
				editorVersion: version,
				breakpoint,
				styleCard,
			};
		});
		const boundaryElement =
			document.defaultView.frameElement ||
			getScrollContainer(anchorRef) ||
			document.body;

		const stickyProps = {
			...((parseFloat(editorVersion) <= 9.2 && {
				__unstableSticky: true,
			}) ||
				(anchorRef &&
					!isNaN(parseFloat(editorVersion)) && {
						__unstableStickyBoundaryElement: boundaryElement,
					})),
		};

		return (
			<>
				{isSelected && anchorRef && (
					<Popover
						noArrow
						animate={false}
						focusOnMount={false}
						anchorRef={anchorRef}
						position='top right'
						uniqueid={uniqueID}
						{...stickyProps}
					>
						{props.children}
					</Popover>
				)}
			</>
		);
	})
);

export default MaxiPopoverButton;
