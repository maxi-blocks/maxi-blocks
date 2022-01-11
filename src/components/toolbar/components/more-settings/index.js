/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import Dropdown from '../../../dropdown';
import CopyPaste from '../copy-paste';
import ReusableBlocks from '../reusable-blocks';
import Delete from '../delete';
import PaddingMargin from '../padding-margin';
import Alignment from '../alignment';
import TextGenerator from '../text-generator';
// import InsertBefore from '../insert-before';

/**
 * Icons
 */
import { toolbarMoreSettings } from '../../../../icons';

/**
 * Style
 */
import './editor.scss';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Duplicate
 */
const MoreSettings = props => {
	const { clientId, blockName, attributes, onChange } = props;

	// const { breakpoint } = useSelect(select => {
	// 	const { receiveMaxiDeviceType } = select('maxiBlocks');

	// 	const breakpoint = receiveMaxiDeviceType();

	// 	return {
	// 		breakpoint,
	// 	};
	// });

	return (
		<Tooltip
			text={__('More Settings', 'maxi-blocks')}
			position='bottom center'
		>
			<div className='toolbar-item toolbar-item__more-settings'>
				<Dropdown
					className='maxi-moresettings_settings-selector'
					contentClassName='maxi-moresettings_popover'
					position='right bottom'
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
							<CopyPaste
								clientId={clientId}
								blockName={blockName}
							/>
							{blockName === 'maxi-blocks/text-maxi' && (
								<TextGenerator
									clientId={clientId}
									blockName={blockName}
									onChange={onChange}
								/>
							)}
							{blockName === 'maxi-blocks/button-maxi' && (
								<div>
									<PaddingMargin
										clientId={clientId}
										blockName={blockName}
									/>
									<Alignment
										clientId={clientId}
										blockName={blockName}
										// {...getGroupAttributes(attributes, [
										// 	'alignment',
										// 	'textAlignment',
										// ])}
										// onChange={obj => setAttributes(obj)}
										// breakpoint={breakpoint}
									/>
								</div>
							)}
							<ReusableBlocks
								clientId={clientId}
								blockName={blockName}
							/>
							<Delete clientId={clientId} blockName={blockName} />
						</div>
					)}
				/>
			</div>
		</Tooltip>
	);
};

export default MoreSettings;
