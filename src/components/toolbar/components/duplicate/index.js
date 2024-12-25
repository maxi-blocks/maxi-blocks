/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useContext } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';
import { insertBlockIntoColumns } from '@extensions/repeater';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

/**
 * Icons
 */
import { toolbarDuplicate } from '@maxi-icons';

/**
 * Duplicate
 */
const Duplicate = props => {
	const { clientId, blockName, tooltipsHide, updateSelection = true } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

	const repeaterContext = useContext(RepeaterContext);

	const { duplicateBlocks } = useDispatch('core/block-editor');

	const duplicateContent = () => {
		return (
			<div className='toolbar-item toolbar-item__duplicate'>
				<Button
					onClick={async () => {
						const duplicatedBlockClientId = (
							await duplicateBlocks([clientId], updateSelection)
						)[0];

						if (repeaterContext?.repeaterStatus) {
							insertBlockIntoColumns(
								duplicatedBlockClientId,
								repeaterContext?.getInnerBlocksPositions?.()?.[
									[-1]
								]
							);
						}
					}}
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
			<Tooltip text={__('Duplicate', 'maxi-blocks')} placement='top'>
				{duplicateContent()}
			</Tooltip>
		);
	return duplicateContent();
};

export default Duplicate;
