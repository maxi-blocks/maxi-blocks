/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch  } from '@wordpress/data';
const { Icon, Button, Tooltip } = wp.components;

/**
 * Icons
 */
import { toolbarDuplicate } from '../../../../icons';

/**
 * Duplicate
 */
const Duplicate = props => {
	const { clientId } = props;

	const { duplicateBlocks } = useDispatch('core/block-editor');

	return (
		<Tooltip text={__('Duplicate', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__duplicate'
				onClick={() => duplicateBlocks([clientId])}
			>
				<Icon className='toolbar-item__icon' icon={toolbarDuplicate} />
			</Button>
		</Tooltip>
	);
};

export default Duplicate;
