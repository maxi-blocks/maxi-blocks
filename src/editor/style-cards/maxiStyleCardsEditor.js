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
 * Internal dependencies
 */
import { exportStyleCard } from './utils';
import { SettingTabsControl, Button, Icon, DialogBox } from '../../components';
import MaxiStyleCardsTab from './maxiStyleCardsTab';
import { updateSCOnEditor } from '../../extensions/style-cards';
import MaxiModal from '../library/modal';
import { handleSetAttributes } from '../../extensions/maxi-block';
import standardSC from '../../../core/utils/defaultSC.json';

/**
 * External dependencies
 */
import { isEmpty, isNil, isEqual, cloneDeep, merge } from 'lodash';
import Select from 'react-select';

/**
 * Icons
 */
import { styleCardBoat, SCDelete, closeIcon } from '../../icons';

const MaxiStyleCardsEditor = forwardRef(({ styleCards, setIsVisible }, ref) => {
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
		const { key: activeSCKey, value: activeSCValue } = activeStyleCard;
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
			activeSCValue,
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
		`${activeSCValue?.name} - `
	);
	const [currentSCStyle, setCurrentSCStyle] = useState('light');

	const getIsUserCreatedStyleCard = (card = selectedSCValue) => {
		return card?.type === 'user';
	};

	const [isTemplate, setIsTemplate] = useState(!getIsUserCreatedStyleCard());
	const [showCopyCardDialog, setShowCopyCardDialog] = useState(false);
	const [activeSCColour, setActiveSCColour] = useState(
		activeStyleCard.value.light.defaultStyleCard.color[4]
	);
	const [activeSCColourTwo, setActiveSCColourTwo] = useState(
		activeStyleCard.value.light.defaultStyleCard.color[5]
	);

	useEffect(() => {
		if (selectedSCValue) {
			updateSCOnEditor(
				selectedSCValue,
				activeSCColour,
				activeSCColourTwo
			);
			setStyleCardName(`${selectedSCValue?.name} - `);

			const isUserCreatedSC = getIsUserCreatedStyleCard();
			setIsTemplate(!isUserCreatedSC);
			setShowCopyCardDialog(false);
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
		updateSCOnEditor(newSC, activeSCColour, activeSCColourTwo);
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
		updateSCOnEditor(card, activeSCColour, activeSCColourTwo);
		setSelectedStyleCard(newId);
	};

	const customiseInputRef = useRef();

	useEffect(() => {
		customiseInputRef?.current?.focus?.();
	}, [showCopyCardDialog]);

	const [isHiddenActivate, setIsHiddenActivate] = useState(true);
	const [isHiddenRemove, setIsHiddenRemove] = useState(true);

	const applyCurrentSCGlobally = () => {
		setActiveStyleCard(selectedSCKey);
		saveMaxiStyleCards(selectedSCValue);
		updateSCOnEditor(selectedSCValue);

		setActiveSCColour(selectedSCValue.light.defaultStyleCard.color[4]);
		setActiveSCColourTwo(selectedSCValue.light.defaultStyleCard.color[5]);

		const newStyleCards = cloneDeep(styleCards);

		Object.entries(newStyleCards).forEach(([key, value]) => {
			if (key === selectedSCKey)
				newStyleCards[key] = { ...value, status: 'active' };
			else newStyleCards[key] = { ...value, status: '' };
		});

		saveMaxiStyleCards(newStyleCards, true);
		saveSCStyles(true);

		setIsHiddenActivate(true);
	};

	const saveCurrentSC = () => {
		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: { ...selectedSCValue, ...{ status: '' } },
		};

		saveMaxiStyleCards(newStyleCards, true);
		saveSCStyles(false);
	};

	const deleteSC = () => {
		removeStyleCard(selectedSCKey);

		if (activeSCKey === selectedSCKey) setActiveStyleCard('sc_maxi');
		setIsHiddenRemove(true);
	};

	const [cardAlreadyExists, setCardAlreadyExists] = useState(false);
	const [importedCardExists, setImportedCardExists] = useState(false);

	const currentDate = date(getSettings()?.formats?.date);

	const optionsSCList = () => {
		const response = [];

		!isEmpty(styleCards) &&
			Object.entries(styleCards).map(([key, val], i) => {
				if (val?.type !== 'user')
					response.push({
						label: `${__('Template', 'maxi-blocks')}: ${val.name}`,
						value: key,
					});
				else if (!isEmpty(val?.updated))
					response.push({
						label: `${val.name} - ${val.updated}`,
						value: key,
					});
				else
					response.push({
						label: `${val.name}`,
						value: key,
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
	const customStyles = {
		option: (base, state) => ({
			...base,
			padding: '8px',
			whiteSpace: 'wrap',
			borderBottom: state ? '1px solid #E3E3E3' : 'none',
			width: 'auto',
		}),
		control: () => ({
			display: 'flex',
			padding: '0',
			marginBottom: '8px',
			borderRadius: '0px',
			border: '1px solid rgb(var(--maxi-light-color-4))',
		}),
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
									{__('Imported card already exists.')}
								</span>
							</div>
						)}
						<div className='maxi-style-cards__active-edit-options'>
							<Select
								defaultMenuIsOpen
								className='maxi-style-cards__sc__more-sc--select'
								options={optionsSCList()}
								value={selectedSCValue.name}
								placeholder={selectedSCValue.name}
								styles={customStyles}
								onChange={val => {
									setSelectedStyleCard(val.value);
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
									disabled={
										!canBeRemoved(
											selectedSCKey,
											activeSCKey
										)
									}
									className='maxi-style-cards__sc__more-sc--delete has-tooltip'
									onClick={() => setIsHiddenRemove(false)}
								>
									<span className='tooltip'>
										{__('Delete', 'maxi-blocks')}
									</span>
									<Icon icon={SCDelete} />
								</Button>
							</DialogBox>
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
									!canBeApplied(selectedSCKey, activeSCKey)
								}
								onClick={() => setIsHiddenActivate(false)}
							>
								{(isTemplate || !canBeSaved(selectedSCKey)) &&
									__('Activate now', 'maxi-blocks')}
								{!isTemplate &&
									canBeSaved(selectedSCKey) &&
									__('Save and activate now', 'maxi-blocks')}
							</Button>
						</DialogBox>
					</div>
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
