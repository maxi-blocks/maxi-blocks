/**
 * External dependencies
 */
import { Resizable } from 're-resizable';
import classnames from 'classnames';

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
		showHandle = false,
		resizableObject,
		...rest
	} = props;

	const classes = classnames('maxi-block__resizer', className);
	const cornerHandleClassName = 'maxi-resizable__corner-handle';
	const handleClassName = 'maxi-resizable__handle';
	const showHandlesClassName = showHandle && 'maxi-resizable__handle--show';
	const sideHandleClassName = 'maxi-resizable__side-handle';

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

	return (
		<Resizable
			{...rest}
			ref={resizableObject}
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
						'maxi-resizable__handle-top',
						'maxi-resizable__handle-left'
					),
				topRight:
					enable.topRight &&
					classnames(
						handleClassName,
						showHandlesClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-top',
						'maxi-resizable__handle-right'
					),
				bottomRight:
					enable.bottomRight &&
					classnames(
						handleClassName,
						showHandlesClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-bottom',
						'maxi-resizable__handle-right'
					),
				bottomLeft:
					enable.bottomLeft &&
					classnames(
						handleClassName,
						showHandlesClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-bottom',
						'maxi-resizable__handle-left'
					),
			}}
		>
			{children}
		</Resizable>
	);
};

export default BlockResizer;
