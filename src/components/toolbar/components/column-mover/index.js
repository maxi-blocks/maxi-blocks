/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { useSelect, useDispatch } = wp.data;
const { Icon, Button, Tooltip } = wp.components;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { moveRight, moveLeft } from '../../../../icons';

/**
 * ColumnMover
 */
const ColumnMover = props => {
	const { clientId, blockName } = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	const { rootClientId, isLeftDisabled, isRightDisabled } = useSelect(
		select => {
			const { getBlockRootClientId, getBlockIndex, getBlock } = select(
				'core/block-editor'
			);

			const rowId = getBlockRootClientId(clientId);
			const rowBlock = !isNil(rowId) && getBlock(rowId);
			const columnsCount = !isNil(rowBlock)
				? rowBlock.innerBlocks.length
				: 0;
			const firstClientId =
				!isNil(rowBlock) && rowBlock.innerBlocks[0].clientId;
			const blockRootClientId = getBlockRootClientId(firstClientId);
			const currentItemOrder = getBlockIndex(clientId, rowId);
			const isFirstBlock = currentItemOrder === 0;
			const isLastBlock = currentItemOrder === columnsCount - 1;

			return {
				rootClientId: blockRootClientId,
				isLeftDisabled: isFirstBlock,
				isRightDisabled: isLastBlock,
			};
		},
		[clientId]
	);

	const { moveBlocksDown, moveBlocksUp } = useDispatch('core/block-editor');

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	return (
		<Fragment>
			<div className='toolbar-item-move__horizontally'>
				<Tooltip
					text={__('Move left', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
						aria-disabled={isLeftDisabled}
						onClick={() => moveBlocksUp([clientId], rootClientId)}
					>
						<Icon className='toolbar-item__icon' icon={moveLeft} />
					</Button>
				</Tooltip>
				<Tooltip
					text={__('Move right', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
						aria-disabled={isRightDisabled}
						onClick={() => moveBlocksDown([clientId], rootClientId)}
					>
						<Icon className='toolbar-item__icon' icon={moveRight} />
					</Button>
				</Tooltip>
			</div>
		</Fragment>
	);
};

export default ColumnMover;
