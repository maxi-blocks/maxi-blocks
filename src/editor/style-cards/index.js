import { __, sprintf } from '@wordpress/i18n';

import { select, dispatch, useSelect, useDispatch } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { Button, SelectControl, Popover, Icon } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { isEmpty, forIn, isNil } from 'lodash';
import { styleCardBoat, reset, SCdelete, SCaddMore } from '../../icons';
import './editor.scss';

import {
	SettingTabsControl,
	AccordionControl,
	ColorControl,
	TypographyControl,
	FancyRadioControl,
} from '../../components';

import getStyleCardAttr from '../../extensions/styles/defaults/style-card';

const mouseClickEvents = ['mousedown', 'click', 'mouseup'];

function maxiClick(element) {
	mouseClickEvents.forEach(mouseEventType =>
		element.dispatchEvent(
			new MouseEvent(mouseEventType, {
				view: window,
				bubbles: true,
				cancelable: true,
				buttons: 1,
			})
		)
	);
}

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
};

const addActiveSCclass = keySC => {
	const selectArr = document.querySelectorAll(
		'.maxi-style-cards__sc-select option'
	);
	if (!isNil(selectArr)) {
		selectArr.forEach(option => {
			if (option.value === keySC)
				option.classList.add('maxi-current-option');
			else option.classList.remove('maxi-current-option');
		});
	}
};

const MaxiStyleCardsTab = ({
	SC,
	SCStyle,
	deviceType,
	onChange,
	onChangeValue,
	onChangeDelete,
	currentKey,
}) => {
	const processAttribute = attr => {
		const value = SC.styleCard[SCStyle][attr];
		if (!isNil(value)) return value;

		const defaultValue = SC.styleCardDefaults[SCStyle][attr];
		if (!isNil(defaultValue)) {
			if (defaultValue.includes('var')) {
				const colorNumber = defaultValue.match(/color-\d/);
				const colorValue = SC.styleCardDefaults[SCStyle][colorNumber];
				if (!isNil(colorValue)) return colorValue;
			} else return defaultValue;
		}
		return false;
	};

	const parseTypography = newSC => {
		const parsedTypography = {};
		Object.entries(newSC).forEach(([key, val]) => {
			if (
				key.includes('font-size') ||
				key.includes('line-height') ||
				key.includes('letter-spacing')
			) {
				const isUnit = key.includes('-unit');
				if (isUnit) {
					const newKey = key.replaceAll('-unit', '');
					if (!isNil(newSC[newKey]) && !isEmpty(val))
						parsedTypography[newKey] = newSC[newKey] + val;
				}
			}
			if (!key.includes('-unit')) parsedTypography[key] = val;
		});
		return parsedTypography;
	};

	const getTypography = level => {
		const response = {};

		const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

		const styleCardDefaultsTypography = SCstyle => {
			Object.entries(SCstyle).forEach(([key, val]) => {
				if (key.includes(`${level}-`)) {
					if (key.includes('general')) {
						breakpoints.forEach(breakpoint => {
							const checkKey = key.replace('general', breakpoint);

							if (isNil(SCstyle.checkKey)) {
								response[checkKey] = val;
							}
						});
					}
					if (key.includes('font-size')) {
						const [num, unit] = val.match(/[a-zA-Z]+|[0-9]+/g);
						response[key] = num;
						const newUnitKey = key.replace(
							'font-size',
							'font-size-unit'
						);
						response[newUnitKey] = unit;
						return;
					}
					if (key.includes('letter-spacing')) {
						let newVal;
						if (typeof val === 'number') newVal = `${val}px`;
						else newVal = val;

						const [num, unit] = newVal.match(/[a-zA-Z]+|[0-9\.]+/g);
						response[key] = num;
						const newUnitKey = key.replace(
							'letter-spacing',
							'letter-spacing-unit'
						);

						response[newUnitKey] = unit;
						return;
					}
					response[key] = val;
				}
			});
		};

		styleCardDefaultsTypography(SC.styleCardDefaults[SCStyle]);

		if (!isEmpty(SC.styleCard[SCStyle]))
			styleCardDefaultsTypography(SC.styleCard[SCStyle]);

		return response;
	};

	const onChangeColor = (val, attr, defaultColor) => {
		if (!val) onChangeDelete(attr, SCStyle);
		if (val)
			onChangeValue(
				attr,
				processAttribute(attr) ||
					getStyleCardAttr(defaultColor, SCStyle, true),
				SCStyle
			);

		onChangeValue(`${attr}-global`, val, SCStyle);
	};

	if (document.querySelectorAll('.maxi-style-cards__sc-select option'))
		setTimeout(function scSelect() {
			addActiveSCclass(currentKey);
		}, 300);

	const options = [
		{
			label: __('Yes', 'maxi-blocks'),
			value: 1,
		},
		{
			label: __('No', 'maxi-blocks'),
			value: 0,
		},
	];

	/*
	 * Generates main tabs.
	 *
	 * @param {string} firstColor First color attribute, example: p-color-general
	 * @param {string} firstLabel First color label, examples: Hover, Button
	 * @param {string} firstColorDefault Default for the first color, example: color-3
	 * @param {bool or string} typographyPrefix Disable typography or set a prefix for it, examples: p, button
	 * @param {bool or string} typographyPrefix Disable secondColor or set an attribute for it, example: button-background-color
	 * @param {string} secondLabel Second color label, examples: Link, Button Background, Icon Fill
	 * @param {string} secondColorDefault Default for the second color, example: color-4
	 *
	 * @return {object} An AccordionControl tab to render.
	 */

	const generateTab = (
		firstColor,
		firstLabel,
		firstColorDefault,
		typographyPrefix = false,
		secondColor = false,
		secondLabel,
		secondColorDefault
	) => {
		const firstColorGlobal = `${firstColor}-global`;
		const secondColorGlobal = `${secondColor}-global`;

		return {
			label: __(firstLabel, 'maxi-blocks'),
			content: (
				<Fragment>
					{deviceType === 'general' && (
						<FancyRadioControl
							label={__(
								`Use Global ${firstLabel} Text Colour`,
								'maxi-blocks'
							)}
							selected={processAttribute(firstColorGlobal)}
							options={options}
							onChange={val => {
								onChangeColor(
									val,
									firstColor,
									firstColorDefault
								);
							}}
						/>
					)}
					{deviceType === 'general' &&
						processAttribute(firstColorGlobal) && (
							<ColorControl
								label={__(`${firstLabel} Text`, 'maxi-blocks')}
								className={`maxi-style-cards-control__sc__${firstColor}--${SCStyle}`}
								color={
									processAttribute(firstColor) ||
									getStyleCardAttr(
										firstColorDefault,
										SCStyle,
										true
									)
								}
								defaultColor={getStyleCardAttr(
									firstColorDefault,
									SCStyle,
									true
								)}
								onChange={val => {
									onChangeValue(firstColor, val, SCStyle);
								}}
								disableGradient
								noPalette
							/>
						)}
					{!!typographyPrefix && (
						<TypographyControl
							typography={getTypography(`${typographyPrefix}`)}
							prefix={`${typographyPrefix}-`}
							disableFormats
							className={`maxi-style-cards-control__sc__${typographyPrefix}-typography`}
							textLevel={`${typographyPrefix}`}
							hideAlignment
							hideTextShadow
							breakpoint={deviceType}
							noPalette
							styleCards
							onChange={obj => {
								const parsedTypography = parseTypography(obj);
								onChangeValue(
									'typography',
									parsedTypography,
									SCStyle
								);
							}}
						/>
					)}
					{!!secondColor && deviceType === 'general' && (
						<FancyRadioControl
							label={__(
								`Use Global ${secondLabel}`,
								'maxi-blocks'
							)}
							selected={processAttribute(secondColorGlobal)}
							options={options}
							onChange={val => {
								onChangeColor(
									val,
									secondColor,
									secondColorDefault
								);
							}}
						/>
					)}
					{!!secondColor &&
						deviceType === 'general' &&
						processAttribute(secondColorGlobal) && (
							<ColorControl
								label={__(secondLabel, 'maxi-blocks')}
								className={`maxi-style-cards-control__sc__${secondColor}--${SCStyle}`}
								color={
									processAttribute(secondColor) ||
									getStyleCardAttr(
										secondColorDefault,
										SCStyle,
										true
									)
								}
								defaultColor={getStyleCardAttr(
									secondColorDefault,
									SCStyle,
									true
								)}
								onChange={val => {
									onChangeValue(secondColor, val, SCStyle);
								}}
								disableGradient
								noPalette
							/>
						)}
				</Fragment>
			),
		};
	};

	const headingItems = () => {
		const resultItems = [];

		[1, 2, 3, 4, 5, 6].forEach(item => {
			resultItems.push({
				label: __(`H${item}`, 'maxi-blocks'),
				content: (
					<Fragment>
						{deviceType === 'general' && (
							<FancyRadioControl
								label={__(
									`Use Global H${item} Colour`,
									'maxi-blocks'
								)}
								selected={processAttribute(
									`h${item}-color-general-global`
								)}
								options={options}
								onChange={val => {
									onChangeColor(
										val,
										`h${item}-color-general`,
										'color-5'
									);
								}}
							/>
						)}
						{deviceType === 'general' &&
							processAttribute(
								`h${item}-color-general-global`
							) && (
								<ColorControl
									label={__(`H${item} Text`, 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__h${item}-text-color--${SCStyle}`}
									color={
										processAttribute(
											`h${item}-color-general`
										) ||
										getStyleCardAttr(
											'color-5',
											SCStyle,
											true
										)
									}
									defaultColor={getStyleCardAttr(
										'color-5',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											`h${item}-color-general`,
											val,
											SCStyle
										);
									}}
									disableGradient
									noPalette
								/>
							)}
						<TypographyControl
							typography={getTypography(`h${item}`)}
							prefix={`h${item}-`}
							disableFormats
							className={`maxi-style-cards-control__sc__h${item}-typography`}
							textLevel={`h${item}`}
							hideAlignment
							hideTextShadow
							breakpoint={deviceType}
							noPalette
							styleCards
							onChange={obj => {
								const parsedTypography = parseTypography(obj);
								onChangeValue(
									'typography',
									parsedTypography,
									SCStyle
								);
							}}
						/>
					</Fragment>
				),
			});
		});

		return resultItems;
	};

	const [quickColorPreset, setQuickColorPreset] = useState(1);

	return (
		<div className='maxi-tab-content__box'>
			<AccordionControl
				isSecondary
				items={[
					deviceType === 'general' && {
						label: __('Quick Pick Colour Presets', 'maxi-blocks'),
						content: (
							<Fragment>
								<div className='maxi-style-cards__quick-color-presets'>
									{[1, 2, 3, 4, 5, 6, 7].map(item => (
										<div
											key={`maxi-style-cards__quick-color-presets__box__${item}`}
											className={`maxi-style-cards__quick-color-presets__box ${
												quickColorPreset === item
													? 'maxi-style-cards__quick-color-presets__box--active'
													: ''
											}`}
											data-item={item}
											onClick={e =>
												setQuickColorPreset(
													+e.currentTarget.dataset
														.item
												)
											}
										>
											<span
												className={`maxi-style-cards__quick-color-presets__box__item maxi-style-cards__quick-color-presets__box__item__${item}`}
												style={{
													background: processAttribute(
														`color-${item}`
													),
												}}
											></span>
										</div>
									))}
								</div>
								<ColorControl
									disableColorDisplay
									disableOpacity
									className={`maxi-style-cards-control__sc__color-${quickColorPreset}-${SCStyle}`}
									color={processAttribute(
										`color-${quickColorPreset}`
									)}
									defaultColor={processAttribute(
										`color-${quickColorPreset}`
									)}
									onChange={val => {
										onChangeValue(
											`color-${quickColorPreset}`,
											val,
											SCStyle
										);
									}}
									disableGradient
									noPalette
								/>
							</Fragment>
						),
					},
					generateTab(
						'button-text-color',
						'Button',
						'color-1',
						'button',
						'button-background-color',
						'Button Background',
						'color-4'
					),
					generateTab(
						'p-color-general',
						'Paragraph',
						'color-3',
						'p',
						'link',
						'Link',
						'color-4'
					),
					{
						label: __('Headings', 'maxi-blocks'),
						content: <SettingTabsControl items={headingItems()} />,
					},
					generateTab('hover', 'Hover', 'color-6', false, false),
					generateTab(
						'icon-line',
						'SVG Icon',
						'color-7',
						'p',
						'icon-fill',
						'Fill',
						'color-4'
					),
					generateTab(
						'font-icon-color',
						'Font Icon',
						'color-7',
						false,
						false
					),
					generateTab(
						'divider-color',
						'Divider',
						'color-4',
						false,
						false
					),
				]}
			/>
		</div>
	);
};

const MaxiStyleCardsEditor = () => {
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
	const { receiveMaxiStyleCards } = select('maxiBlocks/style-cards');
	const { saveMaxiStyleCards } = useDispatch('maxiBlocks/style-cards');

	const styleCards = receiveMaxiStyleCards();

	const [currentSC, changeCurrentSC] = useState(styleCards);

	const [styleCardName, setStyleCardName] = useState('');

	const getStyleCards = () => {
		if (!isNil(currentSC)) {
			switch (typeof currentSC) {
				case 'string':
					if (!isEmpty(currentSC)) return JSON.parse(currentSC);
					return {};
				case 'object':
					return currentSC;
				case 'undefined':
					return {};
				default:
					return {};
			}
		} else return false;
	};

	const allStyleCards = getStyleCards();

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

	const maxiWarnIfUnsavedChanges = () => {
		return __(
			'You have unsaved changes in Style Cards Editor. If you proceed, they will be lost.',
			'maxi-blocks'
		);
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

	window.addEventListener('beforeunload', () => maxiWarnIfUnsavedChanges());

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
						<Button
							className='maxi-style-cards__sc__actions--preview'
							disabled={false}
							onClick={() => {
								const previewButton = document.querySelector(
									'.block-editor-post-preview__button-toggle'
								);
								maxiClick(previewButton);
								setTimeout(function triggerPreview() {
									const previewButtonExternal = document.querySelector(
										'a.edit-post-header-preview__button-external'
									);
									maxiClick(previewButtonExternal);
								}, 1);
							}}
						>
							{__('Preview', 'maxi-blocks')}
						</Button>
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
						<Fragment>
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
						</Fragment>
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

const MaxiStyleCardsEditorPopUp = () => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<Fragment>
			<Button
				id='maxi-button__go-to-customizer'
				className='action-buttons__button'
				aria-label={__('Style Card Editor', 'maxi-blocks')}
				onClick={() => setIsVisible(!isVisible)}
			>
				<Icon icon={styleCardBoat} />
				<span>{__('Style Card Editor', 'maxi-blocks')}</span>
			</Button>
			{isVisible && <MaxiStyleCardsEditor />}
		</Fragment>
	);
};

export default MaxiStyleCardsEditorPopUp;
