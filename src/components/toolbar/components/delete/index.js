/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Tooltip } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Icon from '../../../icon';

/**
 * Icons
 */
import { toolbarDelete } from '../../../../icons';

/**
 * Delete
 */
const Delete = props => {
	const { clientId } = props;

	const { removeBlock } = useDispatch('core/block-editor');

	return (
		<Tooltip text={__('Delete', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__delete'
				onClick={() => removeBlock(clientId)}
			>
				<Icon className='toolbar-item__icon' icon={toolbarDelete} />
			</Button>
		</Tooltip>
	);
};

export default Delete;
