/**
 * WordPress dependencies
 */
import { forwardRef, useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEqual, isNaN, toNumber } from 'lodash';

/**
 * Internal dependencies
 */
import Popover from '@components/popover';
import { getLastBreakpointAttribute } from '@extensions/styles';

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
		clientId,
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
				? (getLastBreakpointAttribute({
						target: 'img-width',
						breakpoint: deviceType,
						attributes,
				  }) /
						100) *
				  containerWidth
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
		shouldHideComponent() && 'maxi-popover-button--hidden',
		className
	);

	return (
		<Popover
			ref={popoverRef}
			anchor={ref.current}
			className={classes}
			noArrow
			animate={false}
			focusOnMount={false}
			__unstableSlotName='block-toolbar'
			__unstableObserveElement={ref.current}
			observeBlockPosition={clientId}
			uniqueid={uniqueID}
			placement='top-end'
		>
			{props.children}
		</Popover>
	);
});

export default MaxiPopoverButton;
