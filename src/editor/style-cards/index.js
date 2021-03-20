const { __, sprintf } = wp.i18n;

const { select, dispatch, useSelect, useDispatch } = wp.data;
const { Fragment, useState } = wp.element;
const { Button, SelectControl, Popover, Icon } = wp.components;

import { isEmpty, forIn, isNil } from 'lodash';
import { styleCardBoat, reset, SCdelete, globalOptions } from '../../icons';
import './editor.scss';

import {
	SettingTabsControl,
	AccordionControl,
	ColorControl,
	TypographyControl,
} from '../../components';

import getStyleCardAttr from '../../extensions/styles/defaults/style-card';
import exportStyleCard from './exportStyleCard';

const getTypographyGroup = (SC, level) => {
	const response = {};

	Object.entries(SC).forEach(([key, val]) => {
		if (key.includes(`${level}-`)) {
			if (key.includes('font-size')) {
				const [num, unit] = val.match(/[a-zA-Z]+|[0-9]+/g);
				response[key] = num;
				const newUnitKey = key.replace('font-size', 'font-size-unit');
				response[newUnitKey] = unit;
				return;
			}
			response[key] = val;
		}
	});

	return response;
};

const parseSC = (SC, newSC) => {
	const parsedSC = {};
	Object.entries(newSC).forEach(([key, val]) => {
		if (key.includes('font-size')) {
			const isUnit = key.includes('-unit');
			const newKey = isUnit ? key.replace('-unit', '') : key;

			const [num, unit] = SC[newKey].match(/[a-zA-Z]+|[0-9]+/g);

			if (isUnit) {
				parsedSC[newKey] = num + val;
			} else {
				parsedSC[key] = val + unit;
			}
		}
	});

	return parsedSC;
};

const MaxiStyleCardsTab = ({
	SC,
	SCStyle,
	deviceType,
	onChange,
	onChangeValue,
}) => {
	const getColor = attr => {
		if (!isNil(SC.styleCard[SCStyle][attr]))
			return SC.styleCard[SCStyle][attr];
		if (!isNil(SC.styleCardDefaults[SCStyle][attr]))
			return SC.styleCardDefaults[SCStyle][attr];
		return false;
	};

	return (
		<div className='maxi-tab-content__box'>
			<AccordionControl
				isSecondary
				items={[
					{
						label: __('Background Colours', 'maxi-blocks'),
						content: (
							<Fragment>
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
								<ColorControl
									label={__(
										'Background 1',
										'maxi-blocks'
									)}
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
									label={__(
										'Background 2',
										'maxi-blocks'
									)}
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
					{
						label: __('Body', 'maxi-blocks'),
						content: (
							<Fragment>
								{/*<TypographyControl
									typography={getTypographyGroup(SC, 'p')}
									prefix='p-'
									disableFormats
									className='maxi-style-cards-control__sc__text-typography'
									textLevel='p'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									onChange={obj => {
										const parsedContent = parseSC(
											SC,
											obj
										);
										Object.entries(
											parsedContent
										).forEach(([key, val]) => {
											onChangeValue(
												key,
												val,
												'light'
											);
										});
									}}
								/>*/}
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

	const getStyleCardCurrentKey = () => {
		let styleCardCurrent = '';
		if (allStyleCards) {
			forIn(allStyleCards, function get(value, key) {
				if (value.status === 'active') styleCardCurrent = key;
			});

			return styleCardCurrent;
		}
		return false;
	};

	const [styleCardName, setStyleCardName] = useState('');
	const [styleCardLoad, setStyleCardLoad] = useState('');

	const getStyleCardsOptions = () => {
		const styleCardsArr = [];
		forIn(allStyleCards, (value, key) =>
			styleCardsArr.push({ label: value.name, value: key })
		);
		return styleCardsArr;
	};

	const getStyleCardCurrentValue = () => {
		let styleCardCurrentValue = {};
		if (!isNil(allStyleCards)) {
			forIn(allStyleCards, function get(value, key) {
				if (value.status === 'active') styleCardCurrentValue = value;
			});

			// console.log('styleCardCurrentValue: ' +  JSON.stringify(styleCardCurrentValue));
			if (!isNil(styleCardCurrentValue)) return styleCardCurrentValue;
			return false;
		}
		return false;
	};

	// TO DO: set active state
	const setStyleCardCurrent = card => {
		forIn(allStyleCards, function get(value, key) {
			if (value.status === 'active' && card !== key) value.status = '';
			if (card === key) value.status = 'active';
		});
		// console.log('new allStyleCards: ' + JSON.stringify(allStyleCards));
		changeCurrentSC(allStyleCards);

		// return allStyleCards;
	};

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

	const currentSCname = () => {
		if (allStyleCards && getStyleCardCurrentKey())
			return allStyleCards[getStyleCardCurrentKey()].name;
		return false;
	};

	const changeSConBackend = SC => {
		// Light
		Object.entries(SC.styleCard.light).forEach(([key, val]) => {
			document.documentElement.style.setProperty(
				`--maxi-light-${key}`,
				val
			);
		});
		// Dark
		Object.entries(SC.styleCard.light).forEach(([key, val]) => {
			document.documentElement.style.setProperty(
				`--maxi-dark-${key}`,
				val
			);
		});
	};

	const reRenderBlocks = () => {
		const allBlocks = select('core/block-editor').getBlocks();
		Object.entries(allBlocks).forEach(([key, val]) => {
			const { clientId, attributes } = val;

			if (!isNil(clientId) && !isNil(attributes)) {
				const { updateStyleCard } = attributes;
				// console.log('updateStyleCard ' + JSON.stringify(updateStyleCard));
				if (!isNil(updateStyleCard)) {
					// console.log(`update for ${clientId}`);
					dispatch('core/block-editor').updateBlockAttributes(clientId, {
						updateStyleCard: new Date().getTime(),
					});
				}
			}
		});
	};

	const [stateSC, changeStateSC] = useState(getStyleCardCurrentValue());

	const onChangeValue = (prop, value, style) => {
		const stateSCbefore = stateSC.styleCard;
		const stateSCstyleBefore = stateSC.styleCard[style];

		const newStateSC = {
			...stateSC,
			styleCard: {
				...stateSCbefore,
				[style]: { ...stateSCstyleBefore, [prop]: value },
			},
		};

		changeStateSC(newStateSC);

		changeSConBackend(newStateSC);

		// reRenderBlocks();
	};

	const applyCurrentSCglobally = () => {
		const newStyleCards = {
			...allStyleCards,
			[getStyleCardCurrentKey()]: {
				name: stateSC.name,
				status: stateSC.status,
				styleCard: stateSC.styleCard,
				styleCardDefaults: stateSC.styleCardDefaults,
			},
		};

		saveMaxiStyleCards(newStyleCards);
	};

	return (
		<Popover
			noArrow
			position={isRTL ? 'top left right' : 'top right left'}
			className='maxi-style-cards__popover'
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
						value={getStyleCardCurrentKey()}
						options={getStyleCardsOptions()}
						onChange={val => {
							setStyleCardLoad(val);
							setStyleCardCurrent(val);
						}
					}
					/>
					<Button
						className='maxi-style-cards-control__sc--reset'
						disabled={isEmpty(styleCardLoad)}
						onClick={() => {
							const newStyleCards = {
								...allStyleCards,
							};

							if (
								window.confirm(
									sprintf(
										__(
											'Are you sure to reset "%s" style card\'s styles?',
											'maxi-blocks'
										),
										allStyleCards[styleCardLoad].name
									)
								)
							) {
								delete newStyleCards[styleCardLoad];
								saveMaxiStyleCards(newStyleCards);
								setStyleCardLoad('');
							}
						}}
					>
						<Icon icon={reset} />
					</Button>
					<Button
						className='maxi-style-cards-control__sc--delete'
						disabled={isEmpty(styleCardLoad)}
						onClick={() => {
							const newStyleCards = {
								...allStyleCards,
							};

							if (
								window.confirm(
									sprintf(
										__(
											'Are you sure to delete "%s" style card?',
											'maxi-blocks'
										),
										currentSCname
									)
								)
							) {
								delete newStyleCards[styleCardLoad];
								saveMaxiStyleCards(newStyleCards);
								setStyleCardLoad('');
							}
						}}
					>
						<Icon icon={SCdelete} />
					</Button>
				</div>
				<div className='maxi-style-cards__sc--two'>
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
							const fileName = `${currentSCname}.json`;
							exportStyleCard(getStyleCardCurrentValue(), fileName);
						}}
					>
						{__('Export', 'maxi-blocks')}
					</Button>
					<Button
						disabled={false}
						onClick={() => {

						}}
					>
						{__('Import', 'maxi-blocks')}
					</Button>
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
						if (isEmpty(styleCards)) {
							saveMaxiStyleCards({
								[`sc_${new Date().getTime()}`]: {
									name: styleCardName,
									status: '',
									styleCard: {},
									styleCardDefaults: {},
								},
							});
						} else {
							saveMaxiStyleCards({
								...allStyleCards,
								[`sc_${new Date().getTime()}`]: {
									name: styleCardName,
									status: '',
									styleCard: {},
									styleCardDefaults: {},
								},
							});
						}

						setStyleCardName('');
					}}
				>
					{__('Save Style Card', 'maxi-blocks')}
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
							/>
						),
					},
				]}
			/>
		</Popover>
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
				<Icon icon={globalOptions} />
				{__('Style Card Editor', 'maxi-blocks')}
			</Button>
			{isVisible && <MaxiStyleCardsEditor />}
		</Fragment>
	);
};

export default MaxiStyleCardsEditorPopUp;
