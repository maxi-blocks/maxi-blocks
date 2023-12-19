/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import Dropdown from '../../../dropdown';
import CopyPaste from '../copy-paste';
import ReusableBlocks from '../reusable-blocks';
import Delete from '../delete';
import Alignment from '../alignment';
import TextGenerator from '../text-generator';
import { getGroupAttributes } from '../../../../extensions/styles';
import { openSidebarAccordion } from '../../../../extensions/inspector';

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
	const { clientId, blockName, onChange, copyPasteMapping, tooltipsHide } =
		props;

	const { breakpoint } = useSelect(select => {
		const { receiveMaxiDeviceType } = select('maxiBlocks');

		const breakpoint = receiveMaxiDeviceType();

		return {
			breakpoint,
		};
	});

	const moreSettingsContent = (
		<div className='toolbar-item toolbar-item__more-settings'>
			<Dropdown
				className='maxi-more-settings__settings-selector'
				contentClassName='maxi-more-settings__popover'
				position='right bottom'
				popoverProps={{
					useShift: true,
				}}
				renderToggle={({ onToggle }) => (
					<Button onClick={onToggle}>
						<Icon
							className='toolbar-item__icon'
							icon={toolbarMoreSettings}
						/>
					</Button>
				)}
				renderContent={args => (
					<div>
						<CopyPaste
							blockName={blockName}
							clientId={clientId}
							closeMoreSettings={args.onClose}
							copyPasteMapping={copyPasteMapping}
						/>
						{blockName === 'maxi-blocks/text-maxi' && (
							<TextGenerator
								onChange={onChange}
								closeMoreSettings={args.onClose}
							/>
						)}
						{blockName === 'maxi-blocks/button-maxi' && (
							<div>
								<Button
									onClick={() => {
										openSidebarAccordion(0, 'height width');
									}}
								>
									{__('Button width', 'maxi-blocks')}
								</Button>
								<Button
									onClick={() => {
										openSidebarAccordion(
											0,
											'margin padding'
										);
									}}
								>
									{__('Button padding/margin', 'maxi-blocks')}
								</Button>
								<Alignment
									clientId={clientId}
									blockName={blockName}
									getGroupAttributes
									{...getGroupAttributes(props, [
										'alignment',
										'textAlignment',
									])}
									onChange={onChange}
									breakpoint={breakpoint}
								/>
							</div>
						)}
						{blockName === 'maxi-blocks/image-maxi' && (
							<Button
								onClick={() => {
									openSidebarAccordion(0, 'caption');
								}}
							>
								{__('Caption', 'maxi-blocks')}
							</Button>
						)}
						{(blockName === 'maxi-blocks/svg-icon-maxi' ||
							blockName === 'maxi-blocks/image-maxi') && (
							<Alignment
								clientId={clientId}
								blockName={blockName}
								getGroupAttributes
								{...getGroupAttributes(props, [
									'alignment',
									'textAlignment',
								])}
								onChange={onChange}
								breakpoint={breakpoint}
							/>
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
	);
	return tooltipsHide ? (
		moreSettingsContent
	) : (
		<Tooltip text={__('More', 'maxi-blocks')} placement='top center'>
			{moreSettingsContent}
		</Tooltip>
	);
};

export default MoreSettings;
