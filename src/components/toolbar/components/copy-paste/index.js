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
	const { clientId, blockName, copyPasteMapping, prefix, closeMoreSettings } =
		props;

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

				['blockSpecific', 'withBreakpoint', 'withPalette'].forEach(
					type => {
						if (copyPasteMapping[tab][type])
							Object.entries(copyPasteMapping[tab][type]).forEach(
								([attrType, attrContent]) => {
									if (
										typeof attrContent === 'object' &&
										attrContent.groupLabel
									) {
										const groupObj = {
											label: attrContent.groupLabel,
											group: {},
										};

										Object.entries(
											attrContent.props
										).forEach(([prop, label]) => {
											let attrArray = [];

											attrArray = [prop];

											if (type === 'withBreakpoint') {
												const newArray = [...attrArray];
												attrArray = [];
												newArray.forEach(a => {
													const withBrkpt = [];

													breakpoints.forEach(
														breakpoint =>
															withBrkpt.push(
																`${a}-${breakpoint}`
															)
													);
													attrArray =
														attrArray.concat(
															withBrkpt
														);
												});
											}

											if (type === 'withPalette') {
												const newArray = [...attrArray];
												attrArray = [];
												newArray.forEach(a => {
													const withPalette =
														paletteAttributesCreator(
															{
																prefix: a,
															}
														);
													attrArray =
														attrArray.concat(
															Object.keys(
																withPalette
															)
														);
												});
											}

											const resp = {};

											attrArray.forEach(attr => {
												if (
													(typeof attributes[attr] !==
														'object' &&
														!isNil(
															attributes[attr]
														)) ||
													!isEmpty(attributes[attr])
												)
													resp[attr] =
														attributes[attr];
											});

											if (!isEmpty(resp))
												groupObj.group[prop] = {
													label,
													attribute: resp,
												};
										});
										if (!isEmpty(groupObj.group))
											response[tab][attrType] = groupObj;
									} else {
										let attrArray = [];

										if (
											typeof attrContent === 'object' &&
											attrContent.value
										)
											attrArray = [...attrContent.value];
										else attrArray = [attrType];

										if (type === 'withBreakpoint') {
											const newArray = [...attrArray];
											attrArray = [];
											newArray.forEach(a => {
												const withBrkpt = [];

												breakpoints.forEach(
													breakpoint =>
														withBrkpt.push(
															`${a}-${breakpoint}`
														)
												);
												attrArray =
													attrArray.concat(withBrkpt);
											});
										}

										if (type === 'withPalette') {
											const newArray = [...attrArray];
											attrArray = [];
											newArray.forEach(a => {
												const withPalette =
													paletteAttributesCreator({
														prefix: a,
													});
												attrArray = attrArray.concat(
													Object.keys(withPalette)
												);
											});
										}
										const resp = {};
										attrArray.forEach(attr => {
											if (
												(typeof attributes[attr] !==
													'object' &&
													!isNil(attributes[attr])) ||
												!isEmpty(attributes[attr])
											)
												resp[attr] = attributes[attr];
										});
										if (!isEmpty(resp))
											response[tab][attrType] = {
												label:
													typeof attrContent ===
													'string'
														? attrContent
														: attrContent.label,
												attribute: resp,
											};
									}
								}
							);
					}
				);

				[
					'withPrefix',
					'withPrefixHover',
					'withoutPrefix',
					'withoutPrefixHover',
				].forEach(type => {
					if (copyPasteMapping[tab][type])
						Object.entries(copyPasteMapping[tab][type]).forEach(
							([attrType, attrContent]) => {
								if (
									typeof attrContent === 'object' &&
									attrContent.groupLabel
								) {
									const groupObj = {
										label: attrContent.groupLabel,
										group: {},
									};

									Object.entries(attrContent.props).forEach(
										([prop, label]) => {
											const resp = getGroupAttributes(
												attributes,
												prop,
												type === 'withPrefixHover' ||
													type ===
														'withoutPrefixHover',
												type === 'withPrefix' ||
													type === 'withPrefixHover'
													? prefix
													: '',
												true
											);

											if (!isEmpty(resp))
												groupObj.group[prop] = {
													label,
													attribute: resp,
												};
										}
									);
									if (!isEmpty(groupObj.group))
										response[tab][attrType] = groupObj;
								} else if (typeof attrContent === 'string') {
									const resp = getGroupAttributes(
										attributes,
										attrType,
										type === 'withPrefixHover' ||
											type === 'withoutPrefixHover',
										type === 'withPrefix' ||
											type === 'withPrefixHover'
											? prefix
											: '',
										true
									);

									if (!isEmpty(resp))
										response[tab][attrType] = {
											label: attrContent,
											attribute: resp,
										};
								}
							}
						);
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
				['blockSpecific', 'withBreakpoint', 'withPalette'].forEach(
					type => {
						if (copyPasteMapping[tab][type])
							Object.entries(copyPasteMapping[tab][type]).forEach(
								([attrType, attr]) => {
									let attrArray = [];

									if (
										typeof attr === 'object' &&
										!attr.groupLabel
									)
										attrArray = [...attr.value];
									else if (
										typeof attr === 'object' &&
										attr.groupLabel
									)
										attrArray = [
											...Object.keys(attr.props),
										];
									else if (typeof attr === 'string')
										attrArray.push(attrType);

									if (type === 'withBreakpoint') {
										const newArray = [...attrArray];
										attrArray = [];
										newArray.forEach(a => {
											const withBrkpt = [];

											breakpoints.forEach(breakpoint =>
												withBrkpt.push(
													`${a}-${breakpoint}`
												)
											);
											attrArray =
												attrArray.concat(withBrkpt);
										});
									}

									if (type === 'withPalette') {
										const newArray = [...attrArray];
										attrArray = [];
										newArray.forEach(a => {
											const withPalette =
												paletteAttributesCreator({
													prefix: a,
												});
											attrArray = attrArray.concat(
												Object.keys(withPalette)
											);
										});
									}

									attrArray.forEach(a => {
										if (
											(typeof attributes[a] !==
												'object' &&
												!isNil(attributes[a])) ||
											!isEmpty(attributes[a])
										)
											response = {
												...response,
												[a]: attributes[a],
											};
									});
								}
							);
					}
				);

				[
					'withPrefix',
					'withPrefixHover',
					'withoutPrefix',
					'withoutPrefixHover',
				].forEach(type => {
					if (copyPasteMapping[tab][type])
						Object.entries(copyPasteMapping[tab][type]).forEach(
							([attrType, attr]) => {
								let attrArray = [];
								if (typeof attr === 'object' && attr.groupLabel)
									attrArray = Object.keys(attr.props);
								else attrArray = [attrType];
								attrArray.forEach(prop => {
									response = {
										...response,
										...getGroupAttributes(
											attributes,
											prop,
											type === 'withPrefixHover' ||
												type === 'withoutPrefixHover',
											type === 'withPrefix' ||
												type === 'withPrefixHover'
												? prefix
												: '',
											true
										),
									};
								});
							}
						);
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

	const onCopyStyles = () => {
		closeMoreSettings();
		copyStyles(blockAttributes);
	};
	const onPasteStyles = () => {
		const styles = { ...copiedStyles };
		if (copyPasteMapping.exclude)
			copyPasteMapping.exclude.forEach(prop => {
				if (styles[prop]) delete styles[prop];
			});

		closeMoreSettings();
		updateBlockAttributes(clientId, styles);
	};

	const onCopyBlocks = () => copyNestedBlocks(innerBlocks);
	const onPasteBlocks = () =>
		replaceInnerBlocks(clientId, cleanInnerBlocks(copiedBlocks));

	const handleSpecialPaste = ({ attr, tab, checked, group }) => {
		const specPaste = { ...specialPaste };
		if (!Array.isArray(attr)) {
			if (group) {
				if (!checked)
					specPaste[tab] = specPaste[tab].filter(sp => {
						return (
							typeof sp !== 'object' ||
							(typeof sp === 'object' &&
								!Object.values(sp).includes(attr))
						);
					});
				else specPaste[tab] = [...specPaste[tab], { [group]: attr }];
			} else
				specPaste[tab] = specialPaste[tab].includes(attr)
					? specPaste[tab].filter(val => val !== attr)
					: [...specPaste[tab], attr];
		} else {
			specPaste[tab] = specPaste[tab].filter(sp => {
				return (
					typeof sp !== 'object' ||
					(typeof sp === 'object' && !Object.keys(sp).includes(group))
				);
			});
			attr.forEach(attrType => {
				if (checked)
					specPaste[tab] = [...specPaste[tab], { [group]: attrType }];
			});
		}
		setSpecialPaste(specPaste);
	};

	const onSpecialPaste = () => {
		let res = {};

		Object.keys(specialPaste).forEach(tab => {
			specialPaste[tab].forEach(key => {
				if (typeof key === 'string')
					res = {
						...res,
						...organizedAttributes[tab][key].attribute,
					};
				else
					res = {
						...res,
						...organizedAttributes[tab][Object.keys(key)[0]].group[
							Object.values(key)[0]
						].attribute,
					};
			});
		});

		setSpecialPaste({
			settings: [],
			canvas: [],
			advanced: [],
		});

		closeMoreSettings();
		updateBlockAttributes(clientId, res);
	};

	const checkNestedCheckboxes = (attrType, tab, checked) => {
		handleSpecialPaste({
			attr: Object.keys(organizedAttributes[tab][attrType].group),
			tab,
			group: attrType,
			checked,
		});
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
											onChange={() =>
												handleSpecialPaste({
													attr: attrType,
													tab,
												})
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
											checked={
												!isEmpty(
													specialPaste[tab].filter(
														sp => {
															return (
																typeof sp ===
																	'object' &&
																Object.values(
																	sp
																).includes(attr)
															);
														}
													)
												)
											}
											onChange={e =>
												handleSpecialPaste({
													attr,
													tab,
													checked: e.target.checked,
													group: attrType,
												})
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
							);
						});

						const groupCheckBox = (
							<div
								className='toolbar-item__copy-paste__popover__item toolbar-item__copy-paste__popover__item__group'
								key={`copy-paste-group-${tab}-${attrType}`}
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

						return [groupCheckBox, nestedCheckBoxes];
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
