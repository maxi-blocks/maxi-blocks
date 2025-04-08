/**
 * WordPress dependencies
 */
import { forwardRef, memo, useContext, useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import { Resizable } from 're-resizable';
import classnames from 'classnames';
import { isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import { memoChildrenComparator } from '@extensions/maxi-block';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const BlockResizer = memo(
	forwardRef((props, ref) => {
		const {
			children,
			className,
			showHandle = false,
			resizableObject,
			isOverflowHidden = false,
			onResizeStop,
			cleanStyles = false,
			...rest
		} = props;
		// Needed for memo part only
		delete rest.deviceType;
		const hasCleanedStyles = useRef(false);

		const repeaterStatus = !!useContext(RepeaterContext)?.repeaterStatus;

		const classes = classnames(
			'maxi-block__resizer',
			isOverflowHidden && 'maxi-block__resizer--overflow',
			className
		);
		const cornerHandleClassName = 'maxi-resizable__corner-handle';
		const handleClassName = 'maxi-resizable__handle';
		const showHandlesClassName =
			showHandle && 'maxi-resizable__handle--show';
		const sideHandleClassName = 'maxi-resizable__side-handle';
		const handlesWrapperClassName = 'maxi-resizable__handle-wrapper';

		const enable = {
			top: false,
			right: false,
			bottom: false,
			left: false,
			topLeft: false,
			topRight: false,
			bottomRight: false,
			bottomLeft: false,
			...props.enable,
		};

		const stylesCleaner = el =>
			[
				'position',
				'user-select',
				'box-sizing',
				'flex-shrink',
				'min-width',
				'max-width',
			].forEach(style => {
				el.style.setProperty(style, '');
			});

		const handleRef = newRef => {
			if (newRef) {
				// Needed to clean styles before first onResizeStop, so that blocks don't jump after resizing
				if (cleanStyles && !hasCleanedStyles.current) {
					stylesCleaner(newRef.resizable);
					hasCleanedStyles.current = true;
				}
				if (resizableObject) resizableObject.current = newRef;
				if (ref) {
					if (typeof ref === 'function') ref(newRef.resizable);
					else ref.current = newRef.resizable;
				}
			}
		};

		const getHandleClasses = (axis, isCorner = false) =>
			classnames(
				handleClassName,
				showHandlesClassName,
				!isCorner ? sideHandleClassName : cornerHandleClassName,
				`maxi-resizable__handle-${axis}`,
				repeaterStatus && 'maxi-resizable__handle--repeater'
			);

		const handleClasses = {
			top: enable.top && getHandleClasses('top'),
			right: enable.right && getHandleClasses('right'),
			bottom: enable.bottom && getHandleClasses('bottom'),
			left: enable.left && getHandleClasses('left'),
			topLeft: enable.topLeft && getHandleClasses('topleft', true),
			topRight: enable.topRight && getHandleClasses('topright', true),
			bottomRight:
				enable.bottomRight && getHandleClasses('bottomright', true),
			bottomLeft:
				enable.bottomLeft && getHandleClasses('bottomleft', true),
		};

		return (
			<Resizable
				{...rest}
				ref={handleRef}
				className={classes}
				enable={enable}
				handleClasses={handleClasses}
				handleWrapperClass={handlesWrapperClassName}
				onResizeStart={e => {
					e.preventDefault();
					e.stopPropagation();
					props.onResizeStart?.(e);
				}}
				onResize={(e, direction, refToElement, delta) => {
					e.preventDefault();
					e.stopPropagation();
					props.onResize?.(e, direction, refToElement, delta);
				}}
				onResizeStop={(e, direction, refToElement, ...rest) => {
					e.preventDefault();
					e.stopPropagation();
					onResizeStop?.(e, direction, refToElement, ...rest);
					if (cleanStyles) stylesCleaner(refToElement);
				}}
			>
				{children}
			</Resizable>
		);
	}),
	(oldRawProps, newRawProps) => {
		if (oldRawProps.deviceType !== newRawProps.deviceType) return false;
		if (!isEqual(oldRawProps.size, newRawProps.size)) return false;
		if (oldRawProps.onResize !== newRawProps.onResize) return false;
		if (oldRawProps.onResizeStop !== newRawProps.onResizeStop) return false;

		if (!memoChildrenComparator(oldRawProps.children, newRawProps.children))
			return false;

		const propsObjectCleaner = props => {
			const cleanProps = { ...props };

			Object.entries(cleanProps).forEach(([key, value]) => {
				if (typeof value === 'object' || typeof value === 'function')
					delete cleanProps[key];
			});

			return cleanProps;
		};

		const oldProps = propsObjectCleaner(oldRawProps);
		const newProps = propsObjectCleaner(newRawProps);

		return isEqual(oldProps, newProps);
	}
);

export default BlockResizer;
