/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { useContext, useEffect, useMemo, useState } from '@wordpress/element';

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
import { toolbarLink } from '../../../../icons';
import {
	linkFields,
	multipleLinksTypes,
} from '../../../../extensions/DC/constants';
import SelectControl from '../../../select-control';
import { getLinkTargets } from '../../../../extensions/DC/utils';
import InfoBox from '../../../info-box';
import { getBlockData } from '../../../../extensions/attributes';

/**
 * External dependencies
 */
import { isNil, isEmpty, capitalize } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';

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
	const { linkElements, linkElementOptions } = useMemo(() => {
		const linkElements = getBlockData(blockName)?.linkElements;
		const linkElementOptions = linkElements?.map(element => ({
			label: capitalize(element),
			value: element,
		}));

		return {
			linkElements,
			linkElementOptions,
		};
	}, [blockName]);
	const showLinkElemetSelect = !!linkElements;

	useEffect(() => {
		if (dcLinkStatus) {
			setLinkTargetOptions(getLinkTargets(selectedDCType, dcField));
		}
	}, [selectedDCType, dcField, dcLinkStatus]);

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
									linkFields.includes(dcField) ||
									customTaxonomies.includes(dcField)) &&
									dcLinkStatus && (
										<>
											<SelectControl
												__nextHasNoMarginBottom
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
															'dc-link-target':
																value,
														}
													);
												}}
											/>
											{dcLinkTarget ===
												'author_email' && (
												<InfoBox
													className='toolbar-item__link-warning'
													message={__(
														'Warning: To protect your privacy, we obfuscate email addresses to make them harder for bots to scrape and use for spam. However, advanced bots may still retrieve them. For better security, use contact forms or CAPTCHA to avoid publicly displaying your email.',
														'maxi-blocks'
													)}
												/>
											)}
										</>
									)}
							</>
						)}
						{showLinkElemetSelect && (
							<SelectControl
								label={__('Apply link on', 'maxi-blocks')}
								value={linkSettings?.linkElement}
								options={linkElementOptions}
								newStyle
								onChange={value => {
									onChange({
										...linkSettings,
										linkElement: value,
									});
								}}
							/>
						)}
						<ToolbarContext.Consumer>
							{context => (
								<LinkControl
									linkValue={linkSettings}
									isDCLinkActive={
										showUseDCLink && dcLinkStatus
									}
									disableOpenInNewTab={
										showUseDCLink &&
										dcLinkStatus &&
										['author_email'].includes(dcLinkTarget)
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
