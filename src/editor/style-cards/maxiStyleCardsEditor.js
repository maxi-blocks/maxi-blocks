/* eslint-disable no-alert */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef, forwardRef } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { getSettings, date } from '@wordpress/date';
import { Popover } from '@wordpress/components';

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

	useEffect(() => {
		if (selectedSCValue) {
			updateSCOnEditor(selectedSCValue, activeSCColour);
			setStyleCardName(`${selectedSCValue?.name} - `);

			const isUserCreatedSC = getIsUserCreatedStyleCard();
			setIsTemplate(!isUserCreatedSC);
			setShowCopyCardDialog(false);
		}
	}, [selectedSCKey]);

	const canBeSaved = keySC => {
		const currentSC = {
			light: styleCards[keySC].light.styleCard,
			dark: styleCards[keySC].dark.styleCard,
		};
		const savedSC = {
			light: savedStyleCards[keySC]?.light.styleCard,
			dark: savedStyleCards[keySC]?.dark.styleCard,
		};

		if (
			!isEqual(currentSC, savedSC) ||
			styleCards[keySC]?.gutenberg_blocks_status !==
				savedStyleCards[keySC]?.gutenberg_blocks_status
		)
			return true;

		return false;
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
		saveMaxiStyleCards(newStyleCards);
		updateSCOnEditor(newSC, activeSCColour);
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
		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: {
				...selectedSCValue,
				...{ status: isChosenActive ? 'active' : '' },
			},
		};

		if (isChosenActive) {
			setActiveSCColour(getActiveColourFromSC(selectedSCValue, 4));
			updateSCOnEditor(
				selectedSCValue,
				getActiveColourFromSC(selectedSCValue, 4)
			);
		}

		saveMaxiStyleCards(newStyleCards, true);
		saveSCStyles(isChosenActive);
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

		saveMaxiStyleCards(newStyleCards);
		updateSCOnEditor(newStyleCards[selectedSCKey], activeSCColour);
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
														...selectedSCValue.dark
															.defaultStyleCard,
														...selectedSCValue.dark
															.styleCard,
													},
													styleCard: {},
												},
												light: {
													defaultStyleCard: {
														...selectedSCValue.light
															.defaultStyleCard,
														...selectedSCValue.light
															.styleCard,
													},
													styleCard: {},
												},
												type: 'user',
												updated: currentDate,
											};
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
