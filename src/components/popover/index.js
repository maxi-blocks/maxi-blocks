// Abstracted from https://github.com/WordPress/gutenberg/blob/release/13.9/packages/components/src/popover/index.js

/**
 * WordPress dependencies
 */
import {
	useRef,
	useLayoutEffect,
	forwardRef,
	createContext,
	useContext,
	useMemo,
} from '@wordpress/element';
import {
	useViewportMatch,
	useMergeRefs,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseDialog as useDialog,
} from '@wordpress/compose';
import { close } from '@wordpress/icons';
import { Path, SVG } from '@wordpress/primitives';
import { useSelect } from '@wordpress/data';
import { Button, ScrollLock, Slot, Fill } from '@wordpress/components';

/**
 * Internal dependencies
 */
import getAnimateClassName from './animate';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	useFloating,
	shift,
	autoUpdate,
	arrow,
	offset as offsetMiddleware,
	limitShift,
	size,
	flip,
} from '@floating-ui/react-dom';

/**
 * Styles
 */
import './editor.scss';

/**
 * Name of slot in which popover should fill.
 *
 * @type {string}
 */
const SLOT_NAME = 'Popover';

// An SVG displaying a triangle facing down, filled with a solid
// color and bordered in such a way to create an arrow-like effect.
// Keeping the SVG's viewbox squared simplify the arrow positioning
// calculations.
const ArrowTriangle = props => (
	<SVG
		{...props}
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 100 100'
		className='maxi-components-popover__triangle components-popover__triangle'
		role='presentation'
	>
		<Path
			className='maxi-components-popover__triangle-bg components-popover__triangle-bg'
			d='M 0 0 L 50 50 L 100 0'
		/>
		<Path
			className='maxi-components-popover__triangle-border components-popover__triangle-border'
			d='M 0 0 L 50 50 L 100 0'
			vectorEffect='non-scaling-stroke'
		/>
	</SVG>
);

const slotNameContext = createContext();

const positionToPlacement = position => {
	const [x, y, z] = position.split(' ');

	if (['top', 'bottom'].includes(x)) {
		let suffix = '';
		if ((!!z && z === 'left') || y === 'right') {
			suffix = '-start';
		} else if ((!!z && z === 'right') || y === 'left') {
			suffix = '-end';
		}
		return x + suffix;
	}

	return y;
};

const placementToAnimationOrigin = placement => {
	const [a, b] = placement.split('-');

	let x;
	let y;
	if (a === 'top' || a === 'bottom') {
		x = a === 'top' ? 'bottom' : 'top';
		y = 'middle';
		if (b === 'start') {
			y = 'left';
		} else if (b === 'end') {
			y = 'right';
		}
	}

	if (a === 'left' || a === 'right') {
		x = 'center';
		y = a === 'left' ? 'right' : 'left';
		if (b === 'start') {
			x = 'top';
		} else if (b === 'end') {
			x = 'bottom';
		}
	}

	return `${x} ${y}`;
};

const Popover = (
	{
		animate = true,
		anchor,
		children,
		className,
		expandOnMobile,
		focusOnMount = 'firstElement',
		headerTitle,
		isAlternate,
		noArrow = true,
		onClose,
		onFocusOutside,
		position,
		placement: placementProp = 'bottom-start',
		strategy = 'absolute',
		// Observes when block position in block order changes.
		observeBlockPosition,
		useAnimationFrame = false,
		offset,
		// Shift element when it is out of screen
		useShift = false,
		shiftPadding,
		shiftLimit,
		useFlip = false,
		resize = false,
		__unstableObserveElement,
		__unstableSlotName = SLOT_NAME,
		key = '',
		...contentProps
	},
	forwardedRef
) => {
	const arrowRef = useRef(null);
	const anchorRefFallback = useRef(null);

	const isMobileViewport = useViewportMatch('medium', '<');
	const isExpanded = expandOnMobile && isMobileViewport;
	const hasArrow = !isExpanded && !noArrow;
	const normalizedPlacementFromProps = position
		? positionToPlacement(position)
		: placementProp;

	const { blockIndex } = useSelect(
		select => {
			const blockIndex =
				observeBlockPosition &&
				select('core/block-editor').getBlockIndex(observeBlockPosition);

			return { blockIndex };
		},
		[observeBlockPosition]
	);

	// MVP to fix toolbar on FSE
	const siteEditor = document.querySelector('#site-editor');
	const ownerDocument =
		siteEditor?.ownerDocument ?? anchor?.ownerDocument ?? document;

	/**
	 * Offsets the position of the popover when the anchor is inside an iframe.
	 */
	const frameOffset = useMemo(() => {
		const { defaultView } = ownerDocument;
		if (!defaultView) {
			return null; // Explicitly return null for clarity
		}

		const { frameElement } = defaultView;

		if (frameElement && ownerDocument !== document) {
			return { x: 0, y: 0 }; // Consistently returning an object
		}
		return null; // Consistently return null when conditions aren't met
	}, [ownerDocument]);

	const middleware = [
		frameOffset || offset
			? offsetMiddleware(({ placement: currentPlacement }) => {
					if (!frameOffset) {
						return offset;
					}

					const isTopBottomPlacement =
						currentPlacement.includes('top') ||
						currentPlacement.includes('bottom');

					// The main axis should represent the gap between the
					// floating element and the reference element. The cross
					// axis is always perpendicular to the main axis.
					const mainAxis = isTopBottomPlacement ? 'y' : 'x';
					const crossAxis = mainAxis === 'x' ? 'y' : 'x';

					// When the popover is before the reference, subtract the offset,
					// of the main axis else add it.
					const hasBeforePlacement =
						currentPlacement.includes('top') ||
						currentPlacement.includes('left');
					const mainAxisModifier = hasBeforePlacement ? -1 : 1;
					const normalizedOffset = offset || 0;

					return {
						mainAxis:
							normalizedOffset +
							frameOffset[mainAxis] * mainAxisModifier,
						crossAxis: frameOffset[crossAxis],
					};
			  })
			: undefined,
		resize
			? size({
					apply(sizeProps) {
						const { firstElementChild } =
							// eslint-disable-next-line no-use-before-define
							refs.floating.current ?? {};

						if (!firstElementChild) return;

						// Reduce the height of the popover to the available space.
						Object.assign(firstElementChild.style, {
							maxHeight: `${sizeProps.availableHeight}px`,
							overflow: 'auto',
						});
					},
			  })
			: undefined,
		useFlip
			? flip({
					crossAxis: false,
					boundary: document.querySelector(
						'.interface-interface-skeleton__content'
					),
			  })
			: undefined,
		useShift
			? shift({
					crossAxis: true,
					...(shiftLimit && { limiter: limitShift(shiftLimit) }),
					padding: shiftPadding ?? 1, // Necessary to avoid flickering at the edge of the viewport.
			  })
			: undefined,
		hasArrow ? arrow({ element: arrowRef }) : undefined,
	].filter(m => !!m);
	const slotName = useContext(slotNameContext) || __unstableSlotName;

	let onDialogClose;

	if (onClose || onFocusOutside) {
		onDialogClose = (type, event) => {
			// Ideally the popover should have just a single onClose prop and
			// not three props that potentially do the same thing.
			if (type === 'focus-outside' && onFocusOutside) {
				onFocusOutside(event);
			} else if (onClose) {
				onClose();
			}
		};
	}

	const [dialogRef, dialogProps] = useDialog({
		focusOnMount,
		__unstableOnClose: onDialogClose,
		onClose: onDialogClose,
	});

	const {
		// Positioning coordinates
		x,
		y,
		// regular references
		refs,
		// Callback refs (not regular refs). This allows the position to be updated.
		// when either elements change.
		reference,
		floating,
		update,
		placement: computedPlacement,
		middlewareData: { arrow: arrowData = {} },
	} = useFloating({
		strategy,
		placement: normalizedPlacementFromProps,
		middleware,
		transform: false,
		whileElementsMounted: (...args) =>
			autoUpdate(...args, {
				ancestorScroll: false,
				animationFrame: useAnimationFrame,
			}),
	});

	// Update the `reference`'s ref.
	//
	// In floating-ui's terms:
	// - "reference" refers to the popover's anchor element.
	// - "floating" refers the floating popover's element.
	// A floating element can also be positioned relative to a virtual element,
	// instead of a real one. A virtual element is represented by an object
	// with the `getBoundingClientRect()` function (like real elements).
	// See https://floating-ui.com/docs/virtual-elements for more info.
	useLayoutEffect(() => {
		let resultingReferenceRef;

		if (anchor) {
			resultingReferenceRef = anchor;
		} else if (anchorRefFallback.current) {
			// If no explicit ref is passed via props, fall back to
			// anchoring to the popover's parent node.
			resultingReferenceRef = anchorRefFallback.current.parentNode;
		}

		if (!resultingReferenceRef) {
			return;
		}

		reference(resultingReferenceRef);
	}, [anchor, reference]);

	// This is only needed for a smooth transition when moving blocks.
	useLayoutEffect(() => {
		if (!__unstableObserveElement) {
			return () => null;
		}
		const observer = new window.MutationObserver(update);
		observer.observe(__unstableObserveElement, { attributes: true });

		return () => {
			observer.disconnect();
		};
	}, [__unstableObserveElement]);

	useLayoutEffect(() => {
		if (Number.isFinite(blockIndex)) {
			update();
		}
	}, [blockIndex]);

	// If the reference element is in a different ownerDocument (e.g. iFrame),
	// we need to manually update the floating's position as the reference's owner
	// document scrolls.
	useLayoutEffect(() => {
		if (ownerDocument === document) {
			return () => null;
		}

		ownerDocument.addEventListener('scroll', update);
		return () => ownerDocument.removeEventListener('scroll', update);
	}, [ownerDocument]);

	const animateClassName =
		!!animate &&
		getAnimateClassName({
			type: 'appear',
			origin: placementToAnimationOrigin(computedPlacement),
		});

	const mergedFloatingRef = useMergeRefs([floating, dialogRef, forwardedRef]);

	let content = (
		<div
			className={classnames(
				'components-popover',
				'maxi-components-popover',
				className,
				animateClassName,
				{
					'is-expanded': isExpanded,
					'is-alternate': isAlternate,
				}
			)}
			{...contentProps}
			ref={mergedFloatingRef}
			{...dialogProps}
			tabIndex='-1'
			style={
				isExpanded
					? undefined
					: {
							position: strategy,
							left: Number.isNaN(x) ? 0 : x,
							top: Number.isNaN(y) ? 0 : y,
					  }
			}
		>
			{/* Prevents scroll on the document */}
			{isExpanded && <ScrollLock />}
			{isExpanded && (
				<div className='maxi-components-popover__header components-popover__header'>
					<span className='maxi-components-popover__header-title components-popover__header-title'>
						{headerTitle}
					</span>
					<Button
						className='maxi-components-popover__close components-popover__close'
						icon={close}
						onClick={onClose}
					/>
				</div>
			)}
			<div className='maxi-components-popover__content components-popover__content'>
				{children}
			</div>
			{hasArrow && (
				<div
					ref={arrowRef}
					className={[
						'maxi-components-popover__arrow components-popover__arrow',
						`is-${computedPlacement.split('-')[0]}`,
					].join(' ')}
					style={{
						left: Number.isFinite(arrowData?.x)
							? `${arrowData.x}px`
							: '',
						top: Number.isFinite(arrowData?.y)
							? `${arrowData.y}px`
							: '',
					}}
				>
					<ArrowTriangle />
				</div>
			)}
		</div>
	);

	if (slotName !== SLOT_NAME) {
		content = <Fill name={slotName}>{content}</Fill>;
		return content;
	}

	return <span ref={anchorRefFallback}>{content}</span>;
};

const PopoverContainer = forwardRef(Popover);

function PopoverSlot({ name = SLOT_NAME }, ref) {
	return (
		<Slot bubblesVirtually name={name} className='popover-slot' ref={ref} />
	);
}

PopoverContainer.Slot = forwardRef(PopoverSlot);
PopoverContainer.__unstableSlotNameProvider = slotNameContext.Provider;

export default PopoverContainer;
