/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { select, dispatch, useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PostPreviewButton } from '@wordpress/editor';
import { Button, SelectControl, Popover, Icon } from '@wordpress/components';

/**
 * External dependencies
 */
import { isEmpty, isNil, forIn } from 'lodash';
import { React } from 'react';

/**
 * Internal dependencies
 */
import { SettingTabsControl, FancyRadioControl } from '../../components';
import MaxiStyleCardsTab from './maxiStyleCardsTab';
import getStyleCards from '../../extensions/styles/defaults/style-card/getStyleCards';

/**
 * Icons
 */
import { styleCardBoat, reset, SCdelete, SCaddMore } from '../../icons';

const MaxiStyleCardsEditor = () => {
	const { isRTL, deviceType, receiveMaxiStyleCards } = useSelect(select => {
		const { getEditorSettings } = select('core/editor');
		const { isRTL } = getEditorSettings();

		const { receiveMaxiStyleCards } = select('maxiBlocks/style-cards');

		const { receiveMaxiDeviceType } = select('maxiBlocks');
		const deviceType = receiveMaxiDeviceType();

		return {
			isRTL,
			deviceType,
			receiveMaxiStyleCards,
		};
	});
	const { saveMaxiStyleCards } = useDispatch('maxiBlocks/style-cards');

	const [currentSC, changeCurrentSC] = useState(receiveMaxiStyleCards());

	const [styleCardName, setStyleCardName] = useState('');

	const allStyleCards = getStyleCards(currentSC);

	const getStyleCardActiveKey = () => {
		let styleCardActive = '';
		if (allStyleCards) {
			forIn(allStyleCards, function get(value, key) {
				if (value.status === 'active') styleCardActive = key;
			});

			return styleCardActive;
		}
		return false;
	};

	const getStyleCardActiveValue = () => {
		let styleCardActiveValue = {};
		if (!isNil(allStyleCards)) {
			forIn(allStyleCards, function get(value, key) {
				if (value.status === 'active') styleCardActiveValue = value;
			});
			if (!isNil(styleCardActiveValue)) return styleCardActiveValue;
			return false;
		}
		return false;
	};

	const [stateSC, changeStateSC] = useState(getStyleCardActiveValue());

	const [currentSCkey, changeCurrentSCkey] = useState(
		getStyleCardActiveKey()
	);

	const getStyleCardsOptions = () => {
		const styleCardsArr = [];
		forIn(allStyleCards, (value, key) =>
			styleCardsArr.push({
				label: value.name,
				value: key,
			})
		);
		return styleCardsArr;
	};

	const addActiveSCclass = keySC => {
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

	const changeSConBackend = SC => {
		// Light
		Object.entries(SC.styleCardDefaults.light).forEach(([key, val]) => {
			document.documentElement.style.setProperty(
				`--maxi-light-${key}`,
				val
			);
		});
		Object.entries(SC.styleCard.light).forEach(([key, val]) => {
			document.documentElement.style.setProperty(
				`--maxi-light-${key}`,
				val
			);
		});
		// Dark
		Object.entries(SC.styleCardDefaults.dark).forEach(([key, val]) => {
			document.documentElement.style.setProperty(
				`--maxi-dark-${key}`,
				val
			);
		});
		Object.entries(SC.styleCard.dark).forEach(([key, val]) => {
			document.documentElement.style.setProperty(
				`--maxi-dark-${key}`,
				val
			);
		});
	};

	const setStyleCardActive = cardKey => {
		forIn(allStyleCards, function get(value, key) {
			if (value.status === 'active' && cardKey !== key) value.status = '';
			if (cardKey === key) value.status = 'active';
		});
		changeCurrentSC(allStyleCards);
		changeStateSC(getStyleCardActiveValue());
		changeSConBackend(getStyleCardActiveValue());
	};

	const getStyleCardCurrentValue = cardKey => {
		let styleCardCurrentValue = {};
		if (!isNil(allStyleCards)) {
			forIn(allStyleCards, function get(value, key) {
				if (key === cardKey) styleCardCurrentValue = value;
			});
			if (!isNil(styleCardCurrentValue)) return styleCardCurrentValue;
			return false;
		}
		return false;
	};

	const canBeResetted = keySC => {
		if (
			!isNil(allStyleCards[keySC]) &&
			(!isEmpty(allStyleCards[keySC].styleCard.light) ||
				!isEmpty(allStyleCards[keySC].styleCard.dark))
		)
			return true;
		return false;
	};

	const [canBeResettedState, changeCanBeResettedState] = useState(
		canBeResetted(currentSCkey)
	);

	const onChangeDelete = (prop, style) => {
		const newStateSC = stateSC;

		delete newStateSC.styleCard[style][prop];

		if (prop.includes('general')) {
			const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];
			breakpoints.forEach(breakpoint => {
				const newProp = prop.replace('general', breakpoint);
				delete newStateSC.styleCard[style][newProp];
			});
		}

		const inlineStyles = document.getElementById(
			'maxi-blocks-sc-vars-inline-css'
		);
		if (!isNil(inlineStyles))
			inlineStyles.parentNode.removeChild(inlineStyles);
		document.documentElement.style.removeProperty(
			`--maxi-${style}-${prop}`
		);

		changeStateSC(newStateSC);
		changeCanBeResettedState(canBeResetted(currentSCkey));
	};

	const onChangeValue = (prop, value, style) => {
		let newStateSC = {};

		if (prop === 'typography') {
			newStateSC = {
				...stateSC,
				styleCard: {
					...stateSC.styleCard,
					[style]: { ...stateSC.styleCard[style], ...value },
				},
			};
		} else {
			newStateSC = {
				...stateSC,
				styleCard: {
					...stateSC.styleCard,
					[style]: { ...stateSC.styleCard[style], [prop]: value },
				},
			};
		}

		changeStateSC(newStateSC);
		changeSConBackend(newStateSC);
		changeCanBeResettedState(canBeResetted(currentSCkey));
	};

	const currentSCname = () => {
		if (!isNil(stateSC)) {
			return stateSC.name;
		}
		return 'Current Style Card';
	};

	const isDefaultOrActive = keySC => {
		if (keySC === 'sc_maxi') return true;

		if (
			!isNil(allStyleCards[keySC]) &&
			allStyleCards[keySC].status === 'active'
		)
			return true;

		return false;
	};

	const [isDefaultOrActiveState, changeIsDefaultOrActiveState] = useState(
		isDefaultOrActive(currentSCkey)
	);

	const isActive = keySC => {
		if (
			!isNil(allStyleCards[keySC]) &&
			allStyleCards[keySC].status === 'active'
		)
			return true;

		return false;
	};

	const applyCurrentSCglobally = () => {
		changeIsDefaultOrActiveState(isDefaultOrActive(currentSCkey));
		setStyleCardActive(currentSCkey);

		const newStyleCards = {
			...allStyleCards,
			[currentSCkey]: {
				...stateSC,
				status: 'active',
			},
		};

		changeStateSC(stateSC);
		changeSConBackend(stateSC);

		addActiveSCclass(currentSCkey);
		changeCanBeResettedState(canBeResetted(currentSCkey));

		saveMaxiStyleCards(newStyleCards);
	};

	const saveCurrentSC = () => {
		const newStyleCards = {
			...allStyleCards,
			[currentSCkey]: {
				name: stateSC.name,
				status: stateSC.status,
				styleCard: stateSC.styleCard,
				styleCardDefaults: stateSC.styleCardDefaults,
			},
		};

		changeCanBeResettedState(canBeResetted(currentSCkey));
		changeCurrentSC(newStyleCards);
		saveMaxiStyleCards(newStyleCards);
	};

	const resetCurrentSC = () => {
		const resetStyleCard = {
			...allStyleCards[currentSCkey],
			styleCard: {
				light: {},
				dark: {},
			},
		};

		const resetStyleCards = {
			...allStyleCards,
			[currentSCkey]: {
				...allStyleCards[currentSCkey],
				styleCard: {
					light: {},
					dark: {},
				},
			},
		};

		changeStateSC(resetStyleCard);
		changeSConBackend(resetStyleCard);
		changeCurrentSC(resetStyleCards);
	};

	const saveImportedStyleCard = card => {
		changeStateSC(card);
		changeSConBackend(card);

		const newId = `sc_${new Date().getTime()}`;

		const newAllSCs = {
			...allStyleCards,
			[newId]: card,
		};

		saveMaxiStyleCards(newAllSCs);
		changeCurrentSCkey(newId);
		changeCurrentSC(newAllSCs);
		changeIsDefaultOrActiveState(false);
	};

	const switchCurrentSC = keySC => {
		saveCurrentSC(currentSCkey);
		changeCurrentSCkey(keySC);
		changeStateSC(getStyleCardCurrentValue(keySC));
		changeSConBackend(getStyleCardCurrentValue(keySC));
		changeIsDefaultOrActiveState(isDefaultOrActive(keySC));
	};

	const showMaxiSCSavedActiveSnackbar = nameSC => {
		dispatch('core/notices').createNotice(
			'info',
			__(`${nameSC} saved`, 'maxi-blocks'),
			{
				isDismissible: true,
				type: 'snackbar',
				actions: [
					{
						onClick: () =>
							window.open(
								select('core/editor').getPermalink(),
								'_blank'
							),
						label: __('View', 'maxi-blocks'),
					},
				],
			}
		);
	};

	const showMaxiSCSavedSnackbar = nameSC => {
		dispatch('core/notices').createNotice(
			'info',
			__(`${nameSC} saved`, 'maxi-blocks'),
			{
				isDismissible: true,
				type: 'snackbar',
			}
		);
	};

	const showMaxiSCAppliedActiveSnackbar = nameSC => {
		dispatch('core/notices').createNotice(
			'info',
			__(`${nameSC} applied`, 'maxi-blocks'),
			{
				isDismissible: true,
				type: 'snackbar',
				actions: [
					{
						onClick: () =>
							window.open(
								select('core/editor').getPermalink(),
								'_blank'
							),
						label: __('View', 'maxi-blocks'),
					},
				],
			}
		);
	};

	const exportStyleCard = (data, fileName) => {
		const a = document.createElement('a');
		document.body.appendChild(a);
		a.style = 'display: none';

		const json = JSON.stringify(data);
		const blob = new Blob([json], { type: 'text/plain' });
		const url = window.URL.createObjectURL(blob);

		a.href = url;
		a.download = fileName;
		a.click();
		document.body.removeChild(a);
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
							value={currentSCkey}
							options={getStyleCardsOptions()}
							onChange={val => {
								switchCurrentSC(val);
							}}
						/>
						<Button
							disabled={!canBeResettedState}
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
									...allStyleCards,
								};

								if (
									window.confirm(
										sprintf(
											__(
												'Are you sure you want to delete "%s" style card? You cannot undo it',
												'maxi-blocks'
											),
											allStyleCards[currentSCkey].name
										)
									)
								) {
									delete newStyleCards[currentSCkey];
									changeCurrentSCkey('sc_maxi');
									changeCurrentSC(newStyleCards);
									changeIsDefaultOrActiveState(true);
									changeStateSC(
										getStyleCardCurrentValue('sc_maxi')
									);
									changeSConBackend(
										getStyleCardCurrentValue('sc_maxi')
									);
									saveMaxiStyleCards(newStyleCards);
								}
							}}
						>
							<Icon icon={SCdelete} />
						</Button>
					</div>
					<div className='maxi-style-cards__sc__actions'>
						<PostPreviewButton
							className='maxi-style-cards__sc__actions--preview'
							textContent={__('Preview', 'maxi-blocks')}
						/>
						<Button
							className='maxi-style-cards__sc__actions--save'
							onClick={() => {
								if (isActive(currentSCkey)) {
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
							disabled={false}
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
									applyCurrentSCglobally();
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
												...stateSC.styleCard,
												...stateSC.styleCardDefaults,
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
										onChangeDelete={onChangeDelete}
										addActiveSCclass={addActiveSCclass}
										deviceType={deviceType}
										currentKey={getStyleCardActiveKey()}
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
										onChangeDelete={onChangeDelete}
										addActiveSCclass={addActiveSCclass}
										deviceType={deviceType}
										currentKey={getStyleCardActiveKey()}
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
