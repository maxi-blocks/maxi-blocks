/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useSelect, dispatch } from '@wordpress/data';

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
import openSidebar from '../../../../extensions/dom';
import { getGroupAttributes } from '../../../../extensions/styles';

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
	const { clientId, blockName, onChange, prefix, attributesMapping } = props;

	const { breakpoint } = useSelect(select => {
		const { receiveMaxiDeviceType } = select('maxiBlocks');

		const breakpoint = receiveMaxiDeviceType();

		return {
			breakpoint,
		};
	});
	const { openGeneralSidebar } = dispatch('core/edit-post');

	return (
		<Tooltip
			text={__('More Settings', 'maxi-blocks')}
			position='bottom center'
		>
			<div className='toolbar-item toolbar-item__more-settings'>
				<Dropdown
					className='maxi-more-settings__settings-selector'
					contentClassName='maxi-more-settings__popover'
					position='right bottom'
					renderToggle={({ onToggle }) => (
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
								prefix={prefix}
								attributesMapping={attributesMapping}
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
								<>
									<Button
										onClick={() =>
											openGeneralSidebar(
												'edit-post/block'
											).then(() =>
												openSidebar('dimension')
											)
										}
									>
										{__('Image dimension', 'maxi-blocks')}
									</Button>
									<Button
										onClick={() =>
											openGeneralSidebar(
												'edit-post/block'
											).then(() => openSidebar('caption'))
										}
									>
										{__('Caption', 'maxi-blocks')}
									</Button>
								</>
							)}
							{(blockName === 'maxi-blocks/svg-icon-maxi' ||
								blockName === 'maxi-blocks/image-maxi') && (
								<>
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
								</>
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
