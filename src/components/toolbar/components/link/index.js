/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import ToolbarPopover from '../toolbar-popover';
import ToolbarContext from '../toolbar-popover/toolbarContext';
import ToggleSwitch from '../../../toggle-switch';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = props => {
	const {
		blockName,
		onChange,
		linkSettings,
		clientId,
		disableCustomFormats = false,
		'dc.s': dcStatus,
		'dc_l.s': dcLinkStatus,
	} = props;

	if (
		(blockName === 'maxi-blocks/divider-maxi' ||
			blockName === 'maxi-blocks/accordion-maxi' ||
			blockName === 'maxi-blocks/text-maxi' ||
			blockName === 'maxi-blocks/slider-maxi') &&
		!disableCustomFormats
	)
		return null;

	const removeLinkHandle = () => {
		onChange({
			url: '',
		});
	};
	let childHasLink = false;
	if (linkSettings?.disabled) childHasLink = true;
	else {
		const children = select('core/block-editor').getClientIdsOfDescendants([
			clientId,
		]);

		if (children?.length) {
			children.forEach(child => {
				const attributes =
					select('core/block-editor').getBlockAttributes(child);

				if (
					!isEmpty(attributes._lse?.url) ||
					(select('core/block-editor').getBlockName(child) ===
						'maxi-blocks/text-maxi' &&
						attributes._c.includes('<a '))
				)
					childHasLink = true;
			});
		}
	}

	return (
		<div className='toolbar-item toolbar-item__link'>
			<ToolbarPopover
				icon={toolbarLink}
				tooltip={__('Link', 'maxi-blocks')}
				className={
					!isNil(linkSettings) &&
					!isEmpty(linkSettings.url) &&
					'toolbar-item__link--active'
				}
				disabled={childHasLink}
			>
				{!childHasLink && (
					<>
						{dcStatus && (
							<ToggleSwitch
								label={__(
									'Use dynamic content link',
									'maxi-blocks'
								)}
								selected={dcLinkStatus}
								onChange={value => {
									onChange(linkSettings, {
										'dc_l.s': value,
									});
								}}
							/>
						)}
						<LinkControl
							searchInputPlaceholder='Search or type URL'
							value={linkSettings}
							onChange={value => {
								onChange(value);
							}}
							settings={[
								{
									id: 'opensInNewTab',
									title: __('Open in new tab', 'maxi-blocks'),
								},
								{
									id: 'noFollow',
									title: __('"nofollow"', 'maxi-blocks'),
								},
								{
									id: 'sponsored',
									title: __('"sponsored"', 'maxi-blocks'),
								},
								{
									id: 'ugc',
									title: __('"UGC"', 'maxi-blocks'),
								},
							]}
						/>
						{!isNil(linkSettings) && !isEmpty(linkSettings.url) && (
							<ToolbarContext.Consumer>
								{context => (
									<Button
										className='toolbar-popover-link-destroyer'
										onClick={() => {
											removeLinkHandle();
											context.onClose();
										}}
									>
										{__('Remove link', 'maxi-blocks')}
									</Button>
								)}
							</ToolbarContext.Consumer>
						)}
					</>
				)}
			</ToolbarPopover>
		</div>
	);
};

export default Link;
