/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';

/**
 * Icons
 */
import { toolbarMoreSettings } from '../../../../icons';

/**
 * Duplicate
 */
const MoreSettings = props => {
	const { blockName } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

	return (
		<Tooltip text={__('Help', 'maxi-blocks')} position='bottom center'>
			<div className='toolbar-item toolbar-item__help'>
				<Button href='#'>
					<Icon
						className='toolbar-item__icon'
						icon={toolbarMoreSettings}
					/>
				</Button>
			</div>
		</Tooltip>
	);
};

export default MoreSettings;
