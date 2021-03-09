const { __, sprintf } = wp.i18n;

const { select, useSelect, useDispatch } = wp.data;
const { withState } = wp.compose;
const { Fragment, useState } = wp.element;

const { Button, SelectControl, Popover, Icon } = wp.components;

import { isEmpty, forIn } from 'lodash';
import { styleCardBoat, reset, SCdelete } from '../../icons';
import './editor.scss';

import {
	SettingTabsControl,
	AccordionControl,
	ColorControl,
	TypographyControl,
} from '../../components';

import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';

import getStyleCardAttr from '../../extensions/styles/defaults/style-card';
// TO DO: remove when components are ready
import attributes from './attributes';

const MaxiStyleCardsEditor = withState({
	isVisible: false,
})(({ isVisible, setState }) => {
	const toggleVisible = () => {
		setState(state => ({ isVisible: !state.isVisible }));
	};

	const { isRTL } = select('core/editor').getEditorSettings();
	// const { onChange } = props;

	const [styleCardName, setStyleCardName] = useState('');
	const [styleCardLoad, setStyleCardLoad] = useState('');
	const { saveMaxiStyleCards,  receiveMaxiStyleCards } = useDispatch('maxiBlocks/style-cards');

	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	const styleCards = select('maxiBlocks/style-cards').receiveMaxiStyleCards();

	console.log('styleCards: ' + JSON.stringify(styleCards));

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

	const updatedStyleCard = getStyleCards();

	const getStyleCardsOptions = () => {
		const styleCardsArr = [];

		forIn(getStyleCards(), (value, key) =>
			styleCardsArr.push({ label: value.name, value: key })
		);
		return styleCardsArr;
	};

	const getStyleCardCurrent = () => {
		let styleCardCurrent = '';
		const allStyleCards = getStyleCards();

		forIn(allStyleCards, function get(value, key) {
			if (value.status === 'active') styleCardCurrent = key;
		});

		return styleCardCurrent;
	};

	const setStyleCardCurrent = card => {
		let styleCardCurrent = '';
		const allStyleCards = getStyleCards();

		forIn(allStyleCards, function get(value, key) {
			if (value.status === 'active' && card !== key) value.status = '';
			if (card === key) value.status === 'active';
		});

		console.log('allStyleCards' + JSON.stringify(allStyleCards));

		return allStyleCards;
	};

	// console.log('getStyleCardCurrent: ' + getStyleCardCurrent());

	return (
		<Fragment>
			<Button
				id='maxi-button__go-to-customizer'
				className='button maxi-button maxi-button__toolbar'
				aria-label='Style Cards'
				onClick={toggleVisible}
			>
				<Icon icon={styleCardBoat} />
				{__('Style Card Editor', 'maxi-blocks')}
			</Button>
			{isVisible && (
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
								value={getStyleCardCurrent()}
								options={getStyleCardsOptions()}
								onChange={val => {setStyleCardLoad(val); setStyleCardCurrent(val)}}
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
								<Icon icon={SCdelete} />
							</Button>
						</div>
						<div className='maxi-style-cards__sc--two'>
							<Button
								disabled={isEmpty(styleCardLoad)}
								onClick={() => {
									{/*onChange({
										...getStyleCards()[styleCardLoad].styleCard,
									});*/}
									setStyleCardLoad('');
								}}
							>
								{__('Preview', 'maxi-blocks')}
							</Button>
							<Button
								disabled={isEmpty(styleCardLoad)}
								onClick={() => {
									{/*onChange({
										...getStyleCards()[styleCardLoad].styleCard,
									});*/}
									setStyleCardLoad('');
								}}
							>
								{__('Apply', 'maxi-blocks')}
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
											styleCard: {
											},
											styleCardDefaults: {
											},
										},
									});
								} else {
									saveMaxiStyleCards({
										...getStyleCards(),
										[`sc_${new Date().getTime()}`]: {
											name: styleCardName,
											status: '',
											styleCard: {
											},
											styleCardDefaults: {
											},
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
									<Fragment>
										<div className='maxi-tab-content__box'>
											<AccordionControl
												isSecondary
												items={[
													{
														label: __(
															'Background Colours',
															'maxi-blocks'
														),
														content: (
															<Fragment>
																<ColorControl
																	label={__(
																		'Background 1',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__bg1-color--light'
																	color={getStyleCardAttr(
																		'background-1',
																		'light',
																		false
																	)}
																	defaultColor={getStyleCardAttr(
																		'background-1',
																		'light',
																		true
																	)}
																	// onChange={val => setState({ 'background-1': val })}
																	disableGradient
																/>
																<ColorControl
																	label={__(
																		'Background 2',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__bg2-color--light'
																	color={''}
																	defaultColor={''}
																	onChange={val => {}}
																/>
															</Fragment>
														),
													},
													{
														label: __(
															'Body',
															'maxi-blocks'
														),
														content: (
															<Fragment>
																<ColorControl
																	label={__(
																		'Text',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__text-color'
																	color={''}
																	defaultColor={''}
																	onChange={val => {}}
																/>
																<TypographyControl
																	{...getGroupAttributes(
																		attributes,
																		'typography'
																	)}
																	className='maxi-style-cards-control__sc__text-typography'
																	textLevel='p'
																	onChange={''}
																	hideAlignment
																	hideTextShadow
																	breakpoint={
																		deviceType
																	}
																/>
															</Fragment>
														),
													},
													{
														label: __(
															'H1',
															'maxi-blocks'
														),
														content: (
															<Fragment>
																<ColorControl
																	label={__(
																		'H1',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__h1-color'
																	color={''}
																	defaultColor={''}
																	onChange={val => {}}
																/>
																<TypographyControl
																	{...getGroupAttributes(
																		attributes,
																		'typography'
																	)}
																	className='maxi-style-cards-control__sc__h1-typography'
																	textLevel='p'
																	onChange={''}
																	hideAlignment
																	hideTextShadow
																	breakpoint={
																		deviceType
																	}
																/>
															</Fragment>
														),
													},
													{
														label: __(
															'H2',
															'maxi-blocks'
														),
														content: (
															<Fragment>
																<ColorControl
																	label={__(
																		'H2',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__h2-color'
																	color={''}
																	defaultColor={''}
																	onChange={val => {}}
																/>
																<TypographyControl
																	{...getGroupAttributes(
																		attributes,
																		'typography'
																	)}
																	className='maxi-style-cards-control__sc__h2-typography'
																	textLevel='p'
																	onChange={''}
																	hideAlignment
																	hideTextShadow
																	breakpoint={
																		deviceType
																	}
																/>
															</Fragment>
														),
													},
													{
														label: __(
															'H3',
															'maxi-blocks'
														),
														content: (
															<Fragment>
																<ColorControl
																	label={__(
																		'H3',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__h3-color'
																	color={''}
																	defaultColor={''}
																	onChange={val => {}}
																/>
																<TypographyControl
																	{...getGroupAttributes(
																		attributes,
																		'typography'
																	)}
																	className='maxi-style-cards-control__sc__h3-typography'
																	textLevel='p'
																	onChange={''}
																	hideAlignment
																	hideTextShadow
																	breakpoint={
																		deviceType
																	}
																/>
															</Fragment>
														),
													},
													{
														label: __(
															'H4',
															'maxi-blocks'
														),
														content: (
															<Fragment>
																<ColorControl
																	label={__(
																		'H4',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__h4-color'
																	color={''}
																	defaultColor={''}
																	onChange={val => {}}
																/>
																<TypographyControl
																	{...getGroupAttributes(
																		attributes,
																		'typography'
																	)}
																	className='maxi-style-cards-control__sc__h4-typography'
																	textLevel='p'
																	onChange={''}
																	hideAlignment
																	hideTextShadow
																	breakpoint={
																		deviceType
																	}
																/>
															</Fragment>
														),
													},
													{
														label: __(
															'H5',
															'maxi-blocks'
														),
														content: (
															<Fragment>
																<ColorControl
																	label={__(
																		'H5',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__h5-color'
																	color={''}
																	defaultColor={''}
																	onChange={val => {}}
																/>
																<TypographyControl
																	{...getGroupAttributes(
																		attributes,
																		'typography'
																	)}
																	className='maxi-style-cards-control__sc__h5-typography'
																	textLevel='p'
																	onChange={''}
																	hideAlignment
																	hideTextShadow
																	breakpoint={
																		deviceType
																	}
																/>
															</Fragment>
														),
													},
													{
														label: __(
															'H6',
															'maxi-blocks'
														),
														content: (
															<Fragment>
																<ColorControl
																	label={__(
																		'H6',
																		'maxi-blocks'
																	)}
																	className='maxi-style-cards-control__sc__h6-color'
																	color={''}
																	defaultColor={''}
																	onChange={val => {}}
																/>
																<TypographyControl
																	{...getGroupAttributes(
																		attributes,
																		'typography'
																	)}
																	className='maxi-style-cards-control__sc__h6-typography'
																	textLevel='p'
																	onChange={''}
																	hideAlignment
																	hideTextShadow
																	breakpoint={
																		deviceType
																	}
																/>
															</Fragment>
														),
													},
												]}
											/>
										</div>
									</Fragment>
								),
							},
							{
								label: __('Dark Style Preset', 'maxi-blocks'),
								content: (
									<Fragment>
										<div className='maxi-tab-content__box'>
											<AccordionControl
												isSecondary
												items={[]}
											/>
										</div>
									</Fragment>
								),
							},
						]}
					/>
				</Popover>
			)}
		</Fragment>
	);
});

export default MaxiStyleCardsEditor;
