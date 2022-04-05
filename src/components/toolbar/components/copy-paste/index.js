/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Dropdown from '../../../dropdown';
import { SettingTabsControl } from '../../../../components';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Component
 */
const WRAPPER_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi',
];

const CopyPasteContent = props => {
	const { clientId, blockName, copyPasteMapping, prefix } = props;

	const [isOpen, setIsOpen] = useState(false);
	const [specialPaste, setSpecialPaste] = useState({
		settings: [],
		canvas: [],
		advanced: [],
	});

	const getOrganizedAttributes = attributes => {
		const response = {};
		const settingTabs = ['settings', 'canvas', 'advanced'];
		settingTabs.forEach(tab => {
			response[tab] = {};
			if (copyPasteMapping[tab].blockSpecific)
				Object.entries(copyPasteMapping[tab].blockSpecific).forEach(
					([attrType, label]) => {
						if (
							typeof copyPasteMapping[tab].blockSpecific[
								attrType
							] !== 'string'
						) {
							const attr = {};

							copyPasteMapping[tab].blockSpecific[
								attrType
							].value.forEach(val => {
								if (!isEmpty(attributes[val]))
									attr[val] = attributes[val];
							});

							if (!isEmpty(attr))
								response[tab][attrType] = {
									label: copyPasteMapping[tab].blockSpecific[
										attrType
									].label,
									attribute: attr,
								};
						} else if (!isEmpty(attributes[attrType]))
							response[tab][attrType] = {
								label,
								attribute: {
									[attrType]: attributes[attrType],
								},
							};
					}
				);

			if (copyPasteMapping[tab].withPrefix)
				Object.entries(copyPasteMapping[tab].withPrefix).forEach(
					([attrType, label]) => {
						const obj = getGroupAttributes(
							attributes,
							attrType,
							false,
							prefix,
							true
						);
						if (!isEmpty(obj))
							response[tab][attrType] = {
								label,
								attribute: obj,
							};
					}
				);

			if (copyPasteMapping[tab].withPrefixHover)
				Object.entries(copyPasteMapping[tab].withPrefixHover).forEach(
					([attrType, label]) => {
						const obj = getGroupAttributes(
							attributes,
							attrType,
							true,
							prefix,
							true
						);
						if (!isEmpty(obj))
							response[tab][attrType] = {
								label,
								attribute: obj,
							};
					}
				);

			if (copyPasteMapping[tab].withoutPrefix)
				Object.entries(copyPasteMapping[tab].withoutPrefix).forEach(
					([attrType, label]) => {
						const obj = getGroupAttributes(
							attributes,
							attrType,
							false,
							'',
							true
						);
						if (!isEmpty(obj))
							response[tab][attrType] = {
								label,
								attribute: obj,
							};
					}
				);

			if (copyPasteMapping[tab].withoutPrefixHover)
				Object.entries(
					copyPasteMapping[tab].withoutPrefixHover
				).forEach(([attrType, label]) => {
					const obj = getGroupAttributes(
						attributes,
						attrType,
						true,
						'',
						true
					);
					if (!isEmpty(obj))
						response[tab][attrType] = {
							label,
							attribute: obj,
						};
				});
		});

		return response;
	};

	const cleanStyleAttributes = attributes => {
		let response = {};
		const settingTabs = ['settings', 'canvas', 'advanced'];

		settingTabs.forEach(tab => {
			if (copyPasteMapping[tab].blockSpecific)
				Object.keys(copyPasteMapping[tab].blockSpecific).forEach(
					attrType => {
						if (
							typeof copyPasteMapping[tab].blockSpecific[
								attrType
							] !== 'string'
						)
							copyPasteMapping[tab].blockSpecific[
								attrType
							].value.forEach(val => {
								if (!isNil(attributes[val]))
									response = {
										...response,
										[val]: attributes[val],
									};
							});
						else if (!isNil(attributes[attrType]))
							response = {
								...response,
								[attrType]: attributes[attrType],
							};
					}
				);

			if (copyPasteMapping[tab].withPrefix)
				Object.keys(copyPasteMapping[tab].withPrefix).forEach(
					typeAttr => {
						response = {
							...response,
							...getGroupAttributes(
								attributes,
								typeAttr,
								false,
								prefix,
								true
							),
						};
					}
				);

			if (copyPasteMapping[tab].withPrefixHover)
				Object.keys(copyPasteMapping[tab].withPrefixHover).forEach(
					typeAttr => {
						response = {
							...response,
							...getGroupAttributes(
								attributes,
								typeAttr,
								true,
								prefix,
								true
							),
						};
					}
				);

			if (copyPasteMapping[tab].withoutPrefix)
				Object.keys(copyPasteMapping[tab].withoutPrefix).forEach(
					typeAttr => {
						response = {
							...response,
							...getGroupAttributes(
								attributes,
								typeAttr,
								false,
								'',
								true
							),
						};
					}
				);

			if (copyPasteMapping[tab].withoutPrefixHover)
				Object.keys(copyPasteMapping[tab].withoutPrefixHover).forEach(
					typeAttr => {
						response = {
							...response,
							...getGroupAttributes(
								attributes,
								typeAttr,
								true,
								'',
								true
							),
						};
					}
				);
		});

		return response;
	};

	const {
		blockAttributes,
		organizedAttributes,
		copiedStyles,
		copiedBlocks,
		innerBlocks,
		hasInnerBlocks,
	} = useSelect(select => {
		const { receiveCopiedStyles, receiveCopiedBlocks } =
			select('maxiBlocks');
		const { getBlock } = select('core/block-editor');

		const copiedStyles = receiveCopiedStyles();
		const copiedBlocks = receiveCopiedBlocks();

		const organizedAttributes =
			(copiedStyles && getOrganizedAttributes(copiedStyles)) || {};

		const blockValues = getBlock(clientId);
		const blockAttributes = cleanStyleAttributes(blockValues.attributes);
		const { innerBlocks } = blockValues;
		const hasInnerBlocks = !isEmpty(innerBlocks);

		return {
			blockAttributes,
			organizedAttributes,
			copiedStyles,
			copiedBlocks,
			innerBlocks,
			hasInnerBlocks,
		};
	});

	const cleanInnerBlocks = innerBlocks => {
		const test = innerBlocks.map(block => {
			block.innerBlocks = cleanInnerBlocks(block.innerBlocks);

			return cloneBlock(block);
		});

		return test;
	};

	const { copyStyles, copyNestedBlocks } = useDispatch('maxiBlocks');
	const { updateBlockAttributes, replaceInnerBlocks } =
		useDispatch('core/block-editor');

	const onCopyStyles = () => copyStyles(blockAttributes);
	const onPasteStyles = () => updateBlockAttributes(clientId, copiedStyles);

	const onCopyBlocks = () => copyNestedBlocks(innerBlocks);
	const onPasteBlocks = () =>
		replaceInnerBlocks(clientId, cleanInnerBlocks(copiedBlocks));

	const handleSpecialPaste = (attr, tab) => {
		const newSpecialPaste = specialPaste[tab].includes(attr)
			? specialPaste[tab].filter(item => {
					return item !== attr;
			  })
			: [...specialPaste[tab], attr];

		setSpecialPaste({ ...specialPaste, [tab]: newSpecialPaste });
	};

	const onSpecialPaste = () => {
		let res = {};
		const tabs = ['settings', 'canvas', 'advanced'];

		tabs.forEach(tab => {
			Object.entries(organizedAttributes[tab]).forEach(([key, val]) => {
				const isSelected = specialPaste[tab].some(
					label => label === key
				);

				if (isSelected) res = { ...res, ...val.attribute };
			});
		});
		setSpecialPaste({
			settings: [],
			canvas: [],
			advanced: [],
		});
		updateBlockAttributes(clientId, res);
	};

	return (
		<div className='toolbar-item__copy-paste__popover'>
			<Button
				className='toolbar-item__copy-paste__popover__button'
				onClick={onCopyStyles}
			>
				{__('Copy Style', 'maxi-blocks')}
			</Button>
			<Button
				className='toolbar-item__copy-paste__popover__button'
				onClick={onPasteStyles}
				disabled={isEmpty(copiedStyles)}
			>
				{__('Paste Style', 'maxi-blocks')}
			</Button>
			{(!isEmpty(organizedAttributes.settings) ||
				!isEmpty(organizedAttributes.canvas) ||
				!isEmpty(organizedAttributes.advanced)) && (
				<>
					<Button
						className='toolbar-item__copy-paste__popover__button'
						onClick={() => setIsOpen(!isOpen)}
					>
						{__('Special Paste', 'maxi-blocks')}
					</Button>
					{isOpen && (
						<form>
							<SettingTabsControl
								target='sidebar-settings-tabs'
								disablePadding
								depth={0}
								items={[
									{
										label: __('Settings', 'maxi-blocks'),
										content:
											!isNil(
												organizedAttributes.settings
											) &&
											!isEmpty(
												organizedAttributes.settings
											) &&
											Object.keys(
												organizedAttributes.settings
											).map((attrType, i) => {
												return (
													<div
														className='toolbar-item__copy-paste__popover__item'
														key={`copy-paste-settings-${attrType}`}
													>
														<label
															htmlFor={attrType}
															className='maxi-axis-control__content__item__checkbox'
														>
															<input
																type='checkbox'
																name={attrType}
																id={attrType}
																checked={specialPaste.settings.includes(
																	attrType
																)}
																onClick={() =>
																	handleSpecialPaste(
																		attrType,
																		'settings'
																	)
																}
															/>
															<span>
																{
																	organizedAttributes
																		.settings[
																		attrType
																	].label
																}
															</span>
														</label>
													</div>
												);
											}),
									},
									{
										label: __('Canvas', 'maxi_blocks'),
										content:
											!isNil(
												organizedAttributes.canvas
											) &&
											!isEmpty(
												organizedAttributes.canvas
											) &&
											Object.keys(
												organizedAttributes.canvas
											).map((attrType, i) => {
												return (
													<div
														className='toolbar-item__copy-paste__popover__item'
														key={`copy-paste-canvas-${attrType}`}
													>
														<label
															htmlFor={attrType}
															className='maxi-axis-control__content__item__checkbox'
														>
															<input
																type='checkbox'
																name={attrType}
																id={attrType}
																checked={specialPaste.canvas.includes(
																	attrType
																)}
																onClick={() =>
																	handleSpecialPaste(
																		attrType,
																		'canvas'
																	)
																}
															/>
															<span>
																{
																	organizedAttributes
																		.canvas[
																		attrType
																	].label
																}
															</span>
														</label>
													</div>
												);
											}),
									},
									{
										label: __('Advanced', 'maxi_blocks'),
										content:
											!isNil(
												organizedAttributes.advanced
											) &&
											!isEmpty(
												organizedAttributes.advanced
											) &&
											Object.keys(
												organizedAttributes.advanced
											).map((attrType, i) => {
												return (
													<div
														className='toolbar-item__copy-paste__popover__item'
														key={`copy-paste-advanced-${attrType}`}
													>
														<label
															htmlFor={attrType}
															className='maxi-axis-control__content__item__checkbox'
														>
															<input
																type='checkbox'
																name={attrType}
																id={attrType}
																checked={specialPaste.advanced.includes(
																	attrType
																)}
																onClick={() =>
																	handleSpecialPaste(
																		attrType,
																		'advanced'
																	)
																}
															/>
															<span>
																{
																	organizedAttributes
																		.advanced[
																		attrType
																	].label
																}
															</span>
														</label>
													</div>
												);
											}),
									},
								]}
							/>
							<Button
								className='toolbar-item__copy-paste__popover__button toolbar-item__copy-paste__popover__button--special'
								onClick={onSpecialPaste}
							>
								{__('Paste Special Style', 'maxi-blocks')}
							</Button>
						</form>
					)}
				</>
			)}
			{hasInnerBlocks && (
				<Button
					className='toolbar-item__copy-paste__popover__button toolbar-item__copy-nested-block__popover__button'
					onClick={onCopyBlocks}
				>
					{__('Copy Nested Blocks', 'maxi-blocks')}
				</Button>
			)}
			{WRAPPER_BLOCKS.includes(blockName) && (
				<Button
					className='toolbar-item__copy-paste__popover__button'
					onClick={onPasteBlocks}
					disabled={isEmpty(copiedBlocks)}
				>
					{__('Paste Nested Blocks', 'maxi-blocks')}
				</Button>
			)}
		</div>
	);
};

const CopyPaste = props => (
	<Dropdown
		className='maxi-copypaste__copy-selector'
		contentClassName='maxi-more-settings__popover maxi-dropdown__child-content'
		position='bottom right'
		renderToggle={({ isOpen, onToggle }) => (
			<Button onClick={onToggle} text='Copy'>
				{__('Copy / Paste', 'maxi-blocks')}
			</Button>
		)}
		renderContent={() => <CopyPasteContent {...props} />}
	/>
);

export default CopyPaste;
