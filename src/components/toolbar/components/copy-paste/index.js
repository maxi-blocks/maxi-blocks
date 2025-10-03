/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useContext, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { SettingTabsControl } from '@components';
import Button from '@components/button';
import CopyPasteGroup from './CopyPasteGroup';
import Dropdown from '@components/dropdown';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import {
	cleanInnerBlocks,
	excludeAttributes,
	getOrganizedAttributes,
} from '@extensions/copy-paste';
import { loadColumnsTemplate } from '@extensions/column-templates';
import { getUpdatedBGLayersWithNewUniqueID } from '@extensions/attributes';
import {
	validateAttributes,
	validateRowColumnsStructure,
} from '@extensions/repeater';
import {
	findTarget,
	findBlockPosition,
	getInitialColumn,
} from '@extensions/repeater/utils';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

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

	const repeaterContext = useContext(RepeaterContext);

	const {
		attributes,
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

		const { attributes, innerBlocks } = getBlock(clientId);
		const blockAttributes = getOrganizedAttributes(
			attributes,
			copyPasteMapping,
			true
		);
		const currentOrganizedAttributes = getOrganizedAttributes(
			blockAttributes,
			copyPasteMapping
		);
		const hasInnerBlocks = !isEmpty(innerBlocks);

		return {
			attributes,
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

	const { copyStyles, copyNestedBlocks } = useDispatch('maxiBlocks');
	const { updateBlockAttributes, replaceInnerBlocks } =
		useDispatch('core/block-editor');

	const handleAttributesOnPaste = copiedAttributes => {
		if (blockName === 'maxi-blocks/row-maxi') {
			Object.entries(copiedAttributes).forEach(([key, style]) => {
				if (key.includes('row-pattern-') && style !== attributes[key]) {
					loadColumnsTemplate(
						style,
						clientId,
						key.replace('row-pattern-', '')
					);
				}
			});
		}

		if (copiedAttributes['background-layers']) {
			const updatedBGLayers = getUpdatedBGLayersWithNewUniqueID(
				copiedAttributes['background-layers'],
				attributes.uniqueID
			);

			if (updatedBGLayers) {
				copiedAttributes['background-layers'] = updatedBGLayers;
			}
		}
	};

	const onCopyStyles = () => {
		closeMoreSettings();
		copyStyles(blockAttributes);
	};

	const onPasteStylesIntoRepeaterBlock = () => {
		if (!repeaterContext?.repeaterStatus) return;

		const { getBlock } = select('core/block-editor');

		const innerBlocksPositions = repeaterContext?.getInnerBlocksPositions();

		const blockPosition = findBlockPosition(
			clientId,
			getInitialColumn(clientId, innerBlocksPositions[[-1]])
		);

		const indexToValidateBy = innerBlocksPositions[blockPosition].findIndex(
			currentClientId => currentClientId === clientId
		);

		innerBlocksPositions[blockPosition].forEach(currentClientId =>
			validateAttributes(
				getBlock(currentClientId),
				getInitialColumn(currentClientId, innerBlocksPositions[[-1]]),
				innerBlocksPositions,
				indexToValidateBy
			)
		);
	};

	const onPasteStyles = () => {
		const styles = excludeAttributes(
			copiedStyles,
			attributes,
			copyPasteMapping
		);

		closeMoreSettings();

		handleAttributesOnPaste(styles);

		updateBlockAttributes(clientId, styles);

		onPasteStylesIntoRepeaterBlock();
	};

	const onCopyBlocks = () => {
		copyNestedBlocks(innerBlocks);
		closeMoreSettings();
	};
	const onPasteBlocks = () => {
		const removeColumnsFromBlocks = blocks =>
			blocks.reduce((acc, block) => {
				if (block.name === 'maxi-blocks/column-maxi') {
					return acc;
				}

				const innerBlocks = block.innerBlocks
					? removeColumnsFromBlocks(block.innerBlocks)
					: [];

				return [
					...acc,
					{
						...block,
						innerBlocks,
					},
				];
			}, []);

		let newCopiedBlocks = cleanInnerBlocks(copiedBlocks);

		if (blockName === 'maxi-blocks/column-maxi') {
			newCopiedBlocks = removeColumnsFromBlocks(newCopiedBlocks);

			if (isEmpty(newCopiedBlocks)) {
				closeMoreSettings();
				return;
			}
		}

		if (!repeaterContext?.repeaterStatus) {
			replaceInnerBlocks(clientId, newCopiedBlocks);
		}

		if (repeaterContext?.repeaterStatus) {
			const oldParentBlock = {
				name: blockName,
				clientId,
				innerBlocks,
			};
			const newParentBlock = {
				...oldParentBlock,
				innerBlocks: newCopiedBlocks,
			};

			goThroughMaxiBlocks(
				block => {
					const blockPosition = findBlockPosition(
						block.clientId,
						oldParentBlock
					);

					const newBlock = findTarget(blockPosition, newParentBlock);

					if (!newBlock) {
						return;
					}

					if (block.name === newBlock.name) {
						newBlock.clientId = block.clientId;
					}
				},
				false,
				innerBlocks
			);

			replaceInnerBlocks(clientId, newCopiedBlocks);

			const innerBlocksPositions =
				repeaterContext?.getInnerBlocksPositions();

			validateRowColumnsStructure(
				repeaterContext?.repeaterRowClientId,
				innerBlocksPositions,
				null,
				getInitialColumn(clientId, innerBlocksPositions[[-1]]).clientId
			);
		}

		closeMoreSettings();
	};

	const handleSpecialPaste = ({ attr, tab, checked, group }) => {
		const specPaste = { ...specialPaste };

		if (!isArray(attr)) {
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
		setSpecialPaste(specPaste);
	};

	const onSpecialPaste = () => {
		let res = {};

		Object.entries(specialPaste).forEach(([tab, keys]) => {
			keys.forEach(key => {
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

		setSpecialPaste(getDefaultSpecialPaste(organizedAttributes));

		closeMoreSettings();

		handleAttributesOnPaste(res);

		updateBlockAttributes(clientId, res);

		onPasteStylesIntoRepeaterBlock();
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
