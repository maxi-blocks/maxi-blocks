/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import { Resizable } from 're-resizable';
import classnames from 'classnames';
import { round, isNil } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const ResizableControl = props => {
	const {
		attributes,
		children,
		context,
		defaultSize,
		deviceType,
		directions,
		onChange,
		rowBlockId,
		uniqueID,
		updateRowPattern,
	} = props;

	const handleClassName = 'maxi-resizable__handle';
	const sideHandleClassName = 'maxi-resizable__side-handle';
	const cornerHandleClassName = 'maxi-resizable__corner-handle';

	return (
		<Resizable
			ref={this.resizableObject}
			showHandle={context.displayHandlers}
			className={classnames(
				'maxi-block--backend',
				'maxi-block__resizer',
				'maxi-column-block__resizer',
				`maxi-column-block__resizer__${uniqueID}`,
				getLastBreakpointAttribute(
					'display',
					deviceType,
					attributes
				) === 'none' && 'maxi-block-display-none'
			)}
			handleClasses={{
				top:
					!isNil(directions.top) &&
					directions.top &&
					classnames(
						handleClassName,
						sideHandleClassName,
						'maxi-resizable__handle-top'
					),
				right:
					!isNil(directions.right) &&
					directions.right &&
					classnames(
						handleClassName,
						sideHandleClassName,
						'maxi-resizable__handle-right'
					),
				bottom:
					!isNil(directions.bottom) &&
					directions.bottom &&
					classnames(
						handleClassName,
						sideHandleClassName,
						'maxi-resizable__handle-bottom'
					),
				left:
					!isNil(directions.left) &&
					directions.left &&
					classnames(
						handleClassName,
						sideHandleClassName,
						'maxi-resizable__handle-left'
					),
				topLeft:
					!isNil(directions.topLeft) &&
					directions.topLeft &&
					classnames(
						handleClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-top',
						'maxi-resizable__handle-left'
					),
				topRight:
					!isNil(directions.topRight) &&
					directions.topRight &&
					classnames(
						handleClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-top',
						'maxi-resizable__handle-right'
					),
				bottomRight:
					!isNil(directions.bottomRight) &&
					directions.bottomRight &&
					classnames(
						handleClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-bottom',
						'maxi-resizable__handle-right'
					),
				bottomLeft:
					!isNil(directions.bottomLeft) &&
					directions.bottomLeft &&
					classnames(
						handleClassName,
						cornerHandleClassName,
						'maxi-resizable__handle-bottom',
						'maxi-resizable__handle-left'
					),
			}}
			defaultSize={{
				width: defaultSize,
			}}
			minWidth='1%'
			maxWidth='100%'
			enable={directions}
			onResizeStop={(event, direction, elt) => {
				updateRowPattern(rowBlockId, deviceType, context.rowPattern);

				onChange({
					[`column-size-${deviceType}`]: round(
						+elt.style.width.replace('%', '')
					),
				});
			}}
		>
			{children}
		</Resizable>
	);
};

export default ResizableControl;
