/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../../../button';

/**
 * Delete
 */
const Delete = props => {
	const { clientId, blockName, tooltipsHide } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

	const { removeBlock } = useDispatch('core/block-editor');

	const deleteContent = () => {
		return (
			<div className='toolbar-item toolbar-item__delete'>
				<Button onClick={() => removeBlock(clientId)}>
					{__('Remove block', 'maxi-blocks')}
					<span>Shift+Alt+Z</span>
				</Button>
			</div>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Delete', 'maxi-blocks')} position='top center'>
				{deleteContent()}
			</Tooltip>
		);
	return deleteContent();
};

export default Delete;
