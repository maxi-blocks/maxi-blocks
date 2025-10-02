/* eslint-disable no-alert */
/**
 * WordPress dependencies
 */
import { getSettings, date } from '@wordpress/date';
import { Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef, forwardRef } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import { isEmpty, isNil, isEqual, cloneDeep, merge } from 'lodash';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import DialogBox from '@components/dialog-box';
import Icon from '@components/icon';
import SettingTabsControl from '@components/setting-tabs-control';
import ToggleSwitch from '@components/toggle-switch';
import ReactSelectControl from '@components/react-select-control';
import MaxiStyleCardsTab from './maxiStyleCardsTab';
import MaxiModal from '@editor/library/modal';
import { exportStyleCard, getActiveColourFromSC } from './utils';
import { updateSCOnEditor } from '@extensions/style-cards';
import { handleSetAttributes } from '@extensions/maxi-block';
import standardSC from '@maxi-core/defaults/defaultSC.json';

/**
 * Icons
 */
import { styleCardBoat, SCDelete, closeIcon } from '@maxi-icons';

// Re-use or adapt the ID generation from maxiStyleCardsTab.js
const generateCustomColorIdForEditor = () => {
	const timestampPart = Date.now().toString().slice(-7);
	const randomPart = Math.random().toString().slice(2, 7);
	return Number(timestampPart + randomPart);
};

// Helper to process/ensure custom colors have the correct {id, value, name} structure
const ensureCustomColorShape = (colorItem, existingIdsSet) => {
	let id;
	let value;
	let name;
	if (typeof colorItem === 'object' && colorItem !== null) {
		value =
			typeof colorItem.value === 'string' && colorItem.value.trim() !== ''
				? colorItem.value
				: 'transparent';
		name = typeof colorItem.name === 'string' ? colorItem.name : '';
		id =
			typeof colorItem.id === 'number' && colorItem.id > 8
				? colorItem.id
				: null; // Accept existing valid-looking numeric IDs
	} else if (typeof colorItem === 'string' && colorItem.trim() !== '') {
		// old array of strings
		value = colorItem;
		name = '';
		id = null;
	} else {
		// Malformed
		return null;
	}

	if (id === null || (existingIdsSet && existingIdsSet.has(id))) {
		let newId = generateCustomColorIdForEditor();
		if (existingIdsSet) {
			while (existingIdsSet.has(newId)) {
				newId = generateCustomColorIdForEditor(); // Regenerate until unique in the current set
			}
		}
		id = newId;
	}
	if (existingIdsSet) existingIdsSet.add(id);
	return { id, value, name };
};

const getShapedCustomColors = rawColorsArray => {
	if (!Array.isArray(rawColorsArray)) return [];
	const shaped = [];
	const ids = new Set();
	rawColorsArray.forEach(item => {
		const shapedItem = ensureCustomColorShape(item, ids);
		if (shapedItem) shaped.push(shapedItem);
	});
	return shaped;
};

const MaxiStyleCardsEditor = forwardRef(({ styleCards, setIsVisible }, ref) => {
	const prevValues = useRef(null);

	const selectData = useSelect(
		select => {
			const { getEditorSettings } = select('core/editor');
			const { isRTL } = getEditorSettings();

			const { receiveMaxiDeviceType } = select('maxiBlocks');
			const breakpoint = receiveMaxiDeviceType();

			const {
				receiveStyleCardsList,
				receiveMaxiActiveStyleCard,
				receiveSavedMaxiStyleCards,
				receiveMaxiSelectedStyleCard,
			} = select('maxiBlocks/style-cards');

			// Get current values
			const SCList = receiveStyleCardsList();
			const activeStyleCard = receiveMaxiActiveStyleCard();
			const { key: activeSCKey, value: activeSCValue } = activeStyleCard;
			const savedStyleCards = receiveSavedMaxiStyleCards();
			const selectedStyleCard = receiveMaxiSelectedStyleCard();
			const { key: selectedSCKey, value: selectedSCValue } =
				selectedStyleCard;

			// Create new values object
			const newValues = {
				isRTL,
				breakpoint,
				SCList,
				activeSCKey,
				activeStyleCard,
				activeSCValue,
				savedStyleCards,
				selectedSCKey,
				selectedSCValue,
			};

			// Return previous values if unchanged
			if (prevValues.current && isEqual(prevValues.current, newValues)) {
				return prevValues.current;
			}

			prevValues.current = newValues;
			return newValues;
		},
		[], // Empty dependency array
		{
			equalityCheck: (a, b) => isEqual(a, b),
		}
	);

	const {
		isRTL,
		breakpoint,
		SCList,
		activeSCKey,
		activeSCValue,
		activeStyleCard,
		savedStyleCards,
		selectedSCKey,
		selectedSCValue,
	} = selectData;

	const {
		saveMaxiStyleCards,
		setActiveStyleCard,
		removeStyleCard,
		setSelectedStyleCard,
		saveSCStyles,
	} = useDispatch('maxiBlocks/style-cards');

	const [styleCardName, setStyleCardName] = useState(
		`${activeSCValue?.name} - `
	);
	const [currentSCStyle, setCurrentSCStyle] = useState('light');

	const getIsUserCreatedStyleCard = (card = selectedSCValue) => {
		return card?.type === 'user';
	};

	const [isTemplate, setIsTemplate] = useState(!getIsUserCreatedStyleCard());
	const [showCopyCardDialog, setShowCopyCardDialog] = useState(false);
	const [activeSCColour, setActiveSCColour] = useState(
		getActiveColourFromSC(activeStyleCard, 4)
	);
	const [originalCustomColors, setOriginalCustomColors] = useState([]);

	useEffect(() => {
		if (selectedSCValue) {
			updateSCOnEditor(selectedSCValue, activeSCColour);
			setStyleCardName(`${selectedSCValue?.name} - `);

			const isUserCreatedSC = getIsUserCreatedStyleCard();
			setIsTemplate(!isUserCreatedSC);
			setShowCopyCardDialog(false);

			const rawCustomColors =
				selectedSCValue?.color?.customColors ||
				selectedSCValue?.light?.styleCard?.color?.customColors ||
				selectedSCValue?.dark?.styleCard?.color?.customColors ||
				[];
			setOriginalCustomColors(getShapedCustomColors(rawCustomColors));
		}
	}, [selectedSCKey, activeSCColour]);

	const canBeSaved = keySC => {
		// Check if style card exists in both current and saved states
		if (!styleCards[keySC] || !savedStyleCards[keySC]) {
			return false;
		}

		// Check for custom colors changes by explicitly comparing arrays
		const currentRawCustomColors =
			styleCards[keySC]?.color?.customColors ||
			styleCards[keySC]?.light?.styleCard?.color?.customColors ||
			styleCards[keySC]?.dark?.styleCard?.color?.customColors ||
			[];
		const currentCustomColors = getShapedCustomColors(
			currentRawCustomColors
		);

		// Check if custom colors have changed from original
		const customColorsChanged =
			JSON.stringify(currentCustomColors) !==
			JSON.stringify(originalCustomColors);

		if (customColorsChanged) {
			return true;
		}

		// Compare the general styleCards (without customColors specifically)
		const currentSC = {
			light: styleCards[keySC].light.styleCard,
			dark: styleCards[keySC].dark.styleCard,
		};

		const savedSC = {
			light: savedStyleCards[keySC]?.light.styleCard,
			dark: savedStyleCards[keySC]?.dark.styleCard,
		};

		// Check if gutenberg_blocks_status changed
		const gutenbergStatusChanged =
			styleCards[keySC]?.gutenberg_blocks_status !==
			savedStyleCards[keySC]?.gutenberg_blocks_status;

		// Use general objects comparison for other changes
		const otherChanges = !isEqual(currentSC, savedSC);

		return customColorsChanged || otherChanges || gutenbergStatusChanged;
	};

	const canBeApplied = (keySC, activeSCKey) => {
		if (keySC !== activeSCKey) return true;

		return false;
	};

	const canBeRemoved = (keySC, activeSCKey) => {
		if (keySC === 'sc_maxi' || keySC === activeSCKey) return false;

		return true;
	};

	const onChangeValue = (obj, type) => {
		let newSC = { ...selectedSCValue };
		// Special case for customColors
		if (type === 'color' && 'customColors' in obj) {
			// Create the color object if it doesn't exist
			if (!newSC.color) {
				newSC.color = {};
			}
			newSC.color.customColors = [...obj.customColors];

			// Ensure light styleCard has the structure
			if (!newSC.light)
				newSC.light = { styleCard: {}, defaultStyleCard: {} };
			if (!newSC.light.styleCard) newSC.light.styleCard = {};
			if (!newSC.light.styleCard.color) newSC.light.styleCard.color = {};

			// Ensure dark styleCard has the structure
			if (!newSC.dark)
				newSC.dark = { styleCard: {}, defaultStyleCard: {} };
			if (!newSC.dark.styleCard) newSC.dark.styleCard = {};
			if (!newSC.dark.styleCard.color) newSC.dark.styleCard.color = {};

			// Set the customColors in both light and dark styleCards
			newSC.light.styleCard.color.customColors = [...obj.customColors];
			newSC.dark.styleCard.color.customColors = [...obj.customColors];

			// Create a new styleCards object with the updated SC
			const newStyleCards = {
				...styleCards,
				[selectedSCKey]: newSC,
			};

			// This updates the UI styleCards state but doesn't save to database
			saveMaxiStyleCards(newStyleCards);

			// Update the editor preview
			updateSCOnEditor(newSC, activeSCColour, [document], true);

			return;
		}

		const isTypography = Object.keys(obj)[0] === 'typography';

		const newObj = handleSetAttributes({
			obj: isTypography ? obj.typography : obj,
			attributes: {
				...selectedSCValue[currentSCStyle].defaultStyleCard[type],
				...selectedSCValue[currentSCStyle].styleCard[type],
			},
			defaultAttributes:
				selectedSCValue[currentSCStyle].defaultStyleCard[type],
			onChange: response => response,
			isStyleCard: true,
		});

		Object.entries(newObj).forEach(([prop, value]) => {
			if (isTypography) {
				if (isNil(value)) {
					delete selectedSCValue[currentSCStyle].styleCard?.[type]?.[
						prop
					];
				}
			}

			newSC = {
				...newSC,
				[currentSCStyle]: {
					...newSC[currentSCStyle],
					styleCard: {
						...newSC[currentSCStyle].styleCard,
						[type]: {
							...newSC[currentSCStyle].styleCard[type],
							[prop]: value,
						},
					},
				},
			};
		});

		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: {
				...newSC,
			},
		};
		saveMaxiStyleCards(newStyleCards, true);
		updateSCOnEditor(newSC, activeSCColour);
		saveSCStyles(selectedSCKey === activeSCKey);
	};

	const [postDate] = useState();

	const saveImportedStyleCard = card => {
		const newId = `sc_${new Date().getTime()}`;

		const standardMerge = cloneDeep(standardSC?.sc_maxi);
		const mergeWith = cloneDeep(card);
		const newCard = merge(standardMerge, mergeWith);

		const newAllSCs = {
			...styleCards,
			[newId]: newCard,
		};

		saveMaxiStyleCards(newAllSCs, true);
		updateSCOnEditor(card, activeSCColour);
		setSelectedStyleCard(newId);
		saveSCStyles(false);
	};

	const customiseInputRef = useRef();

	useEffect(() => {
		customiseInputRef?.current?.focus?.();
	}, [showCopyCardDialog]);

	const applyCurrentSCGlobally = () => {
		setActiveStyleCard(selectedSCKey);
		saveMaxiStyleCards(selectedSCValue);
		updateSCOnEditor(
			selectedSCValue,
			getActiveColourFromSC(selectedSCValue, 4)
		);

		setActiveSCColour(getActiveColourFromSC(selectedSCValue, 4));
		const newStyleCards = cloneDeep(styleCards);

		Object.entries(newStyleCards).forEach(([key, value]) => {
			if (key === selectedSCKey)
				newStyleCards[key] = { ...value, status: 'active' };
			else newStyleCards[key] = { ...value, status: '' };
		});

		saveMaxiStyleCards(newStyleCards, true);
		saveSCStyles(true);
	};

	const saveCurrentSC = () => {
		const isChosenActive = selectedSCValue?.status === 'active';

		// Get custom colors from the store
		const { receiveMaxiSelectedStyleCardValue } =
			window.wp.data.select('maxiBlocks/style-cards') || {};

		// First try to get colors from the store (most reliable source)
		let finalCustomColors = [];
		if (typeof receiveMaxiSelectedStyleCardValue === 'function') {
			const storeColors =
				receiveMaxiSelectedStyleCardValue('customColors');
			if (Array.isArray(storeColors) && storeColors.length > 0) {
				finalCustomColors = getShapedCustomColors(storeColors);
			}
		}

		// If store doesn't have colors, fall back to selectedSCValue
		if (finalCustomColors.length === 0) {
			const baseColorsRaw =
				selectedSCValue?.color?.customColors ||
				selectedSCValue?.light?.styleCard?.color?.customColors ||
				selectedSCValue?.dark?.styleCard?.color?.customColors ||
				[];

			finalCustomColors = getShapedCustomColors(baseColorsRaw);
		}

		// As a last resort, try to get colors from DOM (least reliable)
		if (finalCustomColors.length === 0) {
			let uiCustomColors = [];
			const styleCardsTabNode = document.querySelector(
				'.maxi-blocks-sc__type--custom-color-presets .maxi-style-cards__custom-color-presets'
			);

			if (styleCardsTabNode) {
				const customColorItems = styleCardsTabNode.querySelectorAll(
					'.maxi-style-cards__custom-color-presets__box'
				);
				if (customColorItems && customColorItems.length > 0) {
					uiCustomColors = Array.from(customColorItems).map(item => {
						const colorSpan = item.querySelector(
							'.maxi-style-cards__custom-color-presets__box__item'
						);
						const colorName = item.getAttribute('title') || '';
						// Use data-color-id attribute we added to the component
						const colorId = item.dataset.colorId
							? Number(item.dataset.colorId)
							: null;

						return {
							id: colorId,
							value: colorSpan
								? colorSpan.style.background
								: 'transparent',
							name:
								colorName === __('Custom Colour', 'maxi-blocks')
									? ''
									: colorName,
						};
					});

					finalCustomColors = getShapedCustomColors(uiCustomColors);
					console.info(
						'[MaxiBlocks] Custom colors fetched from DOM as fallback',
						finalCustomColors.length
					);
				}
			}
		}

		const updatedSCValue = { ...selectedSCValue };

		if (!updatedSCValue.color) updatedSCValue.color = {};
		updatedSCValue.color.customColors = [...finalCustomColors];

		if (!updatedSCValue.light)
			updatedSCValue.light = {
				styleCard: { color: {} },
				defaultStyleCard: {},
			};
		if (!updatedSCValue.light.styleCard)
			updatedSCValue.light.styleCard = { color: {} };
		if (!updatedSCValue.light.styleCard.color)
			updatedSCValue.light.styleCard.color = {};
		updatedSCValue.light.styleCard.color.customColors = [
			...finalCustomColors,
		];

		if (!updatedSCValue.dark)
			updatedSCValue.dark = {
				styleCard: { color: {} },
				defaultStyleCard: {},
			};
		if (!updatedSCValue.dark.styleCard)
			updatedSCValue.dark.styleCard = { color: {} };
		if (!updatedSCValue.dark.styleCard.color)
			updatedSCValue.dark.styleCard.color = {};
		updatedSCValue.dark.styleCard.color.customColors = [
			...finalCustomColors,
		];

		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: {
				...updatedSCValue,
				...{ status: isChosenActive ? 'active' : '' },
			},
		};

		if (isChosenActive) {
			setActiveSCColour(getActiveColourFromSC(updatedSCValue, 4));
			updateSCOnEditor(
				updatedSCValue,
				getActiveColourFromSC(updatedSCValue, 4)
			);
		}

		// Save the updated style cards including the new colors
		saveMaxiStyleCards(newStyleCards, true);
		saveSCStyles(isChosenActive);

		// Update originalCustomColors to match the newly saved colors
		setOriginalCustomColors([...finalCustomColors]);
	};

	const deleteSC = () => {
		removeStyleCard(selectedSCKey);

		if (activeSCKey === selectedSCKey) setActiveStyleCard('sc_maxi');
	};

	const onChangeGutenbergBlocksStatus = value => {
		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: {
				...selectedSCValue,
				gutenberg_blocks_status: value,
			},
		};

		saveMaxiStyleCards(newStyleCards, true);
		updateSCOnEditor(newStyleCards[selectedSCKey], activeSCColour);
		saveSCStyles(selectedSCKey === activeSCKey);
	};

	const [cardAlreadyExists, setCardAlreadyExists] = useState(false);
	const [importedCardExists, setImportedCardExists] = useState(false);

	const currentDate = date(getSettings()?.formats?.date);

	const getOptionsSCList = () => {
		const response = [];

		!isEmpty(styleCards) &&
			Object.entries(styleCards).map(([key, val], i) => {
				if (val?.type !== 'user')
					response.push({
						label: `${__('Template', 'maxi-blocks')}: ${val.name}`,
						value: key,
						status: val?.status,
						selected: val?.selected || false,
					});
				else if (!isEmpty(val?.updated))
					response.push({
						label: `${val.name} - ${val.updated}`,
						value: key,
						status: val?.status,
						selected: val?.selected || false,
					});
				else
					response.push({
						label: `${val.name}`,
						value: key,
						status: val?.status,
						selected: val?.selected || false,
					});
				return null;
			});

		const sortedTemplates = response.sort((a, b) => {
			if (a?.label?.includes('Template:')) {
				return 1;
			}

			if (b?.label?.includes('Template:')) {
				return -1;
			}

			return a < b ? -1 : 1;
		});

		const sortedByDate = sortedTemplates.sort((a, b) => {
			if (
				a?.label?.includes('Template:') ||
				b?.label?.includes('Template:')
			)
				return null;
			const aDate = a?.label?.split('- ').pop();
			const bDate = b?.label?.split('- ').pop();

			if (Date.parse(aDate) && Date.parse(bDate))
				return new Date(bDate) - new Date(aDate);
			return null;
		});

		return sortedByDate;
	};

	const getActiveInList = list => {
		let response = '';
		list.forEach((sc, index) => {
			if (sc.status === 'active') response = index;
		});
		return response;
	};

	const getSelectedInList = list => {
		let response = '';
		list.forEach((sc, index) => {
			if (sc.selected) response = index;
		});
		return response;
	};

	const listForDropdown = getOptionsSCList();
	const selectedForDropdown =
		listForDropdown[getSelectedInList(listForDropdown)];
	const activeForDropdown = listForDropdown[getActiveInList(listForDropdown)];

	const closeAllAccordions = () => {
		const scEditor = document.getElementsByClassName(
			'maxi-style-cards__settings'
		)[0];
		const accordions = scEditor?.getElementsByClassName(
			'maxi-accordion-control__item'
		);

		if (!accordions || isEmpty(accordions)) return null;

		for (const accordion of accordions) {
			accordion.querySelector('[aria-expanded=true]')?.click();
		}

		return null;
	};

	return (
		!isEmpty(styleCards) && (
			<Popover
				anchor={ref.current}
				noArrow
				resize
				position={isRTL ? 'bottom left right' : 'bottom right left'}
				className='maxi-style-cards__popover maxi-sidebar'
				focusOnMount
				strategy='fixed'
			>
				<div className='active-style-card'>
					<div className='active-style-card_icon'>
						<Icon icon={styleCardBoat} />
					</div>
					<div className='active-style-card_title'>
						<span>{__('Active style card', 'maxi-blocks')}</span>
						<h2 className='maxi-style-cards__popover__title'>
							{activeStyleCard.value.name}
							{postDate && <span>| {postDate}</span>}
						</h2>
					</div>
					<span
						className='maxi-responsive-close has-tooltip'
						onClick={() => setIsVisible(false)}
					>
						<span className='tooltip'>
							{__('Close', 'maxi-blocks')}
						</span>
						<Icon icon={closeIcon} />
					</span>
				</div>

				<div className='maxi-style-cards__sc'>
					<div className='maxi-style-cards__sc__more-sc'>
						<MaxiModal type='sc' />
						<MediaUploadCheck>
							<MediaUpload
								onSelect={media => {
									fetch(media.url)
										// Need to parse the response 2 times,
										// because it was stringified twice in the export function
										.then(response => response.json())
										.then(response => JSON.parse(response))
										.then(jsonData => {
											if (
												SCList.map(
													listItem => listItem.label
												)
													.filter(
														cardname => cardname
													)
													.indexOf(jsonData.name) < 0
											) {
												saveImportedStyleCard(jsonData);
												setImportedCardExists(false);
												setCardAlreadyExists(false);
											} else {
												setImportedCardExists(true);
											}
										})
										.catch(error => {
											console.error(error);
										});
								}}
								allowedTypes='text'
								render={({ open }) => (
									<Button
										className='maxi-style-cards__sc__ie--import'
										onClick={open}
									>
										{__('Import', 'maxi-blocks')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
						<div className='maxi-style-cards__sc__ie'>
							<Button
								className='maxi-style-cards__sc__ie--export'
								disabled={false}
								onClick={() => {
									const fileName = `${selectedSCValue.name}_exported.txt`;
									exportStyleCard(
										{
											...selectedSCValue,
											name: `${selectedSCValue.name} exported`,
											status: '',
										},
										fileName
									);
								}}
							>
								{__('Export', 'maxi-blocks')}
							</Button>
						</div>
					</div>
					<div className='maxi-style-cards__active-edit'>
						<div className='maxi-style-cards__active-edit-title'>
							<h3>{__('Style card editor', 'maxi-blocks')}</h3>
							<span>
								{__(
									'Preview, edit or activate style card',
									'maxi-blocks'
								)}
							</span>
						</div>
						{importedCardExists && (
							<div className='maxi-style-cards__card-already-exists'>
								<span>
									{__(
										'Imported card already exists.',
										'maxi-blocks'
									)}
								</span>
							</div>
						)}
						<div className='maxi-style-cards__active-edit-options'>
							<div className='maxi-style-cards__sc__more-sc--select'>
								<ReactSelectControl
									options={listForDropdown}
									value={
										selectedForDropdown || activeForDropdown
									}
									placeholder={__(
										'Type to search…',
										'maxi-blocks'
									)}
									onChange={val => {
										const newSCKey = val?.value;
										setSelectedStyleCard(newSCKey);
										const newSCValue =
											styleCards?.[newSCKey];
										!getIsUserCreatedStyleCard(
											newSCValue
										) && closeAllAccordions();
									}}
									hideSelectedOptions
									noOptionsMessage={() => null}
								/>
							</div>
							<DialogBox
								message={__(
									`Deleting${` ${selectedSCValue.name} `}style card. This action is permanent.`,
									'maxi-blocks'
								)}
								cancelLabel={__('Cancel', 'maxi-blocks')}
								confirmLabel={__('Delete', 'maxi-blocks')}
								onConfirm={deleteSC}
								buttonDisabled={
									!canBeRemoved(selectedSCKey, activeSCKey)
								}
								buttonClassName='maxi-style-cards__sc__more-sc--delete has-tooltip'
								buttonChildren={
									<>
										<span className='tooltip'>
											{__('Delete', 'maxi-blocks')}
										</span>
										<Icon icon={SCDelete} />
									</>
								}
							/>
						</div>
					</div>
					<div className='maxi-style-cards__sc__actions edit-activate'>
						<Button
							className='maxi-style-cards-customise-card-button'
							onClick={() =>
								setShowCopyCardDialog(!showCopyCardDialog)
							}
						>
							{isTemplate && __('Customise card', 'maxi-blocks')}
							{!isTemplate && __('Copy card', 'maxi-blocks')}
						</Button>
						{!isTemplate && (
							<Button
								className='maxi-style-cards__sc__actions--save'
								disabled={!canBeSaved(selectedSCKey)}
								onClick={saveCurrentSC}
							>
								{__('Save changes', 'maxi-blocks')}
							</Button>
						)}
						<DialogBox
							message={__(
								`Activate new style. Customized blocks will not change. All other Maxi blocks will get new,${` "${selectedSCValue.name}" `}styles.`,
								'maxi-blocks'
							)}
							cancelLabel={__('Cancel', 'maxi-blocks')}
							confirmLabel={__('Activate', 'maxi-blocks')}
							onConfirm={applyCurrentSCGlobally}
							buttonDisabled={
								!canBeApplied(selectedSCKey, activeSCKey)
							}
							buttonClassName='maxi-style-cards__sc__actions--apply'
							buttonChildren={
								<>
									{(isTemplate ||
										!canBeSaved(selectedSCKey)) &&
										__('Activate now', 'maxi-blocks')}
									{!isTemplate &&
										canBeSaved(selectedSCKey) &&
										__(
											'Save and activate now',
											'maxi-blocks'
										)}
								</>
							}
						/>
					</div>
					{!isTemplate && (
						<ToggleSwitch
							label={__(
								'Style core blocks within Maxi containers',
								'maxi-blocks'
							)}
							selected={selectedSCValue.gutenberg_blocks_status}
							onChange={value =>
								onChangeGutenbergBlocksStatus(value)
							}
						/>
					)}
				</div>

				<div className='maxi-style-cards__sc maxi-style-cards__settings'>
					{showCopyCardDialog && (
						<div className='maxi-style-cards__sc-custom-name'>
							<h3>
								{__('Create new style from', 'maxi-blocks')}
								<b> {selectedSCValue.name}</b>
							</h3>

							<div className='maxi-style-cards__sc__save'>
								<input
									type='text'
									maxLength='35'
									placeholder={__(
										'Short memorable name*',
										'maxi-blocks'
									)}
									value={styleCardName}
									onChange={e => {
										setStyleCardName(e.target.value);
										setCardAlreadyExists(false);
									}}
									ref={customiseInputRef}
								/>
								<Button
									disabled={isEmpty(styleCardName)}
									onClick={() => {
										if (
											SCList.map(
												listItem => listItem.label
											)
												.filter(cardname => cardname)
												.indexOf(styleCardName) >= 0
										) {
											setCardAlreadyExists(true);
										} else {
											setCardAlreadyExists(false);
											setImportedCardExists(false);
											// Get any custom colors from the selected style card and shape them
											const sourceCustomColorsRaw =
												selectedSCValue.color
													?.customColors ||
												selectedSCValue.light?.styleCard
													?.color?.customColors ||
												selectedSCValue.dark?.styleCard
													?.color?.customColors ||
												[];
											const shapedSourceCustomColors =
												getShapedCustomColors(
													sourceCustomColorsRaw
												);

											// Deep clone the styleCard parts from selectedSCValue to preserve other properties (typography, spacing etc.)
											const newLightStyleCardOverrides =
												cloneDeep(
													selectedSCValue.light
														.styleCard || {}
												);
											const newDarkStyleCardOverrides =
												cloneDeep(
													selectedSCValue.dark
														.styleCard || {}
												);

											// Manage the 'color' property within these cloned override objects
											if (
												shapedSourceCustomColors.length >
												0
											) {
												newLightStyleCardOverrides.color =
													{
														customColors: [
															...shapedSourceCustomColors,
														],
													};
												newDarkStyleCardOverrides.color =
													{
														customColors: [
															...shapedSourceCustomColors,
														],
													};
											} else {
												delete newLightStyleCardOverrides.color;
												delete newDarkStyleCardOverrides.color;
											}

											const newStyleCard = {
												name: styleCardName,
												status: '',
												gutenberg_blocks_status:
													'gutenberg_blocks_status' in
													selectedSCValue
														? selectedSCValue.gutenberg_blocks_status
														: true,
												dark: {
													defaultStyleCard: {
														...(selectedSCValue.dark
															?.defaultStyleCard ||
															{}),
														...(selectedSCValue.dark
															?.styleCard || {}),
													},
													styleCard:
														newDarkStyleCardOverrides,
												},
												light: {
													defaultStyleCard: {
														...(selectedSCValue
															.light
															?.defaultStyleCard ||
															{}),
														...(selectedSCValue
															.light?.styleCard ||
															{}),
													},
													styleCard:
														newLightStyleCardOverrides,
												},
												type: 'user',
												updated: currentDate,
											};

											// Conditionally add root color property
											if (
												shapedSourceCustomColors.length >
												0
											) {
												newStyleCard.color = {
													customColors: [
														...shapedSourceCustomColors,
													],
												};
											}

											saveImportedStyleCard(newStyleCard);
											setShowCopyCardDialog(false);
										}
									}}
								>
									{__('Create', 'maxi-blocks')}
								</Button>
								<Button
									onClick={() => setShowCopyCardDialog(false)}
								>
									{__('Cancel', 'maxi-blocks')}
								</Button>
							</div>
							{cardAlreadyExists && (
								<div className='maxi-style-cards__card-already-exists create-new-section'>
									<span>
										{__(
											'A card with this name already exists.'
										)}
									</span>
								</div>
							)}
						</div>
					)}

					<div
						className={
							isTemplate
								? 'maxi-style-card-settings-disabled'
								: 'maxi-style-card-settings'
						}
					>
						<SettingTabsControl
							disablePadding
							returnValue={({ key }) => setCurrentSCStyle(key)}
							items={[
								{
									label: __(
										'Light tone globals',
										'maxi-blocks'
									),
									key: 'light',
									content: (
										<MaxiStyleCardsTab
											SC={selectedSCValue.light}
											SCStyle='light'
											onChangeValue={onChangeValue}
											breakpoint={breakpoint}
											currentKey={selectedSCKey}
										/>
									),
								},
								{
									label: __(
										'Dark tone globals',
										'maxi-blocks'
									),
									key: 'dark',
									content: (
										<MaxiStyleCardsTab
											SC={selectedSCValue.dark}
											SCStyle='dark'
											onChangeValue={onChangeValue}
											breakpoint={breakpoint}
											currentKey={selectedSCKey}
										/>
									),
								},
							]}
						/>
					</div>
				</div>
			</Popover>
		)
	);
});

export default MaxiStyleCardsEditor;
