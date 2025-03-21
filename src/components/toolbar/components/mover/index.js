/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Draggable, Tooltip } from '@wordpress/components';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';

/**
 * External dependencies
 */
import { castArray, first, last } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarDrop, moveUp, moveDown } from '@maxi-icons';

/**
 * Mover
 */
const Mover = props => {
	const { clientId, blockName, tooltipsHide } = props;

	const { moveBlocksDown, moveBlocksUp, updateBlockAttributes } =
		useDispatch('core/block-editor');
	const { getBlockAttributes } = select('core/block-editor');

	const {
		srcRootClientId,
		index,
		isDraggable,
		isTopDisabled,
		isDownDisabled,
	} = useSelect(
		select => {
			const {
				getBlockIndex,
				getBlockRootClientId,
				getTemplateLock,
				getBlockOrder,
				getSelectedBlockClientIds,
			} = select('core/block-editor');
			const rootClientId = getBlockRootClientId(clientId);
			const templateLock = rootClientId
				? getTemplateLock(rootClientId)
				: null;
			const clientIds = getSelectedBlockClientIds();
			const normalizedClientIds = castArray(clientIds);
			const firstClientId = first(normalizedClientIds);
			const lastClientId = last(normalizedClientIds);
			const blockRootClientId = getBlockRootClientId(firstClientId);
			const blockOrder = getBlockOrder(blockRootClientId);
			const firstBlockIndex = getBlockIndex(
				firstClientId,
				blockRootClientId
			);
			const lastBlockIndex = getBlockIndex(
				lastClientId,
				blockRootClientId
			);
			const isFirstBlock = firstBlockIndex === 0;
			const isLastBlock = lastBlockIndex === blockOrder.length - 1;

			return {
				index: getBlockIndex(clientId, rootClientId),
				srcRootClientId: rootClientId,
				isDraggable: templateLock !== 'all',
				isTopDisabled: isFirstBlock,
				isDownDisabled: isLastBlock,
			};
		},
		[clientId]
	);
	const isDragging = useRef(false);
	const { startDraggingBlocks, stopDraggingBlocks } =
		useDispatch('core/block-editor');

	// Stop dragging blocks if the block draggable is unmounted
	useEffect(() => {
		return () => {
			if (isDragging.current) {
				stopDraggingBlocks();
				if (srcRootClientId) {
					const attributes = getBlockAttributes(srcRootClientId);
					if (attributes?.blockStyle) {
						updateBlockAttributes(clientId, {
							blockStyle: attributes.blockStyle,
						});
					}
				}
			}
		};
	}, [
		clientId,
		getBlockAttributes,
		srcRootClientId,
		stopDraggingBlocks,
		updateBlockAttributes,
	]);

	if (blockName === 'maxi-blocks/column-maxi') return null;

	const blockElementId = `block-${clientId}`;
	const transferData = {
		type: 'block',
		srcIndex: index,
		srcClientId: clientId,
		srcClientIds: [clientId],
		srcRootClientId,
	};

	const moveUpContent = () => {
		return (
			<Button
				aria-disabled={isTopDisabled}
				onClick={() => {
					moveBlocksUp([clientId], srcRootClientId);
				}}
			>
				<Icon className='toolbar-item__icon' icon={moveUp} />
			</Button>
		);
	};

	const moveDownContent = () => {
		return (
			<Button
				aria-disabled={isDownDisabled}
				onClick={() => moveBlocksDown([clientId], srcRootClientId)}
			>
				<Icon className='toolbar-item__icon' icon={moveDown} />
			</Button>
		);
	};

	return (
		<>
			<Draggable
				elementId={blockElementId}
				transferData={transferData}
				onDragStart={() => {
					startDraggingBlocks([clientId]);
					isDragging.current = true;
				}}
				onDragEnd={() => {
					stopDraggingBlocks();
					isDragging.current = false;
				}}
				__experimentalTransferDataType='wp-blocks'
			>
				{({ onDraggableStart, onDraggableEnd }, ...rest) =>
					!tooltipsHide ? (
						<Tooltip
							text={__('Mover', 'maxi-blocks')}
							placement='top'
						>
							<div className='toolbar-item'>
								<Button
									className='toolbar-item toolbar-item__move'
									draggable={isDraggable}
									onDragStart={onDraggableStart}
									onDragEnd={onDraggableEnd}
									{...rest}
								>
									<Icon
										className='toolbar-item__icon'
										icon={toolbarDrop}
									/>
								</Button>
							</div>
						</Tooltip>
					) : (
						<div className='toolbar-item'>
							<Button
								className='toolbar-item toolbar-item__move'
								draggable={isDraggable}
								onDragStart={onDraggableStart}
								onDragEnd={onDraggableEnd}
								{...rest}
							>
								<Icon
									className='toolbar-item__icon'
									icon={toolbarDrop}
								/>
							</Button>
						</div>
					)
				}
			</Draggable>
			<div className='toolbar-item-move__vertically'>
				{!tooltipsHide && (
					<>
						<Tooltip
							text={__('Move up', 'maxi-blocks')}
							placement='top center'
						>
							{moveUpContent()}
						</Tooltip>
						<Tooltip
							text={__('Move down', 'maxi-blocks')}
							placement='top center'
						>
							{moveDownContent()}
						</Tooltip>
					</>
				)}
				{tooltipsHide && (
					<>
						{moveUpContent()} {moveDownContent()}
					</>
				)}
			</div>
		</>
	);
};

export default Mover;
