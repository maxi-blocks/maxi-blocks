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
import Dropdown from '../../../dropdown';
import CopyPaste from '../copy-paste';
import ReusableBlocks from '../reusable-blocks';
import Delete from '../delete';
import InsertBefore from '../insert-before';

/**
 * Icons
 */
import { toolbarMoreSettings } from '../../../../icons';

/**
 * Style
 */
import './editor.scss';

/**
 * Duplicate
 */
const MoreSettings = props => {
	const { blockName, clientId, name } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

	return (
		<Tooltip
			text={__('More Settings', 'maxi-blocks')}
			position='bottom center'
		>
			<div className='toolbar-item toolbar-item__more-settings'>
				<Dropdown
					className='maxi-moresettings_settings-selector'
					contentClassName='maxi-moresettings_popover'
					position='bottom right'
					renderToggle={({ isOpen, onToggle }) => (
						<Button onClick={onToggle}>
							<Icon
								className='toolbar-item__icon'
								icon={toolbarMoreSettings}
							/>
						</Button>
					)}
					renderContent={() => (
						<div>
							<CopyPaste clientId={clientId} blockName={name} />
							<ReusableBlocks
								clientId={clientId}
								blockName={name}
							/>
							<Delete clientId={clientId} blockName={name} />
						</div>
					)}
				/>
			</div>
		</Tooltip>
	);
};

export default MoreSettings;
