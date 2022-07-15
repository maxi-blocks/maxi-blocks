/* eslint-disable no-alert */
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PostPreviewButton } from '@wordpress/editor';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	showMaxiSCSavedActiveSnackbar,
	showMaxiSCSavedSnackbar,
	showMaxiSCAppliedActiveSnackbar,
	exportStyleCard,
} from './utils';
import {
	SettingTabsControl,
	SelectControl,
	Button,
	Icon,
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
			activeStyleCard,
			activeSCKey,
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

	const [styleCardName, setStyleCardName] = useState('');
	const [currentSCStyle, setCurrentSCStyle] = useState('light');

	useEffect(() => {
		if (selectedSCValue) updateSCOnEditor(selectedSCValue);
	}, [selectedSCKey]);

	const [toggleSettings, setToggleSettings] = useState(false);
	const toggleSettingsFn = () => {
		setToggleSettings(!toggleSettings);
	};

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
			attributes: selectedSCValue[currentSCStyle].styleCard[type],
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

	const getCurrentSCName = () => {
		if (!isNil(selectedSCValue)) {
			return selectedSCValue.name;
		}

		return 'Current Style Card';
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
	};

	const saveCurrentSC = () => {
		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: { ...selectedSCValue },
		};

		saveMaxiStyleCards(newStyleCards, true);
		saveSCStyles(true);
	};

	const activatedDate = '2019-01-01';

	const saveImportedStyleCard = card => {
		const newId = `sc_${new Date().getTime()}`;

		const newAllSCs = {
			...styleCards,
			[newId]: card,
		};

		saveMaxiStyleCards(newAllSCs);
		updateSCOnEditor(card);
		setSelectedStyleCard(newId);
	};

	return (
		!isEmpty(styleCards) && (
			<Popover
				noArrow
				position={isRTL ? 'top left right' : 'top right left'}
				className='maxi-style-cards__popover maxi-sidebar'
				focusOnMount
			>
				<h2 className='maxi-style-cards__popover__title'>
					<Icon icon={styleCardBoat} />

					<span className='active-sc-name'>
						<span className='active-sc-name-subtitle'>
							Activated
						</span>
						{activeStyleCard.value.name.substr(0, 20)}{' '}
						<span className='active-date'>{activatedDate}</span>
					</span>
					<span
						className='maxi-sc--close'
						onClick={() => setIsVisible(false)}
					>
						<Icon icon={closeIcon} />
					</span>
				</h2>
				<hr />
				<div className='maxi-style-cards__popover__content'>
					<MaxiModal type='sc' />
					<div className='sc-import'>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={media => {
									fetch(media.url)
										.then(response => response.json())
										.then(jsonData => {
											saveImportedStyleCard(jsonData);
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
										{__('Import card file', 'maxi-blocks')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
					</div>
				</div>
				<div className='sc-settings-wrapper'>
					<div className='maxi-style-cards__popover__sub-title'>
						{__('Previewing', 'maxi-blocks')}
					</div>
					<div className='maxi-style-cards__sc'>
						<div className='maxi-style-cards__sc__style-card'>
							<SelectControl
								className='maxi-style-cards__sc__more-sc--select'
								value={selectedSCKey}
								options={SCList}
								onChange={val => {
									setSelectedStyleCard(val);
								}}
							/>
							<Button
								disabled={!canBeRemoved(selectedSCKey)}
								className='maxi-style-cards__sc__more-sc--delete'
								onClick={() => {
									if (
										window.confirm(
											sprintf(
												__(
													'Are you sure you want to delete "%s" style card? You cannot undo it',
													'maxi-blocks'
												),
												styleCards[selectedSCKey].name
											)
										)
									) {
										removeStyleCard(selectedSCKey);

										if (activeSCKey === selectedSCKey)
											setActiveStyleCard('sc_maxi');
									}
								}}
							>
								<Icon icon={SCDelete} />
							</Button>
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
						<div className='maxi-style-cards__sc__more-sc'>
							<div className='active-sc-edit'>
								<Button onClick={toggleSettingsFn}>Edit</Button>
							</div>

							<div className='active-sc-activate'>
								<Button
									className='maxi-style-cards--activate'
									disabled={
										!canBeApplied(
											selectedSCKey,
											activeSCKey
										)
									}
									onClick={() => {
										if (
											window.confirm(
												sprintf(
													__(
														'Are you sure you want to apply "%s" style card? It will apply the styles to the whole site',
														'maxi-blocks'
													),
													getCurrentSCName
												)
											)
										) {
											applyCurrentSCGlobally();
											showMaxiSCAppliedActiveSnackbar(
												selectedSCValue.name
											);
										}
									}}
								>
									{__('Activate now', 'maxi-blocks')}
								</Button>
							</div>
						</div>
					</div>
					<hr />
					{toggleSettings && (
						<>
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

							<div className='custom-sc'>
								<div className='custom-sc-name'>
									Save new SC with current settings
								</div>
								<div className='maxi-style-cards__sc__add'>
									<input
										type='text'
										placeholder={__(
											'Add your Style Card Name here',
											'maxi-blocks'
										)}
										value={styleCardName}
										onChange={e =>
											setStyleCardName(e.target.value)
										}
									/>
									<Button
										className='maxi-style-cards__sc__add--button'
										disabled={isEmpty(styleCardName)}
										onClick={() => {
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
											};
											saveImportedStyleCard(newStyleCard);
										}}
									>
										{__('Add', 'maxi-blocks')}
									</Button>
								</div>
								<div className='maxi-style-cards__sc__ie'>
									{/* <PostPreviewButton
										className='maxi-style-cards__sc__actions--preview'
										textContent={__(
											'Preview',
											'maxi-blocks'
										)}
									/> */}
									{/* <Button
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
									</Button> */}
									{/* <Button
										className='maxi-style-cards__sc__actions--save'
										disabled={!canBeSaved(selectedSCKey)}
										onClick={() => {
											if (activeSCKey === selectedSCKey) {
												if (
													window.confirm(
														sprintf(
															__(
																'Are you sure you want to save active "%s" style card? It will apply new styles to the whole site',
																'maxi-blocks'
															),
															getCurrentSCName
														)
													)
												) {
													saveCurrentSC();
													showMaxiSCSavedActiveSnackbar(
														selectedSCValue.name
													);
												}
											} else {
												showMaxiSCSavedSnackbar(
													selectedSCValue.name
												);
												saveCurrentSC();
											}
										}}
									>
										{__('Save', 'maxi-blocks')}
									</Button> */}
									{/* <Button
										className='maxi-style-cards--activate'
										disabled={
											!canBeApplied(
												selectedSCKey,
												activeSCKey
											)
										}
										onClick={() => {
											if (
												window.confirm(
													sprintf(
														__(
															'Are you sure you want to activate "%s" style card? It will apply the styles to the whole site',
															'maxi-blocks'
														),
														getCurrentSCName
													)
												)
											) {
												applyCurrentSCGlobally();
												showMaxiSCAppliedActiveSnackbar(
													selectedSCValue.name
												);
											}
										}}
									>
										{__('Activate', 'maxi-blocks')}
									</Button> */}
								</div>
							</div>
						</>
					)}
				</div>
			</Popover>
		)
	);
};

export default MaxiStyleCardsEditor;
