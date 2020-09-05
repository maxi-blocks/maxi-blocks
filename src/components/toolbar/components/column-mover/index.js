/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { useSelect, useDispatch } = wp.data;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Styles and icons
 */
// import './editor.scss';
import { toolbarMove } from '../../../../icons';

/**
 * ColumnMover
 */
const ColumnMover = props => {
	const { clientId, blockName } = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

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

	return (
		<Fragment>
			<Tooltip
				text={__('Move left', 'maxi-blocks')}
				position='bottom center'
			>
				<Button
					className='toolbar-item toolbar-item__bold'
					onClick={() => moveBlocksUp([clientId], rootClientId)}
				>
					<Icon className='toolbar-item__icon' icon={toolbarMove} />
				</Button>
			</Tooltip>
			<Tooltip
				text={__('Move right', 'maxi-blocks')}
				position='bottom center'
			>
				<Button
					className='toolbar-item toolbar-item__bold'
					onClick={() => moveBlocksDown([clientId], rootClientId)}
				>
					<Icon className='toolbar-item__icon' icon={toolbarMove} />
				</Button>
			</Tooltip>
		</Fragment>
	);
};

export default ColumnMover;
