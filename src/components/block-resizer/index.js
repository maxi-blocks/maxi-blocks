/**
 * External dependencies
 */
import { Resizable } from 're-resizable';
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const BlockResizer = props => {
	const {
		children,
		className,
		defaultSize,
		directions,
		maxWidth,
		minWidth,
		onResizeStart,
		onResizeStop,
		resizableObject,
		showHandle = false,
		size,
	} = props;

	const classes = classnames('maxi-block__resizer', className);
	const cornerHandleClassName = 'maxi-resizable__corner-handle';
	const handleClassName = 'maxi-resizable__handle';
	const showHandlesClassName = showHandle && 'maxi-resizable__handle--show';
	const sideHandleClassName = 'maxi-resizable__side-handle';

	return (
		<Resizable
			ref={resizableObject}
			className={classes}
			handleClasses={{
				top:
					!isNil(directions.top) &&
					directions.top &&
					classnames(
						handleClassName,
						showHandlesClassName,
						sideHandleClassName,
						'maxi-resizable__handle-top'
					),
				right:
					!isNil(directions.right) &&
					directions.right &&
					classnames(
						handleClassName,
						showHandlesClassName,
						sideHandleClassName,
						'maxi-resizable__handle-right'
					),
				bottom:
					!isNil(directions.bottom) &&
					directions.bottom &&
					classnames(
						handleClassName,
						showHandlesClassName,
						sideHandleClassName,
						'maxi-resizable__handle-bottom'
					),
				left:
					!isNil(directions.left) &&
					directions.left &&
					classnames(
						handleClassName,
						showHandlesClassName,
						sideHandleClassName,
						'maxi-resizable__handle-left'
					),
				topLeft:
					!isNil(directions.topLeft) &&
					directions.topLeft &&
					classnames(
						handleClassName,
						showHandlesClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-top',
						'maxi-resizable__handle-left'
					),
				topRight:
					!isNil(directions.topRight) &&
					directions.topRight &&
					classnames(
						handleClassName,
						showHandlesClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-top',
						'maxi-resizable__handle-right'
					),
				bottomRight:
					!isNil(directions.bottomRight) &&
					directions.bottomRight &&
					classnames(
						handleClassName,
						showHandlesClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-bottom',
						'maxi-resizable__handle-right'
					),
				bottomLeft:
					!isNil(directions.bottomLeft) &&
					directions.bottomLeft &&
					classnames(
						handleClassName,
						showHandlesClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-bottom',
						'maxi-resizable__handle-left'
					),
			}}
			size={size}
			defaultSize={defaultSize}
			minWidth={minWidth}
			maxWidth={maxWidth}
			enable={directions}
			onResizeStop={(event, direction, elt, delta) =>
				onResizeStop(event, direction, elt, delta)
			}
			onResizeStart={(event, direction, elt) =>
				onResizeStart(event, direction, elt)
			}
		>
			{children}
		</Resizable>
	);
};

export default BlockResizer;
