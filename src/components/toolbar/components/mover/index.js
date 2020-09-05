/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Draggable, Icon, Button, Tooltip } = wp.components;
const { useSelect, useDispatch } = wp.data;
const { useEffect, useRef } = wp.element;

/**
 * Icons
 */
import { toolbarMove } from '../../../../icons';

/**
 * Mover
 */
const Mover = props => {
	const { clientId, blockName } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

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

	const blockElementId = `block-${clientId}`;
	const transferData = {
		type: 'block',
		srcIndex: index,
		srcClientId: clientId,
		srcClientIds: [clientId],
		srcRootClientId,
	};

	return (
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
	);
};

export default Mover;
