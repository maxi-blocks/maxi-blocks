/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useDispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import uniqueIDRemover from '@extensions/attributes/uniqueIDRemover';

/**
 * Delete
 */
const Delete = props => {
	const { clientId, blockName, tooltipsHide } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

	const { getBlock } = select('core/block-editor');
	const block = getBlock(clientId);

	const { innerBlocks, attributes } = block;
	const { uniqueID } = attributes;

	const { removeBlock } = useDispatch('core/block-editor');

	const deleteContent = () => {
		return (
			<div className='toolbar-item toolbar-item__delete'>
				<Button
					onClick={() => {
						removeBlock(clientId);
						uniqueIDRemover(uniqueID, innerBlocks);
					}}
				>
					{__('Remove block', 'maxi-blocks')}
					<span>Shift+Alt+Z</span>
				</Button>
			</div>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Delete', 'maxi-blocks')} placement='top'>
				{deleteContent()}
			</Tooltip>
		);
	return deleteContent();
};

export default Delete;
