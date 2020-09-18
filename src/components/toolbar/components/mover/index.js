/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Draggable, Icon, Button, Tooltip } = wp.components;
const { useSelect, useDispatch } = wp.data;
const { useEffect, useRef, Fragment } = wp.element;

/**
 * Icons
 */
import './editor.scss';
import { toolbarMove } from '../../../../icons';
import { moveUp, moveDown } from '../../../../icons';

/**
 * Mover
 */
const Mover = props => {
	const { clientId, blockName } = props;

	const { rootClientId } = useSelect(
		select => {
			const { getBlockRootClientId } = select('core/block-editor');
			const blockRootClientId = getBlockRootClientId(clientId);

			return {
				rootClientId: blockRootClientId,
			};
		},
		[clientId]
	);

	const { moveBlocksDown, moveBlocksUp } = useDispatch('core/block-editor');

	const { srcRootClientId, index, isDraggable } = useSelect(
		select => {
			const {
				getBlockIndex,
				getBlockRootClientId,
				getTemplateLock,
			} = select('core/block-editor');
			const rootClientId = getBlockRootClientId(clientId);
			const templateLock = rootClientId
				? getTemplateLock(rootClientId)
				: null;

			return {
				index: getBlockIndex(clientId, rootClientId),
				srcRootClientId: rootClientId,
				isDraggable: templateLock !== 'all',
			};
		},
		[clientId]
	);
	const isDragging = useRef(false);
	const { startDraggingBlocks, stopDraggingBlocks } = useDispatch(
		'core/block-editor'
	);

	// Stop dragging blocks if the block draggable is unmounted
	useEffect(() => {
		return () => {
			if (isDragging.current) {
				stopDraggingBlocks();
			}
		};
	}, []);

	if (blockName === 'maxi-blocks/column-maxi') return null;

	const blockElementId = `block-${clientId}`;
	const transferData = {
		type: 'block',
		srcIndex: index,
		srcClientId: clientId,
		srcClientIds: [clientId],
		srcRootClientId,
	};

	return (
		<Fragment>
			<Draggable
				elementId={blockElementId}
				transferData={transferData}
				onDragStart={() => {
					startDraggingBlocks();
					isDragging.current = true;
				}}
				onDragEnd={() => {
					stopDraggingBlocks();
					isDragging.current = false;
				}}
			>
				{({ onDraggableStart, onDraggableEnd }) => (
					<Tooltip
						text={__('Mover', 'maxi-blocks')}
						position='bottom center'
					>
						<Button
							className='toolbar-item toolbar-item__move'
							draggable={isDraggable}
							onDragStart={onDraggableStart}
							onDragEnd={onDraggableEnd}
						>
							<Icon
								className='toolbar-item__icon'
								icon={toolbarMove}
							/>
						</Button>
					</Tooltip>
				)}
			</Draggable>
			<div className='toolbar-item-move__vertically'>
				<Tooltip
					text={__('Move up', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
						onClick={() => moveBlocksUp([clientId], rootClientId)}
					>
						<Icon className='toolbar-item__icon' icon={moveUp} />
					</Button>
				</Tooltip>
				<Tooltip
					text={__('Move down', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
						onClick={() => moveBlocksDown([clientId], rootClientId)}
					>
						<Icon className='toolbar-item__icon' icon={moveDown} />
					</Button>
				</Tooltip>
			</div>
		</Fragment>
	);
};

export default Mover;
