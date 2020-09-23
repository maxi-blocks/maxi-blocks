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
import { castArray, first, last } from 'lodash';

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

	const { rootClientId, isLeftDisabled, isRightDisabled } = useSelect(
		select => {
			const {
				getBlockRootClientId,
				getBlockIndex,
				getBlockOrder,
				getSelectedBlockClientIds,
			} = select('core/block-editor');
			const clientIds = getSelectedBlockClientIds();
			const blockOrder = getBlockOrder(blockRootClientId);
			const normalizedClientIds = castArray(clientIds);
			const firstClientId = first(normalizedClientIds);
			const blockRootClientId = getBlockRootClientId(firstClientId);
			const firstBlockIndex = getBlockIndex(
				firstClientId,
				blockRootClientId
			);
			const lastBlockIndex = getBlockIndex(
				last(normalizedClientIds),
				blockRootClientId
			);
			const isFirstBlock = firstBlockIndex === 0;
			const isLastBlock = lastBlockIndex === blockOrder.length - 1;

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
