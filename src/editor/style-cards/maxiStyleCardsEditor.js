/* eslint-disable no-alert */
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PostPreviewButton } from '@wordpress/editor';
import { Popover } from '@wordpress/components';

/**
 * External dependencies
 */
import { isEmpty, isNil, forIn } from 'lodash';
import { React } from 'react';

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
import {
	getActiveStyleCard,
	updateSCOnEditor,
} from '../../extensions/style-cards';

/**
 * Icons
 */
import { styleCardBoat, reset, SCDelete, SCaddMore } from '../../icons';

const MaxiStyleCardsEditor = ({ styleCards }) => {
	const { isRTL, deviceType } = useSelect(select => {
		const { getEditorSettings } = select('core/editor');
		const { isRTL } = getEditorSettings();

		const { receiveMaxiDeviceType } = select('maxiBlocks');
		const deviceType = receiveMaxiDeviceType();

		return {
			isRTL,
			deviceType,
		};
	});
	const { saveMaxiStyleCards } = useDispatch('maxiBlocks/style-cards');

	const [currentSC, changeCurrentSC] = useState(styleCards);
	const [styleCardName, setStyleCardName] = useState('');
	const [stateSC, changeStateSC] = useState(
		getActiveStyleCard(currentSC).value
	);
	const [currentSCKey, changeCurrentSCKey] = useState(
		getActiveStyleCard(currentSC).key
	);

	const getStyleCardsOptions = () => {
		const styleCardsArr = [];
		forIn(currentSC, (value, key) =>
			styleCardsArr.push({
				label: value.name,
				value: key,
			})
		);
		return styleCardsArr;
	};

	const addActiveSCClass = keySC => {
		const selectArr = document.querySelectorAll(
			'.maxi-style-cards__sc__more-sc--select option'
		);
		if (!isNil(selectArr)) {
			selectArr.forEach(option => {
				if (option.value === keySC)
					option.classList.add('maxi-current-option');
				else option.classList.remove('maxi-current-option');
			});
		}
	};

	const setStyleCardActive = cardKey => {
		forIn(currentSC, function get(value, key) {
			if (value.status === 'active' && cardKey !== key) value.status = '';
			if (cardKey === key) value.status = 'active';
		});
		changeCurrentSC(currentSC);
		changeStateSC(getActiveStyleCard(currentSC).value);
		updateSCOnEditor(getActiveStyleCard(currentSC).value);
	};

	const getStyleCardCurrentValue = cardKey => {
		let styleCardCurrentValue = {};
		if (!isNil(currentSC)) {
			forIn(currentSC, function get(value, key) {
				if (key === cardKey) styleCardCurrentValue = value;
			});
			if (!isNil(styleCardCurrentValue)) return styleCardCurrentValue;
			return false;
		}
		return false;
	};

	const canBeReset = keySC => {
		if (
			!isNil(currentSC[keySC]) &&
			(!isEmpty(currentSC[keySC].styleCard.light) ||
				!isEmpty(currentSC[keySC].styleCard.dark))
		)
			return true;
		return false;
	};

	const [canBeResetState, changeCanBeResetState] = useState(
		canBeReset(currentSCKey)
	);

	const [isSaveDisabled, setIsSaveDisabled] = useState(true);
	const [isApplyDisabled, setIsApplyDisabled] = useState(true);

	const onChangeValue = (
		prop,
		value,
		style,
		globalAttr = false,
		globalVal
	) => {
		let newStateSC = {};

		if (prop === 'typography') {
			Object.entries(value).forEach(([key, val]) => {
				if (isNil(val)) {
					delete value[key];
					delete stateSC.styleCard[style][key];
				}
			});

			newStateSC = {
				...stateSC,
				styleCard: {
					...stateSC.styleCard,
					[style]: { ...stateSC.styleCard[style], ...value },
				},
			};
		} else if (!globalAttr) {
			newStateSC = {
				...stateSC,
				styleCard: {
					...stateSC.styleCard,
					[style]: { ...stateSC.styleCard[style], [prop]: value },
				},
			};
		} else {
			newStateSC = {
				...stateSC,
				styleCard: {
					...stateSC.styleCard,
					[style]: {
						...stateSC.styleCard[style],
						[prop]: value,
						[`${prop}-global`]: globalVal,
					},
				},
			};
		}

		changeStateSC(newStateSC);
		updateSCOnEditor(newStateSC);
		changeCanBeResetState(canBeReset(currentSCKey));
		setIsSaveDisabled(false);
		setIsApplyDisabled(false);
	};

	const currentSCname = () => {
		if (!isNil(stateSC)) {
			return stateSC.name;
		}
		return 'Current Style Card';
	};

	const isDefaultOrActive = keySC => {
		if (keySC === 'sc_maxi') return true;

		if (!isNil(currentSC[keySC]) && currentSC[keySC].status === 'active')
			return true;

		return false;
	};

	const [isDefaultOrActiveState, changeIsDefaultOrActiveState] = useState(
		isDefaultOrActive(currentSCKey)
	);

	const isActive = keySC => {
		if (!isNil(currentSC[keySC]) && currentSC[keySC].status === 'active')
			return true;

		return false;
	};

	const applyCurrentSCGlobally = () => {
		changeIsDefaultOrActiveState(isDefaultOrActive(currentSCKey));
		setStyleCardActive(currentSCKey);

		const newStyleCards = {
			...currentSC,
			[currentSCKey]: {
				...stateSC,
				status: 'active',
			},
		};

		changeStateSC(stateSC);
		updateSCOnEditor(stateSC);

		addActiveSCClass(currentSCKey);
		changeCanBeResetState(canBeReset(currentSCKey));

		saveMaxiStyleCards(newStyleCards);
		setIsApplyDisabled(true);
		setIsSaveDisabled(true);
	};

	const saveCurrentSC = () => {
		const newStyleCards = {
			...currentSC,
			[currentSCKey]: {
				name: stateSC.name,
				status: stateSC.status,
				styleCard: stateSC.styleCard,
				styleCardDefaults: stateSC.styleCardDefaults,
			},
		};

		changeCanBeResetState(canBeReset(currentSCKey));
		changeCurrentSC(newStyleCards);
		saveMaxiStyleCards(newStyleCards);
		setIsSaveDisabled(true);
	};

	const resetCurrentSC = () => {
		const resetStyleCard = {
			...currentSC[currentSCKey],
			styleCard: {
				light: {},
				dark: {},
			},
		};

		const resetStyleCards = {
			...currentSC,
			[currentSCKey]: {
				...currentSC[currentSCKey],
				styleCard: {
					light: {},
					dark: {},
				},
			},
		};

		changeStateSC(resetStyleCard);
		updateSCOnEditor(resetStyleCard);
		changeCurrentSC(resetStyleCards);

		setIsApplyDisabled(false);
		setIsSaveDisabled(false);
	};

	const saveImportedStyleCard = card => {
		changeStateSC(card);
		updateSCOnEditor(card);

		const newId = `sc_${new Date().getTime()}`;

		const newAllSCs = {
			...currentSC,
			[newId]: card,
		};

		saveMaxiStyleCards(newAllSCs);
		changeCurrentSCKey(newId);
		changeCurrentSC(newAllSCs);
		changeIsDefaultOrActiveState(false);

		setIsSaveDisabled(true);
		setIsApplyDisabled(false);
	};

	const switchCurrentSC = keySC => {
		saveCurrentSC(currentSCKey);
		changeCurrentSCKey(keySC);
		changeStateSC(getStyleCardCurrentValue(keySC));
		updateSCOnEditor(getStyleCardCurrentValue(keySC));
		changeIsDefaultOrActiveState(isDefaultOrActive(keySC));

		setIsApplyDisabled(false);
	};

	const [useCustomStyleCard, setUseCustomStyleCard] = useState(true);

	return (
		!isEmpty(currentSC) && (
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
						<Button
							className='maxi-style-cards__sc__more-sc--add-more'
							onClick={() => {
								// TO DO: add cloud modal for SCs here
							}}
						>
							<Icon icon={SCaddMore} />
						</Button>
						<SelectControl
							className='maxi-style-cards__sc__more-sc--select'
							value={currentSCKey}
							options={getStyleCardsOptions()}
							onChange={val => {
								switchCurrentSC(val);
							}}
						/>
						<Button
							disabled={!canBeResetState}
							className='maxi-style-cards__sc__more-sc--reset'
							onClick={() => {
								if (
									window.confirm(
										sprintf(
											__(
												'Are you sure to reset "%s" style card\'s styles to defaults? Don\'t forget to apply the changes after',
												'maxi-blocks'
											),
											currentSCname
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
							disabled={isDefaultOrActiveState}
							className='maxi-style-cards__sc__more-sc--delete'
							onClick={() => {
								const newStyleCards = {
									...currentSC,
								};

								if (
									window.confirm(
										sprintf(
											__(
												'Are you sure you want to delete "%s" style card? You cannot undo it',
												'maxi-blocks'
											),
											currentSC[currentSCKey].name
										)
									)
								) {
									delete newStyleCards[currentSCKey];
									changeCurrentSCKey('sc_maxi');
									changeCurrentSC(newStyleCards);
									changeIsDefaultOrActiveState(true);
									changeStateSC(
										getStyleCardCurrentValue('sc_maxi')
									);
									updateSCOnEditor(
										getStyleCardCurrentValue('sc_maxi')
									);
									saveMaxiStyleCards(newStyleCards);
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
							disabled={isSaveDisabled}
							onClick={() => {
								if (isActive(currentSCKey)) {
									if (
										window.confirm(
											sprintf(
												__(
													'Are you sure you want to save active "%s" style card? It will apply new styles to the whole site',
													'maxi-blocks'
												),
												currentSCname
											)
										)
									) {
										saveCurrentSC();
										showMaxiSCSavedActiveSnackbar(
											stateSC.name
										);
									}
								} else {
									showMaxiSCSavedSnackbar(stateSC.name);
									saveCurrentSC();
								}
							}}
						>
							{__('Save', 'maxi-blocks')}
						</Button>
						<Button
							className='maxi-style-cards__sc__actions--apply'
							disabled={isApplyDisabled}
							onClick={() => {
								if (
									window.confirm(
										sprintf(
											__(
												'Are you sure you want to apply "%s" style card? It will apply the styles to the whole site',
												'maxi-blocks'
											),
											currentSCname
										)
									)
								) {
									applyCurrentSCGlobally();
									showMaxiSCAppliedActiveSnackbar(
										stateSC.name
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
													...stateSC.styleCardDefaults
														.dark,
													...stateSC.styleCard.dark,
												},
												light: {
													...stateSC.styleCardDefaults
														.light,
													...stateSC.styleCard.light,
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
										const fileName = `${stateSC.name}.txt`;
										exportStyleCard(
											{
												...stateSC,
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
						items={[
							{
								label: __('Light Style Preset', 'maxi-blocks'),
								content: (
									<MaxiStyleCardsTab
										SC={stateSC}
										SCStyle='light'
										onChangeValue={onChangeValue}
										addActiveSCClass={addActiveSCClass}
										deviceType={deviceType}
										currentKey={currentSCKey}
									/>
								),
							},
							{
								label: __('Dark Style Preset', 'maxi-blocks'),
								content: (
									<MaxiStyleCardsTab
										SC={stateSC}
										SCStyle='dark'
										onChangeValue={onChangeValue}
										addActiveSCClass={addActiveSCClass}
										deviceType={deviceType}
										currentKey={currentSCKey}
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
