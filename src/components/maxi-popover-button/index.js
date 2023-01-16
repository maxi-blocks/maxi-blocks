/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { Popover } from '@wordpress/components';
import { forwardRef, useRef } from '@wordpress/element';
import { getScrollContainer } from '@wordpress/dom';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isEqual, isNaN, toNumber } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const MaxiPopoverButton = forwardRef((props, ref) => {
	const {
		isSelected,
		attributes,
		deviceType,
		isOpen = false,
		isEmptyContent = false,
		prefix = '',
		className,
	} = props;
	const { uniqueID } = attributes;

	const popoverRef = useRef(null);
	const previousWidthAttribute = useRef();

	previousWidthAttribute.current = toNumber(
		getLastBreakpointAttribute({
			target: 'width',
			breakpoint: deviceType,
			attributes,
		})
	);

	const { version } = useSelect(select => {
		const { receiveMaxiSettings } = select('maxiBlocks');
		const maxiSettings = receiveMaxiSettings();
		return {
			version: !isEmpty(maxiSettings.editor)
				? maxiSettings.editor.version
				: null,
		};
	}, []);

	const shouldDisplayComponent = () => !(!isSelected || !ref.current);

	if (!shouldDisplayComponent()) return null;

	const shouldHideComponent = () => {
		if (isEmptyContent) return false;

		if (
			getLastBreakpointAttribute({
				target: 'width-fit-content',
				breakpoint: deviceType,
				attributes,
			})
		)
			return true;

		const getContainerWidth = () => {
			const blockRefWidth = ref.current.getBoundingClientRect().width;
			const widthAttribute = toNumber(
				getLastBreakpointAttribute({
					target: 'width',
					breakpoint: deviceType,
					attributes,
				})
			);

			const result = isEqual(
				previousWidthAttribute.current,
				widthAttribute
			)
				? blockRefWidth
				: widthAttribute;

			return result;
		};
		const containerWidth = getContainerWidth();

		if (isNaN(containerWidth)) return false;

		const resizerWidth =
			prefix === 'image-'
				? (attributes.imgWidth / 100) * containerWidth
				: toNumber(
						getLastBreakpointAttribute({
							target: `${prefix}width`,
							breakpoint: deviceType,
							attributes,
						})
				  );

		return (containerWidth - resizerWidth) / 2 < 50;
	};

	const classes = classnames(
		'maxi-popover-button',
		isOpen && 'maxi-popover-button--open',
		version <= 13.0 && 'maxi-popover-button--old',
		shouldHideComponent() && 'maxi-popover-button--hidden',
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

				const newRect = DOMRect.fromRect({
					x: x + width / 2 - popoverWidth / 2,
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
