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
import {
	getGroupAttributes,
	paletteAttributesCreator,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';

/**
 * Component
 */
const WRAPPER_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi',
];
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const CopyPasteContent = props => {
	const { clientId, blockName, copyPasteMapping, prefix } = props;

	const [isOpen, setIsOpen] = useState(false);
	const [specialPaste, setSpecialPaste] = useState({
		settings: [],
		canvas: [],
		advanced: [],
	});

	const orderAlphabetically = (obj, property) => {
		if (isEmpty(obj)) return {};

		const orderedKeys = Object.keys(obj).sort((a, b) =>
			obj[a][property].localeCompare(obj[b][property])
		);
		const response = {};
		orderedKeys.forEach(key => {
			response[key] = obj[key];
		});

		return response;
	};

	const getOrganizedAttributes = attributes => {
		const response = {};
		const settingTabs = ['settings', 'canvas', 'advanced'];

		settingTabs.forEach(tab => {
			if (copyPasteMapping[tab]) {
				response[tab] = {};
				if (copyPasteMapping[tab].blockSpecific)
					Object.entries(copyPasteMapping[tab].blockSpecific).forEach(
						([attrType, label]) => {
							if (
								typeof copyPasteMapping[tab].blockSpecific[
									attrType
								] === 'object' &&
								!copyPasteMapping[tab].blockSpecific[attrType]
									.groupLabel
							) {
								const attr = {};

								copyPasteMapping[tab].blockSpecific[
									attrType
								].value.forEach(val => {
									if (!isNil(attributes[val]))
										attr[val] = attributes[val];
								});

								if (
									(typeof attr !== 'object' &&
										!isNil(attr)) ||
									!isEmpty(attr)
								)
									response[tab][attrType] = {
										label: copyPasteMapping[tab]
											.blockSpecific[attrType].label,
										attribute: attr,
									};
							} else if (
								(typeof attributes[attrType] !== 'object' &&
									!isNil(attributes[attrType])) ||
								!isEmpty(attributes[attrType])
							)
								response[tab][attrType] = {
									label,
									attribute: {
										[attrType]: attributes[attrType],
									},
								};
						}
					);

				if (copyPasteMapping[tab].withBreakpoint)
					Object.entries(
						copyPasteMapping[tab].withBreakpoint
					).forEach(([attrType, label]) => {
						const withBrkpt = [];

						breakpoints.forEach(breakpoint =>
							withBrkpt.push(`${attrType}-${breakpoint}`)
						);
						const resp = {};
						withBrkpt.forEach(att => {
							if (
								(typeof attributes[att] !== 'object' &&
									!isNil(attributes[att])) ||
								!isEmpty(attributes[att])
							)
								resp[att] = attributes[att];
						});
						if (!isEmpty(resp))
							response[tab][attrType] = {
								label,
								attribute: resp,
							};
					});

				if (copyPasteMapping[tab].withPalette)
					Object.entries(copyPasteMapping[tab].withPalette).forEach(
						([attrType, label]) => {
							const withPalette = paletteAttributesCreator({
								prefix: attrType,
							});
							const resp = {};
							Object.keys(withPalette).forEach(att => {
								if (
									(typeof attributes[att] !== 'object' &&
										!isNil(attributes[att])) ||
									!isEmpty(attributes[att])
								)
									resp[att] = attributes[att];
							});

							if (!isEmpty(resp))
								response[tab][attrType] = {
									label,
									attribute: resp,
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
					Object.entries(
						copyPasteMapping[tab].withPrefixHover
					).forEach(([attrType, label]) => {
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
					});

				if (copyPasteMapping[tab].withoutPrefix)
					Object.entries(copyPasteMapping[tab].withoutPrefix).forEach(
						([attrType, val]) => {
							if (typeof val === 'object' && val.groupLabel) {
								response[tab][attrType] = {
									label: val.groupLabel,
									group: {},
								};
								Object.entries(val.props).forEach(
									([prop, label]) => {
										const obj = getGroupAttributes(
											attributes,
											prop,
											false,
											'',
											true
										);
										if (!isEmpty(obj))
											response[tab][attrType].group[
												prop
											] = {
												label,
												attribute: obj,
											};
									}
								);
							} else {
								const obj = getGroupAttributes(
									attributes,
									attrType,
									false,
									'',
									true
								);
								if (!isEmpty(obj))
									response[tab][attrType] = {
										label: val,
										attribute: obj,
									};
							}
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
			}

			response[tab] = orderAlphabetically(response[tab], 'label');
		});

		return response;
	};

	const cleanStyleAttributes = attributes => {
		let response = {};
		const settingTabs = ['settings', 'canvas', 'advanced'];

		settingTabs.forEach(tab => {
			if (copyPasteMapping[tab]) {
				if (copyPasteMapping[tab].blockSpecific)
					Object.keys(copyPasteMapping[tab].blockSpecific).forEach(
						attrType => {
							if (
								typeof copyPasteMapping[tab].blockSpecific[
									attrType
								] === 'object' &&
								!copyPasteMapping[tab].blockSpecific[attrType]
									.groupLabel
							)
								copyPasteMapping[tab].blockSpecific[
									attrType
								].value.forEach(val => {
									if (
										(typeof attributes[val] !== 'object' &&
											!isNil(attributes[val])) ||
										!isEmpty(attributes[val])
									)
										response = {
											...response,
											[val]: attributes[val],
										};
								});
							else if (
								(typeof attributes[attrType] !== 'object' &&
									!isNil(attributes[attrType])) ||
								!isEmpty(attributes[attrType])
							)
								response = {
									...response,
									[attrType]: attributes[attrType],
								};
						}
					);

				if (copyPasteMapping[tab].withBreakpoint)
					Object.keys(copyPasteMapping[tab].withBreakpoint).forEach(
						typeAttr => {
							const withBrkpt = [];

							breakpoints.forEach(breakpoint =>
								withBrkpt.push(`${typeAttr}-${breakpoint}`)
							);

							withBrkpt.forEach(att => {
								if (
									(typeof attributes[att] !== 'object' &&
										!isNil(attributes[att])) ||
									!isEmpty(attributes[att])
								)
									response = {
										...response,
										[att]: attributes[att],
									};
							});
						}
					);

				if (copyPasteMapping[tab].withPalette)
					Object.keys(copyPasteMapping[tab].withPalette).forEach(
						typeAttr => {
							const withPalette = paletteAttributesCreator({
								prefix: typeAttr,
							});

							Object.keys(withPalette).forEach(att => {
								if (
									(typeof attributes[att] !== 'object' &&
										!isNil(attributes[att])) ||
									!isEmpty(attributes[att])
								)
									response = {
										...response,
										[att]: attributes[att],
									};
							});
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
							if (
								typeof copyPasteMapping[tab].withoutPrefix[
									typeAttr
								] === 'object' &&
								copyPasteMapping[tab].withoutPrefix[typeAttr]
									.groupLabel
							)
								Object.keys(
									copyPasteMapping[tab].withoutPrefix[
										typeAttr
									].props
								).forEach(prop => {
									response = {
										...response,
										...getGroupAttributes(
											attributes,
											prop,
											false,
											'',
											true
										),
									};
								});
							else
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
					Object.keys(
						copyPasteMapping[tab].withoutPrefixHover
					).forEach(typeAttr => {
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
					});
			}
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

	const handleSpecialPaste = (attr, tab, checked) => {
		const specPaste = { ...specialPaste };
		if (!Array.isArray(attr)) {
			specPaste[tab] = specialPaste[tab].includes(attr)
				? specPaste[tab].filter(val => val !== attr)
				: [...specPaste[tab], attr];
		} else {
			attr.forEach(attrType => {
				specPaste[tab] = specPaste[tab].filter(val => val !== attrType);
				if (checked) specPaste[tab] = [...specPaste[tab], attrType];
			});
		}
		setSpecialPaste(specPaste);
	};

	const onSpecialPaste = () => {
		let res = {};

		Object.keys(organizedAttributes).forEach(tab => {
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

	const checkNestedCheckboxes = (attrType, tab, checked) => {
		handleSpecialPaste(
			Object.keys(organizedAttributes[tab][attrType].group),
			tab,
			checked
		);
	};

	const getTabItems = () => {
		const response = [];
		Object.keys(organizedAttributes).forEach(tab => {
			const option = {
				label: __(
					`${tab.charAt(0).toUpperCase()}${tab.slice(1)}`,
					'maxi-blocks'
				),
				content:
					!isNil(organizedAttributes[tab]) &&
					!isEmpty(organizedAttributes[tab]) &&
					Object.keys(organizedAttributes[tab]).map((attrType, i) => {
						if (!organizedAttributes[tab][attrType].group)
							return (
								<div
									className='toolbar-item__copy-paste__popover__item'
									key={`copy-paste-${tab}-${attrType}`}
								>
									<label
										htmlFor={attrType}
										className='maxi-axis-control__content__item__checkbox'
									>
										<input
											type='checkbox'
											name={attrType}
											id={attrType}
											checked={specialPaste[tab].includes(
												attrType
											)}
											onClick={() =>
												handleSpecialPaste(
													attrType,
													tab
												)
											}
										/>
										<span>
											{
												organizedAttributes[tab][
													attrType
												].label
											}
										</span>
									</label>
								</div>
							);

						const nestedCheckBoxes = Object.keys(
							organizedAttributes[tab][attrType].group
						).map((attr, i) => {
							return (
								<li>
									<div
										className='toolbar-item__copy-paste__popover__item'
										key={`copy-paste-${tab}-${attr}`}
									>
										<label
											htmlFor={attr}
											className='maxi-axis-control__content__item__checkbox'
										>
											<input
												type='checkbox'
												name={attr}
												id={attr}
												checked={specialPaste[
													tab
												].includes(attr)}
												onChange={() =>
													handleSpecialPaste(
														attr,
														tab
													)
												}
											/>
											<span>
												{
													organizedAttributes[tab][
														attrType
													].group[attr].label
												}
											</span>
										</label>
									</div>
								</li>
							);
						});

						const groupCheckBox = (
							<div
								className='toolbar-item__copy-paste__popover__item'
								key={`copy-paste-${tab}-${attrType}`}
							>
								<label
									htmlFor={attrType}
									className='maxi-axis-control__content__item__checkbox'
								>
									<input
										type='checkbox'
										name={attrType}
										id={attrType}
										onClick={e =>
											checkNestedCheckboxes(
												attrType,
												tab,
												e.target.checked
											)
										}
									/>
									<span>
										{
											organizedAttributes[tab][attrType]
												.label
										}
									</span>
								</label>
							</div>
						);

						return (
							<>
								{groupCheckBox}
								<ul>{nestedCheckBoxes}</ul>
							</>
						);
					}),
			};

			if (option.content) response.push(option);
		});

		return response;
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
								items={getTabItems()}
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
