/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Icon from '@components/icon';
import Button from '@components/button';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { moveRight, moveLeft } from '@maxi-icons';

/**
 * ColumnMover
 */
const ColumnMover = props => {
	const { clientId, blockName, tooltipsHide } = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	const { rootClientId, isLeftDisabled, isRightDisabled } = useSelect(
		select => {
			const { getBlockRootClientId, getBlockIndex, getBlock } =
				select('core/block-editor');

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

	const buttonMoveLeft = () => {
		return (
			<Button
				aria-disabled={isLeftDisabled}
				onClick={() => moveBlocksUp([clientId], rootClientId)}
			>
				<Icon className='toolbar-item__icon' icon={moveLeft} />
			</Button>
		);
	};

	const buttonMoveRight = () => {
		return (
			<Button
				aria-disabled={isRightDisabled}
				onClick={() => moveBlocksDown([clientId], rootClientId)}
			>
				<Icon className='toolbar-item__icon' icon={moveRight} />
			</Button>
		);
	};

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	return (
		<div className='toolbar-item toolbar-item-move__horizontally'>
			{!tooltipsHide && (
				<Tooltip text={__('Move left', 'maxi-blocks')} placement='top'>
					{buttonMoveLeft()}
				</Tooltip>
			)}
			{!tooltipsHide && (
				<Tooltip text={__('Move right', 'maxi-blocks')} placement='top'>
					{buttonMoveRight()}
				</Tooltip>
			)}
			{tooltipsHide && buttonMoveLeft()}
			{tooltipsHide && buttonMoveRight()}
		</div>
	);
};

export default ColumnMover;
