/**
 * WordPress dependencies
 */
import { forwardRef, memo, useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import { Resizable } from 're-resizable';
import classnames from 'classnames';
import { isEqual } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { memoChildrenComparator } from '../../extensions/maxi-block';

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

		const handleRef = newRef => {
			if (newRef) {
				// Needed to clean styles before first onResizeStop, so that blocks don't jump after resizing
				if (cleanStyles && !hasCleanedStyles.current) {
					newRef.resizable.style = null;
					hasCleanedStyles.current = true;
				}
				if (resizableObject) resizableObject.current = newRef;
				if (ref) {
					if (typeof ref === 'function') ref(newRef.resizable);
					else ref.current = newRef.resizable;
				}
			}
		};

		return (
			<Resizable
				{...rest}
				ref={handleRef}
				className={classes}
				enable={enable}
				handleClasses={{
					top:
						enable.top &&
						classnames(
							handleClassName,
							showHandlesClassName,
							sideHandleClassName,
							'maxi-resizable__handle-top'
						),
					right:
						enable.right &&
						classnames(
							handleClassName,
							showHandlesClassName,
							sideHandleClassName,
							'maxi-resizable__handle-right'
						),
					bottom:
						enable.bottom &&
						classnames(
							handleClassName,
							showHandlesClassName,
							sideHandleClassName,
							'maxi-resizable__handle-bottom'
						),
					left:
						enable.left &&
						classnames(
							handleClassName,
							showHandlesClassName,
							sideHandleClassName,
							'maxi-resizable__handle-left'
						),
					topLeft:
						enable.topLeft &&
						classnames(
							handleClassName,
							showHandlesClassName,
							cornerHandleClassName,
							'maxi-resizable__handle-topleft'
						),
					topRight:
						enable.topRight &&
						classnames(
							handleClassName,
							showHandlesClassName,
							cornerHandleClassName,
							'maxi-resizable__handle-topright'
						),
					bottomRight:
						enable.bottomRight &&
						classnames(
							handleClassName,
							showHandlesClassName,
							cornerHandleClassName,
							'maxi-resizable__handle-bottomright'
						),
					bottomLeft:
						enable.bottomLeft &&
						classnames(
							handleClassName,
							showHandlesClassName,
							cornerHandleClassName,
							'maxi-resizable__handle-bottomleft'
						),
				}}
				handleWrapperClass={handlesWrapperClassName}
				onResizeStop={(e, direction, refToElement, ...rest) => {
					onResizeStop?.(e, direction, refToElement, ...rest);
					if (cleanStyles) refToElement.style = null;
				}}
			>
				{children}
			</Resizable>
		);
	}),
	(oldRawProps, newRawProps) => {
		if (oldRawProps.deviceType !== newRawProps.deviceType) return false;
		if (!isEqual(oldRawProps.size, newRawProps.size)) return false;

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
