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
// import Icon from '../../../icon';

/**
 * Icons
 */
// import { toolbarDelete } from '../../../../icons';

/**
 * Delete
 */
const InsertBefore = props => {
	const { clientId, blockName } = props;

	if (
		blockName === 'maxi-blocks/column-maxi' ||
		blockName === 'maxi-blocks/container-maxi'
	)
		return null;

	const { InsertBefore } = useDispatch('core/block-editor');

	return (
		<Tooltip
			text={__('Insert before', 'maxi-blocks')}
			position='bottom center'
		>
			<div className='toolbar-item toolbar-item__delete'>
				<Button onClick={() => InsertBefore(clientId)}>
					{__('Insert before', 'maxi-blocks')}
					<span>Ctrl+Alt+T</span>
				</Button>
			</div>
		</Tooltip>
	);
};

export default InsertBefore;
