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
	getOrganizedAttributes,
	cleanStyleAttributes,
} from '../../../../extensions/copy-paste';

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

const ATTRIBUTES = [
	'alignment',
	'arrow',
	'background',
	'backgroundColor',
	'backgroundColorHover',
	'backgroundGradient',
	'backgroundGradientHover',
	'backgroundHover',
	'blockBackground',
	'border',
	'borderHover',
	'borderRadius',
	'borderRadiusHover',
	'borderWidth',
	'borderWidthHover',
	'boxShadow',
	'boxShadowHover',
	'breakpoints',
	'columnSize',
	'display',
	'divider',
	'link',
	'margin',
	'motion',
	'opacity',
	'padding',
	'position',
	'shapeDivider',
	'size',
	'textAlignment',
	'transform',
	'transition',
	'typography',
	'typographyHover',
	'zIndex',
];

const WRAPPER_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi',
];

const CopyPasteContent = props => {
	const { clientId, blockName, copyPasteMapping, prefix, closeMoreSettings } =
		props;

	const [isOpen, setIsOpen] = useState(false);
	const [specialPaste, setSpecialPaste] = useState({
		settings: [],
		canvas: [],
		advanced: [],
	});

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
			(copiedStyles &&
				getOrganizedAttributes(
					copiedStyles,
					copyPasteMapping,
					prefix
				)) ||
			{};

		const blockValues = getBlock(clientId);
		const blockAttributes = cleanStyleAttributes(
			blockValues.attributes,
			copyPasteMapping,
			prefix
		);
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
