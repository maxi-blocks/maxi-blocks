/* eslint-disable no-alert */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { getSettings, date } from '@wordpress/date';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	// showMaxiSCSavedActiveSnackbar,
	// showMaxiSCSavedSnackbar,
	// showMaxiSCAppliedActiveSnackbar,
	exportStyleCard,
} from './utils';
import {
	SettingTabsControl,
	SelectControl,
	Button,
	Icon,
	DialogBox,
} from '../../components';
import MaxiStyleCardsTab from './maxiStyleCardsTab';
import { updateSCOnEditor } from '../../extensions/style-cards';
import MaxiModal from '../library/modal';
import { handleSetAttributes } from '../../extensions/maxi-block';

/**
 * External dependencies
 */
import { isEmpty, isNil, isEqual } from 'lodash';

/**
 * Icons
 */
import { styleCardBoat, SCDelete, closeIcon } from '../../icons';

const MaxiStyleCardsEditor = ({ styleCards, setIsVisible }) => {
	const {
		isRTL,
		breakpoint,
		SCList,
		activeSCKey,
		activeStyleCard,
		savedStyleCards,
		selectedSCKey,
		selectedSCValue,
	} = useSelect(select => {
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

		const SCList = receiveStyleCardsList();
		const activeStyleCard = receiveMaxiActiveStyleCard();
		const { key: activeSCKey } = activeStyleCard;
		const savedStyleCards = receiveSavedMaxiStyleCards();
		const selectedStyleCard = receiveMaxiSelectedStyleCard();
		const { key: selectedSCKey, value: selectedSCValue } =
			selectedStyleCard;

		return {
			isRTL,
			breakpoint,
			SCList,
			activeSCKey,
			activeStyleCard,
			savedStyleCards,
			selectedSCKey,
			selectedSCValue,
		};
	});

	const {
		saveMaxiStyleCards,
		setActiveStyleCard,
		removeStyleCard,
		setSelectedStyleCard,
		saveSCStyles,
	} = useDispatch('maxiBlocks/style-cards');

	const [styleCardName, setStyleCardName] = useState(
		`${selectedSCValue?.name} - `
	);
	const [currentSCStyle, setCurrentSCStyle] = useState('light');

	useEffect(() => {
		const activeSCColour =
			activeStyleCard.value.light.defaultStyleCard.color[4];
		const activeSCColourTwo =
			activeStyleCard.value.light.defaultStyleCard.color[5];
		if (selectedSCValue) {
			updateSCOnEditor(
				selectedSCValue,
				activeSCColour,
				activeSCColourTwo
			);
			setStyleCardName(`${selectedSCValue?.name} - `);
		}
	}, [selectedSCKey]);

	const canBeSaved = keySC => {
		const currentSC = {
			...styleCards[keySC].light.styleCard,
			...styleCards[keySC].dark.styleCard,
		};
		const savedSC = {
			...savedStyleCards[keySC]?.light.styleCard,
			...savedStyleCards[keySC]?.dark.styleCard,
		};

		if (!isEqual(currentSC, savedSC)) return true;

		return false;
	};

	const canBeApplied = (keySC, activeSCKey) => {
		if (canBeSaved(keySC) || keySC !== activeSCKey) return true;

		return false;
	};

	const canBeRemoved = keySC => {
		if (keySC === 'sc_maxi') return false;

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
		updateSCOnEditor(newSC);
	};

	const [postDate, setPostDate] = useState();

	const saveImportedStyleCard = card => {
		const newId = `sc_${new Date().getTime()}`;

		const newAllSCs = {
			...styleCards,
			[newId]: card,
		};

		saveMaxiStyleCards(newAllSCs, true);
		updateSCOnEditor(card);
		setSelectedStyleCard(newId);
	};

	const [settings, setSettings] = useState(false);

	const [settingsDisabled, setSettingsDisabled] = useState(true);

	const customiseInputRef = useRef();

	useEffect(() => {
		customiseInputRef?.current?.focus?.();
	}, [settings]);

	const showSettings = () => {
		setSettings(true);
	};
	const cancelSettings = () => {
		setSettings(false);
	};

	const enableSettings = () => {
		setSettingsDisabled(false);
	};

	const disableSettings = () => {
		setSettingsDisabled(true);
	};

	const [isHiddenActivate, setIsHiddenActivate] = useState(true);
	const [isHiddenSave, setIsHiddenSave] = useState(true);
	const [isHiddenRemove, setIsHiddenRemove] = useState(true);

	const openDialog = type => {
		switch (type) {
			case 'activate':
				setIsHiddenActivate(false);
				break;
			case 'save':
				setIsHiddenSave(false);
				break;
			case 'remove':
				setIsHiddenRemove(false);
				break;
			default:
				break;
		}
	};
	const removeDialog = type => {
		switch (type) {
			case 'activate':
				setIsHiddenActivate(true);
				break;
			case 'save':
				setIsHiddenSave(true);
				break;
			case 'remove':
				setIsHiddenRemove(true);
				break;
			default:
				break;
		}
	};

	const applyCurrentSCGlobally = () => {
		setActiveStyleCard(selectedSCKey);

		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: {
				...selectedSCValue,
				status: 'active',
			},
		};

		saveMaxiStyleCards(selectedSCValue);
		updateSCOnEditor(selectedSCValue);

		saveMaxiStyleCards(newStyleCards, true);
		saveSCStyles(true);

		setIsHiddenActivate(true);
	};

	const saveChanges = () => {
		const current = new Date();
		const date = `${current.getDate()}/${
			current.getMonth() + 1
		}/${current.getFullYear()}`;
		setPostDate(date);

		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: { ...selectedSCValue },
		};

		saveMaxiStyleCards(newStyleCards, true);
		saveSCStyles(true);
		setIsHiddenSave(true);
	};

	const deleteSC = () => {
		removeStyleCard(selectedSCKey);
		disableSettings();
		if (activeSCKey === selectedSCKey) setActiveStyleCard('sc_maxi');
		setIsHiddenRemove(true);
	};

	const [cardAlreadyExists, setCardAlreadyExists] = useState(false);
	const [importedCardExists, setImportedCardExists] = useState(false);

	const currentDate = date(getSettings()?.formats?.date);

	return (
		!isEmpty(styleCards) && (
			<Popover
				noArrow
				position={isRTL ? 'top left right' : 'top right left'}
				className='maxi-style-cards__popover maxi-sidebar'
				focusOnMount
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
						<span className='tooltip'>Close</span>
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
										.then(response => response.json())
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
					</div>
					<div className='maxi-style-cards__active-edit'>
						<div className='maxi-style-cards__active-edit-title'>
							<h3>Style card editor</h3>
							<span>Preview, edit or activate style card</span>
						</div>
						{importedCardExists && (
							<div className='maxi-style-cards__card-already-exists'>
								<span>
									{__('Imported card already exists.')}
								</span>
							</div>
						)}
						<div className='maxi-style-cards__active-edit-options'>
							<SelectControl
								className='maxi-style-cards__sc__more-sc--select'
								value={selectedSCKey}
								options={SCList}
								onChange={val => {
									setSelectedStyleCard(val);
									disableSettings();
									cancelSettings();
								}}
							/>
							<DialogBox
								isDisabled={isHiddenRemove}
								message={__(
									`Deleting${` ${selectedSCValue.name} `}style card. This action is permanent.`,
									'maxi-blocks'
								)}
								cancel={__('Cancel', 'maxi-blocks')}
								confirm={__('Delete', 'maxi-blocks')}
								onCancel={() => setIsHiddenRemove(true)}
								onConfirm={deleteSC}
							>
								<Button
									disabled={!canBeRemoved(selectedSCKey)}
									className='maxi-style-cards__sc__more-sc--delete has-tooltip'
									onClick={() => setIsHiddenRemove(false)}
								>
									<span className='tooltip'>Delete</span>
									<Icon icon={SCDelete} />
								</Button>
							</DialogBox>

							<div className='maxi-style-cards__sc__ie'>
								<Button
									className='maxi-style-cards__sc__ie--export'
									disabled={false}
									onClick={() => {
										const fileName = `${selectedSCValue.name}.txt`;
										exportStyleCard(
											{
												...selectedSCValue,
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
					</div>
					{!settings && (
						<div className='maxi-style-cards__sc__actions edit-activate'>
							<Button
								className='maxi-style-cards-customise-card-button'
								onClick={showSettings}
							>
								{__('Customise card', 'maxi-blocks')}
							</Button>
							<DialogBox
								isDisabled={isHiddenActivate}
								message={__(
									`Activate new style. Customized blocks will not change. All other Maxi blocks will get new,${` "${selectedSCValue.name}" `}styles.`,
									'maxi-blocks'
								)}
								cancel={__('Cancel', 'maxi-blocks')}
								confirm={__('Activate', 'maxi-blocks')}
								onCancel={() => setIsHiddenActivate(true)}
								onConfirm={applyCurrentSCGlobally}
							>
								<Button
									className='maxi-style-cards__sc__actions--apply'
									disabled={
										!canBeApplied(
											selectedSCKey,
											activeSCKey
										)
									}
									onClick={() => setIsHiddenActivate(false)}
								>
									{__('Activate now', 'maxi-blocks')}
								</Button>
							</DialogBox>
						</div>
					)}
				</div>

				{settings && (
					<div className='maxi-style-cards__sc maxi-style-cards__settings'>
						<div className='maxi-style-cards__sc-custom-name'>
							<h3>
								{__('Create new style from', 'maxi-blocks')}
								<b> {selectedSCValue.name}</b>
							</h3>

							<div className='maxi-style-cards__sc__save'>
								<input
									type='text'
									maxLength='40'
									placeholder={__(
										'Short memorable name*',
										'maxi-blocks'
									)}
									value={styleCardName}
									onChange={e =>
										setStyleCardName(e.target.value)
									}
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
											enableSettings();
										}
									}}
								>
									{__('Create', 'maxi-blocks')}
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
						<div className='maxi-style-cards__sc-cancel-save'>
							<Button onClick={cancelSettings}>
								{__('Cancel', 'maxi-blocks')}
							</Button>
							<DialogBox
								isDisabled={isHiddenSave}
								message={__(
									'Are you sure you want to activate this style card?',
									'maxi-blocks'
								)}
								cancel={__('Cancel', 'maxi-blocks')}
								confirm={__('Activate', 'maxi-blocks')}
								onCancel={() => setIsHiddenSave(true)}
								onConfirm={saveChanges}
							>
								{canBeSaved(selectedSCKey) &&
								!settingsDisabled ? (
									<Button
										className='maxi-style-cards__sc__actions--save'
										disabled={!canBeSaved(selectedSCKey)}
										onClick={() => setIsHiddenSave(false)}
									>
										{__('Save & Activate', 'maxi-blocks')}
									</Button>
								) : (
									<Button
										className='maxi-style-cards__sc__actions--save'
										disabled={!!settingsDisabled}
										onClick={() => setIsHiddenSave(false)}
									>
										{__('Activate', 'maxi-blocks')}
									</Button>
								)}
							</DialogBox>
						</div>
						<div
							className={
								settingsDisabled
									? 'maxi-style-card-settings-disabled'
									: 'maxi-style-card-settings'
							}
						>
							<SettingTabsControl
								disablePadding
								returnValue={({ key }) =>
									setCurrentSCStyle(key)
								}
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
				)}
			</Popover>
		)
	);
};

export default MaxiStyleCardsEditor;
