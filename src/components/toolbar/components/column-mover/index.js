/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { useSelect, useDispatch } = wp.data;
const { Icon, Button, Tooltip } = wp.components;

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

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	return (
		<Fragment>
			<div className='toolbar-item-move__horizontally'>
				<Tooltip
					text={__('Move left', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
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
