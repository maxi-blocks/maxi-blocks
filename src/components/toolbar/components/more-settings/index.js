/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
// import { useSelect } from '@wordpress/data';
import { dispatch } from '@wordpress/data';

/**
 * External dependencies
 */
// import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import Dropdown from '../../../dropdown';
import CopyPaste from '../copy-paste';
import ReusableBlocks from '../reusable-blocks';
import Delete from '../delete';
// import PaddingMargin from '../padding-margin';
import Alignment from '../alignment';
import TextGenerator from '../text-generator';
// import InsertBefore from '../insert-before';
import openSidebar from '../../../../extensions/dom';

/**
 * Icons
 */
import { toolbarMoreSettings } from '../../../../icons';

/**
 * Style
 */
import './editor.scss';
// import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Duplicate
 */
const MoreSettings = props => {
	const { clientId, blockName, onChange } = props;

	// const { breakpoint } = useSelect(select => {
	// 	const { receiveMaxiDeviceType } = select('maxiBlocks');

	// 	const breakpoint = receiveMaxiDeviceType();

	// 	return {
	// 		breakpoint,
	// 	};
	// });
	const { openGeneralSidebar } = dispatch('core/edit-post');

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
									{/* <PaddingMargin
										 clientId={clientId}
										 blockName={blockName}
									 /> */}
									<Button
										onClick={() =>
											openGeneralSidebar(
												'edit-post/block'
											).then(() =>
												openSidebar('height width')
											)
										}
									>
										{__('Button width', 'maxi-blocks')}
									</Button>
									<Button
										onClick={() =>
											openGeneralSidebar(
												'edit-post/block'
											).then(() =>
												openSidebar('margin padding')
											)
										}
									>
										{__(
											'Button padding/margin',
											'maxi-blocks'
										)}
									</Button>
									<Alignment
										clientId={clientId}
										blockName={blockName}
										// attributes
										// getGroupAttributes
										// {...getGroupAttributes(attributes, [
										// 	'alignment',
										// 	'textAlignment',
										// ])}
										onChange={onChange}
										// breakpoint
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
