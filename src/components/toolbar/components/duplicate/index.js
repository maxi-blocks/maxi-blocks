/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { useContext } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import { insertBlockIntoColumns } from '../../../../extensions/repeater';
import RepeaterContext from '../../../../blocks/row-maxi/repeaterContext';
import { uniqueIDGenerator } from '../../../../extensions/attributes';

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

	const repeaterContext = useContext(RepeaterContext);

	const { duplicateBlocks, updateBlockAttributes } =
		useDispatch('core/block-editor');

	const duplicateContent = () => {
		return (
			<div className='toolbar-item toolbar-item__duplicate'>
				<Button
					onClick={async () => {
						const duplicatedBlockClientId = (
							await duplicateBlocks([clientId], updateSelection)
						)[0];

						const newUniqueID = uniqueIDGenerator({
							blockName,
						});

						console.log('duplicatedBlockClientId');
						console.log(duplicatedBlockClientId);

						// Update the uniqueID attribute of the duplicated block
						updateBlockAttributes(duplicatedBlockClientId, {
							uniqueID: newUniqueID,
						});

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
