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
	FancyRadioControl,
	SelectControl,
	Button,
	Icon,
} from '../../components';
import MaxiStyleCardsTab from './maxiStyleCardsTab';
import { updateSCOnEditor } from '../../extensions/style-cards';
import MaxiModal from '../library/modal';

/**
 * External dependencies
 */
import { isEmpty, isNil, isEqual } from 'lodash';

/**
 * Icons
 */
import { styleCardBoat, reset, SCDelete } from '../../icons';

const MaxiStyleCardsEditor = ({ styleCards }) => {
	const {
		isRTL,
		deviceType,
		SCList,
		activeSCKey,
		savedStyleCards,
		selectedSCKey,
		selectedSCValue,
	} = useSelect(select => {
		const { getEditorSettings } = select('core/editor');
		const { isRTL } = getEditorSettings();

		const { receiveMaxiDeviceType } = select('maxiBlocks');
		const deviceType = receiveMaxiDeviceType();

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
			deviceType,
			SCList,
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
	} = useDispatch('maxiBlocks/style-cards');

	const [useCustomStyleCard, setUseCustomStyleCard] = useState(true);
	const [styleCardName, setStyleCardName] = useState('');
	const [currentSCStyle, setCurrentSCStyle] = useState('light');

	useEffect(() => {
		updateSCOnEditor(selectedSCValue);
	}, [selectedSCKey]);

	const canBeReset = keySC => {
		if (
			!isNil(styleCards[keySC]) &&
			(!isEmpty(styleCards[keySC].styleCard.light) ||
				!isEmpty(styleCards[keySC].styleCard.dark))
		)
			return true;

		return false;
	};

	const canBeSaved = keySC => {
		const currentSC = styleCards[keySC].styleCard;
		const savedSC = savedStyleCards[keySC]?.styleCard;

		if (!isEqual(currentSC, savedSC)) return true;

		return false;
	};

	const canBeApplied = keySC => {
		if (canBeSaved(keySC) || keySC !== selectedSCKey) return true;

		return false;
	};

	const canBeRemoved = keySC => {
		if (keySC === 'sc_maxi') return false;

		return true;
	};

	const onChangeValue = obj => {
		let newSC = { ...selectedSCValue };

		Object.entries(obj).forEach(([prop, value]) => {
			if (prop === 'typography') {
				Object.entries(value).forEach(([key, val]) => {
					if (isNil(val)) {
						delete value[key];
						delete selectedSCValue.styleCard[currentSCStyle][key];
					}
				});

				newSC = {
					...newSC,
					styleCard: {
						...newSC.styleCard,
						[currentSCStyle]: {
							...newSC.styleCard[currentSCStyle],
							...value,
						},
					},
				};
			} else {
				newSC = {
					...newSC,
					styleCard: {
						...newSC.styleCard,
						[currentSCStyle]: {
							...newSC.styleCard[currentSCStyle],
							[prop]: value,
						},
					},
				};
			}
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
	};

	const saveCurrentSC = () => {
		const newStyleCards = {
			...styleCards,
			[selectedSCKey]: { ...selectedSCValue },
		};

		saveMaxiStyleCards(newStyleCards, true);
	};

	const resetCurrentSC = () => {
		const resetStyleCards = {
			...styleCards,
			[selectedSCKey]: {
				...styleCards[selectedSCKey],
				styleCard: {
					light: {},
					dark: {},
				},
			},
		};

		saveMaxiStyleCards(resetStyleCards);
		updateSCOnEditor(resetStyleCards[selectedSCKey]);
	};

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
					{__('Style Card Editor', 'maxi-blocks')}
				</h2>
				<hr />
				<div className='maxi-style-cards__popover__sub-title'>
					{__(
						'Group of blocks composed with a similar style or layout',
						'maxi-blocks'
					)}
				</div>
				<div className='maxi-style-cards__sc'>
					<div className='maxi-style-cards__sc__more-sc'>
						<MaxiModal type='sc' />
						<SelectControl
							className='maxi-style-cards__sc__more-sc--select'
							value={selectedSCKey}
							options={SCList}
							onChange={val => {
								setSelectedStyleCard(val);
							}}
						/>
						<Button
							disabled={!canBeReset(selectedSCKey)}
							className='maxi-style-cards__sc__more-sc--reset'
							onClick={() => {
								if (
									window.confirm(
										sprintf(
											__(
												'Are you sure to reset "%s" style card\'s styles to defaults? Don\'t forget to apply the changes after',
												'maxi-blocks'
											),
											getCurrentSCName
										)
									)
								) {
									resetCurrentSC();
								}
							}}
						>
							<Icon icon={reset} />
						</Button>
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
					</div>
					<div className='maxi-style-cards__sc__actions'>
						<PostPreviewButton
							className='maxi-style-cards__sc__actions--preview'
							textContent={__('Preview', 'maxi-blocks')}
						/>
						<Button
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
						</Button>
						<Button
							className='maxi-style-cards__sc__actions--apply'
							disabled={!canBeApplied(selectedSCKey)}
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
							{__('Apply', 'maxi-blocks')}
						</Button>
					</div>
					<FancyRadioControl
						label={__('Use Custom Style Card', 'maxi-blocks')}
						className='maxi-sc-color-palette__custom'
						selected={useCustomStyleCard}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => setUseCustomStyleCard(val)}
					/>
					{!useCustomStyleCard && (
						<>
							<div className='maxi-style-cards__sc__save'>
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
									disabled={isEmpty(styleCardName)}
									onClick={() => {
										const newStyleCard = {
											name: styleCardName,
											status: '',
											styleCard: { dark: {}, light: {} },
											styleCardDefaults: {
												dark: {
													...selectedSCValue
														.styleCardDefaults.dark,
													...selectedSCValue.styleCard
														.dark,
												},
												light: {
													...selectedSCValue
														.styleCardDefaults
														.light,
													...selectedSCValue.styleCard
														.light,
												},
											},
										};
										saveImportedStyleCard(newStyleCard);
									}}
								>
									{__('Add', 'maxi-blocks')}
								</Button>
							</div>
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
								<MediaUploadCheck>
									<MediaUpload
										onSelect={media => {
											fetch(media.url)
												.then(response =>
													response.json()
												)
												.then(jsonData => {
													saveImportedStyleCard(
														jsonData
													);
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
						</>
					)}
				</div>
				<hr />
				{useCustomStyleCard && (
					<SettingTabsControl
						disablePadding
						returnValue={({ key }) => setCurrentSCStyle(key)}
						items={[
							{
								label: __('Light Style Preset', 'maxi-blocks'),
								key: 'light',
								content: (
									<MaxiStyleCardsTab
										SC={selectedSCValue}
										SCStyle='light'
										onChangeValue={onChangeValue}
										deviceType={deviceType}
										currentKey={selectedSCKey}
									/>
								),
							},
							{
								label: __('Dark Style Preset', 'maxi-blocks'),
								key: 'dark',
								content: (
									<MaxiStyleCardsTab
										SC={selectedSCValue}
										SCStyle='dark'
										onChangeValue={onChangeValue}
										deviceType={deviceType}
										currentKey={selectedSCKey}
									/>
								),
							},
						]}
					/>
				)}
			</Popover>
		)
	);
};

export default MaxiStyleCardsEditor;
