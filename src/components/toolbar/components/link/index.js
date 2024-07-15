/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import LinkControl from '../../../link-control';
import ToggleSwitch from '../../../toggle-switch';
import ToolbarContext from '../toolbar-popover/toolbarContext';
import ToolbarPopover from '../toolbar-popover';
import { getGroupAttributes } from '../../../../extensions/styles';
import { LoopContext, getDCLink, getDCValues } from '../../../../extensions/DC';
import DC_LINK_BLOCKS from './dcLinkBlocks';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';
import {
	linkFields,
	multipleLinksTypes,
} from '../../../../extensions/DC/constants';
import SelectControl from '../../../select-control';
import { getLinkTargets } from '../../../../extensions/DC/utils';

const DISABLED_BLOCKS = [
	'maxi-blocks/divider-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/text-maxi',
	'maxi-blocks/list-item-maxi',
	'maxi-blocks/slider-maxi',
];

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
		'dc-status': dcStatus,
		'dc-link-status': dcLinkStatus,
		'dc-link-target': dcLinkTarget,
		'dc-type': dcType,
		'dc-field': dcField,
	} = props;

	const [linkTargetOptions, setLinkTargetOptions] = useState([]);
	const { contextLoop } = useContext(LoopContext) ?? {};
	const { 'cl-status': clStatus, 'cl-type': clType } = contextLoop ?? {};
	const showDCLink = clStatus && DC_LINK_BLOCKS.includes(blockName);
	const showUseDCLink = dcStatus || showDCLink;
	const selectedDCType = dcType ?? clType;

	if (DISABLED_BLOCKS.includes(blockName) && !disableCustomFormats)
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
					!isEmpty(attributes.linkSettings?.url) ||
					(select('core/block-editor').getBlockName(child) ===
						'maxi-blocks/text-maxi' &&
						(attributes.content.includes('<a ') ||
							attributes['dc-content']?.includes('<a ')))
				)
					childHasLink = true;
			});
		}
	}

	useEffect(() => {
		if (dcLinkStatus) {
			setLinkTargetOptions(getLinkTargets(selectedDCType, dcField));
		}
	}, [selectedDCType, dcField, dcLinkStatus]);

	const customTaxonomies = select(
		'maxiBlocks/dynamic-content'
	).getCustomTaxonomies();

	return (
		<div className='toolbar-item toolbar-item__link'>
			<ToolbarPopover
				icon={toolbarLink}
				tooltip={__('Link', 'maxi-blocks')}
				className={
					((!isNil(linkSettings) && !isEmpty(linkSettings.url)) ||
						dcLinkStatus) &&
					'toolbar-item__link--active'
				}
				disabled={childHasLink}
			>
				{!childHasLink && (
					<div className='toolbar-item__link-popover'>
						{showUseDCLink && (
							<>
								<ToggleSwitch
									label={__(
										'Use dynamic content link',
										'maxi-blocks'
									)}
									selected={dcLinkStatus}
									onChange={async value => {
										const url =
											value &&
											(await getDCLink(
												getDCValues(
													getGroupAttributes(
														props,
														'dynamicContent'
													)
												),
												clientId
											));

										onChange(
											value
												? {
														...linkSettings,
														url,
														title: url,
												  }
												: {
														...linkSettings,
														url: null,
														title: null,
												  },
											{
												'dc-link-status': value,
												...(showDCLink && {
													// If DC link is enabled in blocks without DC, that should enable DC for the block
													'dc-status': value,
												}),
											}
										);
									}}
								/>
								{(multipleLinksTypes.includes(selectedDCType) ||
									linkFields.includes(dcField) || customTaxonomies.includes(dcField)) &&
									dcLinkStatus && (
										<SelectControl
											label={__(
												'Link target',
												'maxi-blocks'
											)}
											value={dcLinkTarget}
											options={linkTargetOptions}
											newStyle
											onChange={async value => {
												const url =
													value &&
													(await getDCLink(
														getDCValues(
															getGroupAttributes(
																{
																	...props,
																	'dc-link-target':
																		value,
																},
																'dynamicContent'
															)
														),
														clientId
													));

												onChange(
													{
														...linkSettings,
														url,
														title: url,
													},
													{
														'dc-link-target': value,
													}
												);
											}}
										/>
									)}
							</>
						)}
						<ToolbarContext.Consumer>
							{context => (
								<LinkControl
									linkValue={linkSettings}
									isDCLinkActive={
										showUseDCLink && dcLinkStatus
									}
									onChangeLink={onChange}
									onRemoveLink={() => {
										removeLinkHandle();
										context.onClose();
									}}
								/>
							)}
						</ToolbarContext.Consumer>
					</div>
				)}
			</ToolbarPopover>
		</div>
	);
};

export default Link;
