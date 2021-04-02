const { __, sprintf } = wp.i18n;

const { select, dispatch, useSelect, useDispatch } = wp.data;
const { Fragment, useState } = wp.element;
const { Button, SelectControl, Popover, Icon } = wp.components;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;

import { isEmpty, forIn, isNil } from 'lodash';
import { styleCardBoat, reset, SCdelete } from '../../icons';
import './editor.scss';

import {
	SettingTabsControl,
	AccordionControl,
	ColorControl,
	TypographyControl,
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

const addActiveSCdropdownStyle = keySC => {
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
	currentKey,
}) => {
	const getColor = attr => {
		if (!isNil(SC.styleCard[SCStyle][attr]))
			return SC.styleCard[SCStyle][attr];
		if (!isNil(SC.styleCardDefaults[SCStyle][attr]))
			return SC.styleCardDefaults[SCStyle][attr];
		return false;
	};

	const parseSCtypography = newSC => {
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
		// console.log('new sc ' + JSON.stringify(newSC));
		return parsedTypography;
	};

	const getTypographyGroup = level => {
		const response = {};

		const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

		const styleCardDefaultsTypography = SCstyle => {
			Object.entries(SCstyle).forEach(([key, val]) => {
				if (key.includes(`${level}-`)) {
					if (key.includes('font-size')) {
						// console.log('key: ' + key + ' val: ' + val);
						const [num, unit] = val.match(/[a-zA-Z]+|[0-9]+/g);
						// console.log('num: ' + num);
						// console.log('unit: ' + unit);
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

						// console.log(typeof val + ' ' + val + ' ' + newVal);
						const [num, unit] = newVal.match(/[a-zA-Z]+|[0-9\.]+/g);
						// console.log('num: ' + num);
						// console.log('unit: ' + unit);
						response[key] = num;
						const newUnitKey = key.replace(
							'letter-spacing',
							'letter-spacing-unit'
						);

						response[newUnitKey] = unit;
						return;
					}
					if (key.includes('general')) {
						breakpoints.forEach(breakpoint => {
							const checkKey = key.replace('general', breakpoint);
							console.log('checkKey ' + checkKey);

							if (isNil(SCstyle.checkKey))
								response[checkKey] = val;
						});
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

	if (document.querySelectorAll('.maxi-style-cards__sc-select option'))
		setTimeout(function scSelect() {
			addActiveSCdropdownStyle(currentKey);
		}, 300);

	return (
		<div className='maxi-tab-content__box'>
			<AccordionControl
				isSecondary
				items={[
					deviceType === 'general' && {
						label: __('Background Colours', 'maxi-blocks'),
						content: (
							<Fragment>
								<ColorControl
									label={__('Background 1', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__bg-color-1-${SCStyle}`}
									color={getColor('background-1')}
									defaultColor={getStyleCardAttr(
										'background-1',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'background-1',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
								<ColorControl
									label={__('Background 2', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__bg-color-2-${SCStyle}`}
									color={getColor('background-2')}
									defaultColor={getStyleCardAttr(
										'background-2',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'background-2',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
							</Fragment>
						),
					},
					deviceType !== 'general' && {
						label: __('Paragraph', 'maxi-blocks'),
						content: (
							<Fragment>
								<TypographyControl
									typography={getTypographyGroup('p')}
									prefix='p-'
									disableFormats
									className='maxi-style-cards-control__sc__text-typography'
									textLevel='p'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									onChange={obj => {
										const parsedContent = parseSCtypography(
											obj
										);
										console.log('parsedContent p' + JSON.stringify(parsedContent));
										onChangeValue(
											'typography',
											parsedContent,
											SCStyle
										);
									}}
								/>
								<ColorControl
									label={__('Link', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__link-color-${SCStyle}`}
									color={getColor('link')}
									defaultColor={getStyleCardAttr(
										'link',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue('link', val, SCStyle);
									}}
									disableGradient
								/>
							</Fragment>
						),
					},
					deviceType !== 'general' && {
						label: __('Button', 'maxi-blocks'),
						content: (
							<Fragment>
								<TypographyControl
									typography={getTypographyGroup('button')}
									prefix='button-'
									disableFormats
									className='maxi-style-cards-control__sc__button-typography'
									// textLevel='p'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									onChange={obj => {
										const parsedContent = parseSCtypography(
											obj
										);
										// console.log('parsedContent' + JSON.stringify(parsedContent));
										onChangeValue(
											'typography',
											parsedContent,
											SCStyle
										);
									}}
								/>
								<ColorControl
									label={__(
										'Button Background',
										'maxi-blocks'
									)}
									className={`maxi-style-cards-control__sc__button-bg-color--${SCStyle}`}
									color={getColor('button-background-color')}
									defaultColor={getStyleCardAttr(
										'button-background-color',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'button-background-color',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
							</Fragment>
						),
					},
					deviceType !== 'general' && {
						label: __('H1', 'maxi-blocks'),
						content: (
							<TypographyControl
								typography={getTypographyGroup('h1')}
								prefix='h1-'
								disableFormats
								className='maxi-style-cards-control__sc__h1-typography'
								textLevel='h1'
								hideAlignment
								hideTextShadow
								breakpoint={deviceType}
								onChange={obj => {
									const parsedTypography = parseSCtypography(
										obj
									);
									onChangeValue(
										'typography',
										parsedTypography,
										SCStyle
									);
								}}
							/>
						),
					},
					deviceType !== 'general' && {
						label: __('H2', 'maxi-blocks'),
						content: (
							<TypographyControl
								typography={getTypographyGroup('h2')}
								prefix='h2-'
								disableFormats
								className='maxi-style-cards-control__sc__h2-typography'
								textLevel='h2'
								hideAlignment
								hideTextShadow
								breakpoint={deviceType}
								onChange={obj => {
									const parsedTypography = parseSCtypography(
										obj
									);
									onChangeValue(
										'typography',
										parsedTypography,
										SCStyle
									);
								}}
							/>
						),
					},
					deviceType !== 'general' && {
						label: __('H3', 'maxi-blocks'),
						content: (
							<TypographyControl
								typography={getTypographyGroup('h3')}
								prefix='h3-'
								disableFormats
								className='maxi-style-cards-control__sc__h3-typography'
								textLevel='h3'
								hideAlignment
								hideTextShadow
								breakpoint={deviceType}
								onChange={obj => {
									const parsedTypography = parseSCtypography(
										obj
									);
									onChangeValue(
										'typography',
										parsedTypography,
										SCStyle
									);
								}}
							/>
						),
					},
					deviceType !== 'general' && {
						label: __('H4', 'maxi-blocks'),
						content: (
							<TypographyControl
								typography={getTypographyGroup('h4')}
								prefix='h4-'
								disableFormats
								className='maxi-style-cards-control__sc__h4-typography'
								textLevel='h4'
								hideAlignment
								hideTextShadow
								breakpoint={deviceType}
								onChange={obj => {
									const parsedTypography = parseSCtypography(
										obj
									);
									onChangeValue(
										'typography',
										parsedTypography,
										SCStyle
									);
								}}
							/>
						),
					},
					deviceType !== 'general' && {
						label: __('H5', 'maxi-blocks'),
						content: (
							<TypographyControl
								typography={getTypographyGroup('h5')}
								prefix='h5-'
								disableFormats
								className='maxi-style-cards-control__sc__h5-typography'
								textLevel='h5'
								hideAlignment
								hideTextShadow
								breakpoint={deviceType}
								onChange={obj => {
									const parsedTypography = parseSCtypography(
										obj
									);
									onChangeValue(
										'typography',
										parsedTypography,
										SCStyle
									);
								}}
							/>
						),
					},
					deviceType !== 'general' && {
						label: __('H6', 'maxi-blocks'),
						content: (
							<TypographyControl
								typography={getTypographyGroup('h6')}
								prefix='h6-'
								disableFormats
								className='maxi-style-cards-control__sc__h6-typography'
								textLevel='h6'
								hideAlignment
								hideTextShadow
								breakpoint={deviceType}
								onChange={obj => {
									const parsedTypography = parseSCtypography(
										obj
									);
									onChangeValue(
										'typography',
										parsedTypography,
										SCStyle
									);
								}}
							/>
						),
					},
					deviceType === 'general' && {
						label: __('Highlight', 'maxi-blocks'),
						content: (
							<Fragment>
								<ColorControl
									label={__('Text', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__highlight-color-text--${SCStyle}`}
									color={getColor('highlight-text')}
									defaultColor={getStyleCardAttr(
										'highlight-text',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'highlight-text',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
								<ColorControl
									label={__('Background', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__highlight-color-bg-${SCStyle}`}
									color={getColor('highlight-background')}
									defaultColor={getStyleCardAttr(
										'highlight-background',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'highlight-background',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
								<ColorControl
									label={__('Border', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__highlight-color-border-${SCStyle}`}
									color={getColor('highlight-border')}
									defaultColor={getStyleCardAttr(
										'highlight-border',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'highlight-border',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
								<ColorControl
									label={__('Icon Line', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__highlight-icon-line-${SCStyle}`}
									color={getColor('highlight-icon-line')}
									defaultColor={getStyleCardAttr(
										'highlight-icon-line',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'highlight-icon-line',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
								<ColorControl
									label={__('Icon Fill', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__highlight-icon-fill-${SCStyle}`}
									color={getColor('highlight-icon-fill')}
									defaultColor={getStyleCardAttr(
										'highlight-icon-fill',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'highlight-icon-fill',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
							</Fragment>
						),
					},
					deviceType === 'general' && {
						label: __('Hover', 'maxi-blocks'),
						content: (
							<ColorControl
								label={__('Hover', 'maxi-blocks')}
								className={`maxi-style-cards-control__sc__hover-color-${SCStyle}`}
								color={getColor('hover')}
								defaultColor={getStyleCardAttr(
									'hover',
									SCStyle,
									true
								)}
								onChange={val => {
									onChangeValue('hover', val, SCStyle);
								}}
								disableGradient
							/>
						),
					},
					deviceType === 'general' && {
						label: __('Icon', 'maxi-blocks'),
						content: (
							<Fragment>
								<ColorControl
									label={__('Line', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__icon-line-${SCStyle}`}
									color={getColor('icon-line')}
									defaultColor={getStyleCardAttr(
										'icon-line',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'icon-line',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
								<ColorControl
									label={__('Fill', 'maxi-blocks')}
									className={`maxi-style-cards-control__sc__icon-fill-${SCStyle}`}
									color={getColor('icon-fill')}
									defaultColor={getStyleCardAttr(
										'icon-fill',
										SCStyle,
										true
									)}
									onChange={val => {
										onChangeValue(
											'icon-fill',
											val,
											SCStyle
										);
									}}
									disableGradient
								/>
							</Fragment>
						),
					},
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

	const onChangeValue = (prop, value, style) => {
		// console.log('prop ' + prop);
		// console.log('value ' + value);
		// console.log('style ' + style);
		let newStateSC = {};
		if (prop === 'typography') {
			console.log('YES');
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

		// console.log('newStateSC ' + JSON.stringify(newStateSC));

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

		addActiveSCdropdownStyle(currentSCkey);
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

	return (
		!isEmpty(currentSC) && (
			<Popover
				noArrow
				position={isRTL ? 'top left right' : 'top right left'}
				className='maxi-style-cards__popover maxi-sidebar'
				focusOnMount
			>
				<h2>
					<Icon icon={styleCardBoat} />
					{__('Style Card Editor', 'maxi-blocks')}
				</h2>
				<div className='maxi-style-cards__sc'>
					<Button
						className='maxi-style-cards-control__sc--add-more'
						onClick={() => {
							// TO DO: add cloud modal for SCs here
						}}
					>
						{__('Add More Style Cards', 'maxi-blocks')}
					</Button>
					<div className='maxi-style-cards__sc--three'>
						<SelectControl
							className='maxi-style-cards__sc-select'
							value={currentSCkey}
							options={getStyleCardsOptions()}
							onChange={val => {
								switchCurrentSC(val);
							}}
						/>
						<Button
							disabled={!canBeResettedState}
							className='maxi-style-cards-control__sc--reset'
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
							className='maxi-style-cards-control__sc--delete'
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
					<div className='maxi-style-cards__sc--three'>
						<Button
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
					<div className='maxi-style-cards__sc--two'>
						<Button
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
									<Button onClick={open}>
										{__('Import', 'maxi-blocks')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
					</div>
				</div>
				<div className='maxi-style-cards-control__sc__save'>
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
								styleCard: { dark: {}, light: {} },
								styleCardDefaults: {
									...stateSC.styleCard,
									...stateSC.styleCardDefaults,
								},
							};
							console.log('newStyleCard: ' + JSON.stringify(newStyleCard));
							saveImportedStyleCard(newStyleCard);
						}}
					>
						{__('Add New Style Card', 'maxi-blocks')}
					</Button>
				</div>
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
									deviceType={deviceType}
									currentKey={getStyleCardActiveKey()}
								/>
							),
						},
					]}
				/>
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
				{__('Style Card Editor', 'maxi-blocks')}
			</Button>
			{isVisible && <MaxiStyleCardsEditor />}
		</Fragment>
	);
};

export default MaxiStyleCardsEditorPopUp;
