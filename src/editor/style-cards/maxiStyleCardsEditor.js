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

/**
 * External dependencies
 */
import { isEmpty, isNil, isEqual } from 'lodash';

/**
 * Icons
 */
import { styleCardBoat, reset, SCDelete, closeIcon } from '../../icons';
import { handleSetAttributes } from '../../extensions/maxi-block/withMaxiProps';

const MaxiStyleCardsEditor = ({ styleCards, setIsVisible }) => {
	const {
		isRTL,
		breakpoint,
		SCList,
		activeSCKey,
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

	const canBeReset = keySC => {
		if (
			!isNil(styleCards[keySC]) &&
			(!isEmpty(styleCards[keySC].light.styleCard) ||
				!isEmpty(styleCards[keySC].dark.styleCard))
		)
			return true;

		return false;
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

	const resetCurrentSC = () => {
		const resetStyleCards = {
			...styleCards,
			[selectedSCKey]: {
				...styleCards[selectedSCKey],
				dark: {
					styleCard: {},
					defaultStyleCard: {
						...styleCards[selectedSCKey].dark.defaultStyleCard,
					},
				},
				light: {
					styleCard: {},
					defaultStyleCard: {
						...styleCards[selectedSCKey].light.defaultStyleCard,
					},
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
					<span
						className='maxi-responsive-selector__close'
						onClick={() => setIsVisible(false)}
					>
						<Icon icon={closeIcon} />
					</span>
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
							disabled={!canBeApplied(selectedSCKey, activeSCKey)}
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
					<div className='maxi-style-cards__sc__save'>
						<input
							type='text'
							placeholder={__(
								'Add your Style Card Name here',
								'maxi-blocks'
							)}
							value={styleCardName}
							onChange={e => setStyleCardName(e.target.value)}
						/>
						<Button
							disabled={isEmpty(styleCardName)}
							onClick={() => {
								const newStyleCard = {
									name: styleCardName,
									status: '',
									dark: {
										defaultStyleCard: {
											...selectedSCValue.dark
												.defaultStyleCard,
											...selectedSCValue.dark.styleCard,
										},
										styleCard: {},
									},
									light: {
										defaultStyleCard: {
											...selectedSCValue.light
												.defaultStyleCard,
											...selectedSCValue.light.styleCard,
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
										{__('Import', 'maxi-blocks')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
					</div>
				</div>
				<hr />
				<SettingTabsControl
					disablePadding
					returnValue={({ key }) => setCurrentSCStyle(key)}
					items={[
						{
							label: __('Light Style Preset', 'maxi-blocks'),
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
							label: __('Dark Style Preset', 'maxi-blocks'),
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
			</Popover>
		)
	);
};

export default MaxiStyleCardsEditor;
