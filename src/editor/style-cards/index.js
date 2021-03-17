const { __, sprintf } = wp.i18n;

const { select, useSelect, useDispatch } = wp.data;
const { Fragment, useState } = wp.element;
const { Button, SelectControl, Popover, Icon } = wp.components;

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
import exportStyleCard from './exportStyleCard';

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
		return SC.styleCardDefaults[SCStyle][attr];
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
									onChange={val =>
										onChangeValue(
											'button-background-color',
											val,
											SCStyle
										)
									}
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

const MaxiStyleCardsTabs = SC => {
	const { deviceType } = useSelect(select => {
		const { receiveMaxiDeviceType } = select('maxiBlocks');

		const deviceType = receiveMaxiDeviceType();

		return {
			deviceType,
		};
	});

	console.log('SC on tabs: ' + JSON.stringify(SC));

	const { saveMaxiStyleCards } = useDispatch('maxiBlocks/style-cards');
	const styleCards = select('maxiBlocks/style-cards').receiveMaxiStyleCards();

	const getStyleCards = () => {
		switch (typeof styleCards) {
			case 'string':
				if (!isEmpty(styleCards)) return JSON.parse(styleCards);
				return {};
			case 'object':
				return styleCards;
			case 'undefined':
				return {};
			default:
				return {};
		}
	};

	const getStyleCardCurrentKey = () => {
		let styleCardCurrent = '';
		const allStyleCards = getStyleCards();

		forIn(allStyleCards, function get(value, key) {
			if (value.status === 'active') styleCardCurrent = key;
		});

		return styleCardCurrent;
	};

	const [currentSC, changeCurrentSC] = useState(SC.SC); // remove this double SC

	console.log('currentSC state: ' + JSON.stringify(currentSC));

	const applySC = SC => {
		// Light
		Object.entries(SC.styleCard.light).forEach(([key, val]) => {
			// if (key === 'background-1')
			document.documentElement.style.setProperty(
				`--maxi-light-${key}`,
				val
			);
		});
		// Dark
		Object.entries(SC.styleCard.light).forEach(([key, val]) => {
			// if (key === 'background-1')
			document.documentElement.style.setProperty(
				`--maxi-dark-${key}`,
				val
			);
		});
	};

	const onChangeValue = (prop, value, style) => {
		// // console.log('prop: ' + prop + ' value ' + value + ' style ' + style);

		// // console.log('currentSC style: ' + JSON.stringify(currentSC.styleCard));

		const newCurrentSC = {
			...currentSC,
			styleCard: {
				...currentSC.styleCard,
				[style]: { ...currentSC[style], [prop]: value },
			},
		};

		// console.log('newCurrentSC ' + JSON.stringify(newCurrentSC));

		changeCurrentSC(newCurrentSC);

		const oldStyleCards = select(
			'maxiBlocks/style-cards'
		).receiveMaxiStyleCards();

		const getStyleCards = () => {
			switch (typeof oldStyleCards) {
				case 'string':
					if (!isEmpty(oldStyleCards))
						return JSON.parse(oldStyleCards);
					return {};
				case 'object':
					return oldStyleCards;
				case 'undefined':
					return {};
				default:
					return {};
			}
		};

		// console.log('getStyleCardCurrentKey: ' + getStyleCardCurrentKey());

		const newStyleCards = {
			...getStyleCards(),
			[getStyleCardCurrentKey()]: newCurrentSC,
		};

		// console.log('newStyleCards: ' + JSON.stringify(newStyleCards));

		applySC(newCurrentSC);

		saveMaxiStyleCards(newStyleCards);
	};

	return (
		<SettingTabsControl
			disablePadding
			items={[
				{
					label: __('Light Style Preset', 'maxi-blocks'),
					content: (
						<MaxiStyleCardsTab
							SC={currentSC}
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
							SC={currentSC}
							SCStyle='dark'
							onChangeValue={onChangeValue}
							deviceType={deviceType}
						/>
					),
				},
			]}
		/>
	);
};

const MaxiStyleCardsEditor = () => {
	const { isRTL, styleCards } = useSelect(select => {
		const { getEditorSettings } = select('core/editor');
		const { receiveMaxiStyleCards } = select('maxiBlocks/style-cards');

		const { isRTL } = getEditorSettings();
		const styleCards = receiveMaxiStyleCards();

		return {
			isRTL,
			styleCards,
		};
	});
	const { saveMaxiStyleCards } = useDispatch('maxiBlocks/style-cards');

	const getStyleCards = () => {
		switch (typeof styleCards) {
			case 'string':
				if (!isEmpty(styleCards)) return JSON.parse(styleCards);
				return {};
			case 'object':
				return styleCards;
			case 'undefined':
				return {};
			default:
				return {};
		}
	};

	const getStyleCardCurrentKey = () => {
		let styleCardCurrent = '';
		const allStyleCards = getStyleCards();

		forIn(allStyleCards, function get(value, key) {
			if (value.status === 'active') styleCardCurrent = key;
		});

		return styleCardCurrent;
	};

	const [styleCardName, setStyleCardName] = useState('');
	const [styleCardLoad, setStyleCardLoad] = useState('');

	const getStyleCardsOptions = () => {
		const styleCardsArr = [];

		forIn(getStyleCards(), (value, key) =>
			styleCardsArr.push({ label: value.name, value: key })
		);
		return styleCardsArr;
	};

	const getStyleCardCurrentValue = () => {
		let styleCardCurrentValue = '';
		const allStyleCards = getStyleCards();

		forIn(allStyleCards, function get(value, key) {
			if (value.status === 'active') styleCardCurrentValue = value;
		});
		// console.log('styleCardCurrentValue: ' +  JSON.stringify(styleCardCurrentValue));
		return styleCardCurrentValue;
	};

	// TO DO: set active state
	const setStyleCardCurrent = card => {
		const allStyleCards = getStyleCards();

		forIn(allStyleCards, function get(value, key) {
			if (value.status === 'active' && card !== key) value.status = '';
			if (card === key) value.status = 'active';
		});

		return allStyleCards;
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

	const currentSCname = getStyleCards()[getStyleCardCurrentKey()].name;

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
								...getStyleCards(),
							};

							if (
								window.confirm(
									sprintf(
										__(
											'Are you sure to reset "%s" style card\'s styles?',
											'maxi-blocks'
										),
										getStyleCards()[styleCardLoad].name
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
								...getStyleCards(),
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
								const saveDraftButton = document.querySelector(
									'button.editor-post-save-draft'
								);
								const updatePageButton = document.querySelector(
									'button.editor-post-publish-button__button'
								);
								if (saveDraftButton) maxiClick(saveDraftButton);
								else maxiClick(updatePageButton);
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
								...getStyleCards(),
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
				<MaxiStyleCardsTabs SC={getStyleCardCurrentValue()} />
			</div>
		</Popover>
	);
};

const MaxiStyleCardsEditorPopUp = () => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<Fragment>
			<Button
				id='maxi-button__go-to-customizer'
				className='button maxi-button maxi-button__toolbar'
				aria-label={__('Style Cards', 'maxi-blocks')}
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
