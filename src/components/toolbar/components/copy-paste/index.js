/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { cloneBlock } from '@wordpress/blocks';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { SettingTabsControl } from '../../../../components';
import Button from '../../../button';
import CopyPasteGroup from './CopyPasteGroup';
import Dropdown from '../../../dropdown';
import { getOrganizedAttributes } from '../../../../extensions/copy-paste';
import { loadColumnsTemplate } from '../../../../extensions/column-templates';

/**
 * External dependencies
 */
import {
	capitalize,
	isArray,
	isEmpty,
	isEqual,
	isObject,
	isString,
	kebabCase,
} from 'lodash';

/**
 * Styles
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

const CopyPaste = props => {
	const { blockName, clientId, closeMoreSettings, copyPasteMapping } = props;

	const {
		blockAttributes,
		organizedAttributes,
		currentOrganizedAttributes,
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
				getOrganizedAttributes(copiedStyles, copyPasteMapping)) ||
			{};

		const blockValues = getBlock(clientId);
		const blockAttributes = getOrganizedAttributes(
			blockValues.attributes,
			copyPasteMapping,
			true
		);
		const currentOrganizedAttributes = getOrganizedAttributes(
			blockAttributes,
			copyPasteMapping
		);
		const { innerBlocks } = blockValues;
		const hasInnerBlocks = !isEmpty(innerBlocks);

		return {
			blockAttributes,
			organizedAttributes,
			currentOrganizedAttributes,
			copiedStyles,
			copiedBlocks,
			innerBlocks,
			hasInnerBlocks,
		};
	});

	const getDefaultSpecialPaste = obj =>
		Object.keys(obj).reduce((acc, tab) => {
			acc[tab] = [];
			return acc;
		}, {});

	const [specialPaste, setSpecialPaste] = useState(
		getDefaultSpecialPaste(organizedAttributes)
	);

	const [selectedAttributes, setSelectedAttributes] = useState({});
	const cleanInnerBlocks = innerBlocks =>
		innerBlocks.map(block => {
			block.innerBlocks = cleanInnerBlocks(block.innerBlocks);

			return cloneBlock(block);
		});

	const { copyStyles, copyNestedBlocks } = useDispatch('maxiBlocks');
	const { updateBlockAttributes, replaceInnerBlocks } =
		useDispatch('core/block-editor');

	const onCopyStyles = () => {
		closeMoreSettings();
		copyStyles(blockAttributes);
	};
	const onPasteStyles = () => {
		const styles = { ...copiedStyles };

		if (copyPasteMapping._exclude)
			copyPasteMapping._exclude.forEach(prop => {
				if (styles[prop]) delete styles[prop];
			});

		closeMoreSettings();

		if (blockName === 'maxi-blocks/row-maxi') {
			Object.entries(styles).forEach(([key, style]) => {
				if (key.includes('row-pattern-')) {
					const { getBlock } = select('core/block-editor');

					const { attributes } = getBlock(clientId);

					if (style !== attributes[key])
						loadColumnsTemplate(
							style,
							clientId,
							key.replace('row-pattern-', '')
						);
				}
			});
		}

		updateBlockAttributes(clientId, styles);
	};

	const onCopyBlocks = () => {
		copyNestedBlocks(innerBlocks);
		closeMoreSettings();
	};
	const onPasteBlocks = () => {
		replaceInnerBlocks(clientId, cleanInnerBlocks(copiedBlocks));
		closeMoreSettings();
	};

	const handleSpecialPaste = ({
		name = false,
		attr,
		tab,
		checked,
		group,
	}) => {
		const specPaste = { ...specialPaste };
		if (name) {
			const attributes = selectedAttributes;
			if (tab && !attributes[tab]) attributes[tab] = {};
			if (group && !attributes[tab][group]) attributes[tab][group] = {};
			if (attr && !attributes[tab][group][attr])
				attributes[tab][group][attr] = {};
			if (name && attributes[tab][group][attr])
				attributes[tab][group][attr][name] = checked;

			if (!attributes['checked-settings'])
				attributes['checked-settings'] = {};

			setSelectedAttributes(attributes);
		} else if (!isArray(attr)) {
			if (group) {
				if (!checked)
					specPaste[tab] = specPaste[tab].filter(sp => {
						return (
							!isObject(sp) ||
							(isObject(sp) && !Object.values(sp).includes(attr))
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
					!isObject(sp) ||
					(isObject(sp) && !Object.keys(sp).includes(group))
				);
			});
			attr.forEach(attrType => {
				if (checked)
					specPaste[tab] = [...specPaste[tab], { [group]: attrType }];
			});
		}
		console.log('selectedAttributes', selectedAttributes);
		if (
			selectedAttributes[tab] &&
			selectedAttributes[tab][group] &&
			selectedAttributes[tab][group][attr]
		) {
			if (tab && !specialPaste[tab]) specialPaste[tab] = {};
			if (group && !specialPaste[tab][group])
				specialPaste[tab][group] = {};
			if (attr && !specialPaste[tab][group][attr])
				specialPaste[tab][group][attr] = true;
		}
		console.log('specPaste-art', specPaste);
		setSpecialPaste(specPaste);
	};

	const onSpecialPaste = () => {
		let res = {};
		// dev

		Object.entries(specialPaste).forEach(([tab, keys]) => {
			if (isArray(specialPaste[tab])) {
				console.log(tab, isEmpty(keys));
			}
			if (keys && specialPaste[tab][0]) {
				console.log(tab, isEmpty(keys));
			}
			keys.forEach(key => {
				if (
					selectedAttributes[tab] &&
					selectedAttributes[tab][Object.keys(key)[0]] &&
					selectedAttributes[tab][Object.keys(key)[0]][
						Object.values(key)[0]
					]
				) {
					const customAttributes =
						selectedAttributes[tab][Object.keys(key)[0]][
							Object.values(key)[0]
						];
					// console.log(customAttributes);
					Object.keys(customAttributes).forEach(k => {
						if (!customAttributes[k]) {
							organizedAttributes[tab][Object.keys(key)[0]][
								Object.values(key)[0]
							][k] =
								currentOrganizedAttributes[tab][
									Object.keys(key)[0]
								][Object.values(key)[0]][k];
						}
					});
				}
				res = {
					...res,
					...(isString(key)
						? organizedAttributes[tab][key]
						: organizedAttributes[tab][Object.keys(key)[0]][
								Object.values(key)[0]
						  ]),
				};
			});
		});
		// console.log('selectedAttributes', selectedAttributes);
		// console.log('organizedAttributes', organizedAttributes);

		setSpecialPaste(getDefaultSpecialPaste(organizedAttributes));

		closeMoreSettings();

		if (blockName === 'maxi-blocks/row-maxi') {
			Object.entries(res).forEach(([key, style]) => {
				if (key.includes('row-pattern-')) {
					const { getBlock } = select('core/block-editor');

					const { attributes } = getBlock(clientId);

					if (style !== attributes[key])
						loadColumnsTemplate(
							style,
							clientId,
							key.replace('row-pattern-', '')
						);
				}
			});
		}

		updateBlockAttributes(clientId, res);
	};

	const getTabItems = () => {
		const response = [];

		Object.entries(organizedAttributes).forEach(([tab, attributes]) => {
			const option = {
				label: __(capitalize(tab), 'maxi-blocks'),
				content:
					!isEmpty(organizedAttributes[tab]) &&
					!isEqual(currentOrganizedAttributes[tab], attributes) &&
					Object.entries(attributes).map(([label, obj]) => {
						const normalizedLabel = kebabCase(label);

						if (
							!obj.group &&
							!isEqual(
								currentOrganizedAttributes[tab][label],
								obj
							)
						)
							return (
								<div
									className='toolbar-item__copy-paste__popover__item'
									key={`copy-paste-${tab}-${normalizedLabel}`}
								>
									<label
										htmlFor={normalizedLabel}
										className='maxi-axis-control__content__item__checkbox'
									>
										<input
											type='checkbox'
											name={normalizedLabel}
											id={normalizedLabel}
											checked={specialPaste[tab].includes(
												label
											)}
											onChange={() =>
												handleSpecialPaste({
													attr: label,
													tab,
												})
											}
										/>
										<span>{label}</span>
									</label>
								</div>
							);

						// console.log('specialPaste', specialPaste);
						// console.log(
						// 	'organizedAttributes',
						// 	organizedAttributes.settings.Typography
						// );
						// console.log(
						// 	'currentOrganizedAttributes',
						// 	currentOrganizedAttributes.settings.Typography
						// );

						return (
							!isEqual(
								currentOrganizedAttributes[tab][label],
								obj
							) && (
								<CopyPasteGroup
									key={`copy-paste-group-${tab}-${label}`}
									tab={tab}
									label={label}
									organizedAttributes={organizedAttributes}
									currentOrganizedAttributes={
										currentOrganizedAttributes
									}
									selectedAttributes={selectedAttributes}
									specialPaste={specialPaste}
									handleSpecialPaste={handleSpecialPaste}
								/>
							)
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
				{__('Copy styles - all', 'maxi-blocks')}
			</Button>
			<Button
				className='toolbar-item__copy-paste__popover__button'
				onClick={onPasteStyles}
				disabled={isEmpty(copiedStyles)}
			>
				{__('Paste styles - all', 'maxi-blocks')}
			</Button>
			{!isEmpty(copiedStyles) &&
				!isEqual(currentOrganizedAttributes, organizedAttributes) && (
					<Dropdown
						className='maxi-copypaste__copy-selector'
						contentClassName='maxi-more-settings__popover maxi-dropdown__child-content maxi-copy-paste__popover'
						position='right bottom'
						renderToggle={({ onToggle }) => (
							<Button
								className='toolbar-item__copy-paste__popover__button'
								onClick={onToggle}
							>
								{__('Paste special - select', 'maxi-blocks')}
							</Button>
						)}
						renderContent={() => (
							<form>
								<SettingTabsControl
									target='sidebar-settings-tabs'
									disablePadding
									items={getTabItems()}
								/>

								<Button
									className='toolbar-item__copy-paste__popover__button toolbar-item__copy-paste__popover__button--special'
									onClick={onSpecialPaste}
								>
									{__('Paste special style', 'maxi-blocks')}
								</Button>
							</form>
						)}
					/>
				)}
			{hasInnerBlocks && (
				<Button
					className='toolbar-item__copy-paste__popover__button toolbar-item__copy-nested-block__popover__button'
					onClick={onCopyBlocks}
				>
					{__('Copy nested blocks', 'maxi-blocks')}
				</Button>
			)}
			{WRAPPER_BLOCKS.includes(blockName) && (
				<Button
					className='toolbar-item__copy-paste__popover__button'
					onClick={onPasteBlocks}
					disabled={isEmpty(copiedBlocks)}
				>
					{__('Paste nested blocks', 'maxi-blocks')}
				</Button>
			)}
		</div>
	);
};

export default CopyPaste;
