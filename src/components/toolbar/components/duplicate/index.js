/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';

/**
 * Icons
 */
import { toolbarDuplicate } from '../../../../icons';

/**
 * Duplicate
 */
const Duplicate = props => {
	const { clientId, blockName, tooltipsHide, updateSelection = true } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

	const { duplicateBlocks } = useDispatch('core/block-editor');

	const duplicateContent = () => {
		return (
			<div className='toolbar-item toolbar-item__duplicate'>
				<Button
					onClick={() => duplicateBlocks([clientId], updateSelection)}
				>
					<Icon
						className='toolbar-item__icon'
						icon={toolbarDuplicate}
					/>
				</Button>
			</div>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip
				text={__('Duplicate', 'maxi-blocks')}
				position='top center'
			>
				{duplicateContent()}
			</Tooltip>
		);
	return duplicateContent();
};

export default Duplicate;
