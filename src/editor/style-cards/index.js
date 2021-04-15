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
	onChangeDelete,
	currentKey,
}) => {
	const getColor = attr => {
		const scStyleColor = SC.styleCard[SCStyle][attr];
		if (!isNil(scStyleColor)) return scStyleColor;

		const scStyleColorDefault = SC.styleCardDefaults[SCStyle][attr];
		if (!isNil(scStyleColorDefault)) {
			if (scStyleColorDefault.includes('var')) {
				const scStyleColorDefaultVar = scStyleColorDefault.match(
					/color-\d/
				);
				const scStyleColorDefaultColor =
					SC.styleCardDefaults[SCStyle][scStyleColorDefaultVar];
				if (!isNil(scStyleColorDefaultColor))
					return scStyleColorDefaultColor;
			} else return scStyleColorDefault;
		}
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
		return parsedTypography;
	};

	const getTypographyGroup = level => {
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

	if (document.querySelectorAll('.maxi-style-cards__sc-select option'))
		setTimeout(function scSelect() {
			addActiveSCdropdownStyle(currentKey);
		}, 300);

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
													background: getColor(
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
									color={getColor(
										`color-${quickColorPreset}`
									)}
									defaultColor={getColor(
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
					{
						label: __('Button', 'maxi-blocks'),
						content: (
							<Fragment>
								<FancyRadioControl
									label={__(
										'Use Global Text Colour',
										'maxi-blocks'
									)}
									selected={getColor(
										'button-text-color-global'
									)}
									options={[
										{
											label: __('Yes', 'maxi-blocks'),
											value: 1,
										},
										{
											label: __('No', 'maxi-blocks'),
											value: 0,
										},
									]}
									onChange={val => {
										if (!val)
											onChangeDelete(
												'button-text-color',
												SCStyle
											);
										if (val)
											onChangeValue(
												'button-text-color',
												getColor('button-text-color'),
												SCStyle
											);
										onChangeValue(
											'button-text-color-global',
											val,
											SCStyle
										);
									}}
								/>
								{getColor('button-text-color-global') && (
									<ColorControl
										label={__('Button Text', 'maxi-blocks')}
										className={`maxi-style-cards-control__sc__button-text-color--${SCStyle}`}
										color={getColor('button-text-color')}
										defaultColor={getStyleCardAttr(
											'button-text-color',
											SCStyle,
											true
										)}
										onChange={val => {
											onChangeValue(
												'button-text-color',
												val,
												SCStyle
											);
										}}
										disableGradient
										noPalette
									/>
								)}
								<TypographyControl
									typography={getTypographyGroup('button')}
									prefix='button-'
									disableFormats
									className='maxi-style-cards-control__sc__button-typography'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									noPalette
									styleCards
									onChange={obj => {
										const parsedContent = parseSCtypography(
											obj
										);
										onChangeValue(
											'typography',
											parsedContent,
											SCStyle
										);
									}}
								/>
								<FancyRadioControl
									label={__(
										'Use Global Background Colour',
										'maxi-blocks'
									)}
									selected={getColor(
										'button-background-color-global'
									)}
									options={[
										{
											label: __('Yes', 'maxi-blocks'),
											value: 1,
										},
										{
											label: __('No', 'maxi-blocks'),
											value: 0,
										},
									]}
									onChange={val => {
										if (!val)
											onChangeDelete(
												'button-background-color',
												SCStyle
											);
										if (val)
											onChangeValue(
												'button-background-color',
												getColor(
													'button-background-color'
												),
												SCStyle
											);
										onChangeValue(
											'button-background-color-global',
											val,
											SCStyle
										);
									}}
								/>
								{getColor('button-background-color-global') && (
									<ColorControl
										label={__(
											'Button Background',
											'maxi-blocks'
										)}
										className={`maxi-style-cards-control__sc__button-bg-color--${SCStyle}`}
										color={getColor(
											'button-background-color'
										)}
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
										noPalette
									/>
								)}
							</Fragment>
						),
					},
					{
						label: __('Paragraph', 'maxi-blocks'),
						content: (
							<Fragment>
								{deviceType === 'general' && (
									<FancyRadioControl
										label={__(
											'Use Global Paragraph Colour',
											'maxi-blocks'
										)}
										selected={getColor(
											'p-color-general-global'
										)}
										options={[
											{
												label: __('Yes', 'maxi-blocks'),
												value: 1,
											},
											{
												label: __('No', 'maxi-blocks'),
												value: 0,
											},
										]}
										onChange={val => {
											if (!val)
												onChangeDelete(
													'p-text-color',
													SCStyle
												);
											if (val)
												onChangeValue(
													'p-color-general',
													getColor('p-color-general'),
													SCStyle
												);
											onChangeValue(
												'p-color-general-global',
												val,
												SCStyle
											);
										}}
									/>
								)}
								{deviceType === 'general' &&
									getColor('p-color-general-global') && (
										<ColorControl
											label={__(
												'Paragraph Text',
												'maxi-blocks'
											)}
											className={`maxi-style-cards-control__sc__p-text-color--${SCStyle}`}
											color={getColor('p-color-general')}
											defaultColor={getStyleCardAttr(
												'p-color-general',
												SCStyle,
												true
											)}
											onChange={val => {
												onChangeValue(
													'p-color-general',
													val,
													SCStyle
												);
											}}
											disableGradient
											noPalette
										/>
									)}
								<TypographyControl
									typography={getTypographyGroup('p')}
									prefix='p-'
									disableFormats
									className='maxi-style-cards-control__sc__text-typography'
									textLevel='p'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									noPalette
									styleCards
									onChange={obj => {
										const parsedContent = parseSCtypography(
											obj
										);
										// console.log('parsedContent p' + JSON.stringify(parsedContent));
										onChangeValue(
											'typography',
											parsedContent,
											SCStyle
										);
									}}
								/>
								{deviceType === 'general' && (
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
										noPalette
									/>
								)}
							</Fragment>
						),
					},
					{
						label: __('H1', 'maxi-blocks'),
						content: (
							<Fragment>
								{deviceType === 'general' && (
									<FancyRadioControl
										label={__(
											'Use Global H1 Colour',
											'maxi-blocks'
										)}
										selected={getColor(
											'h1-color-general-global'
										)}
										options={[
											{
												label: __('Yes', 'maxi-blocks'),
												value: 1,
											},
											{
												label: __('No', 'maxi-blocks'),
												value: 0,
											},
										]}
										onChange={val => {
											if (!val)
												onChangeDelete(
													'h1-text-color',
													SCStyle
												);
											if (val)
												onChangeValue(
													'h1-color-general',
													getColor(
														'h1-color-general'
													),
													SCStyle
												);
											onChangeValue(
												'h1-color-general-global',
												val,
												SCStyle
											);
										}}
									/>
								)}
								{deviceType === 'general' &&
									getColor('h1-color-general-global') && (
										<ColorControl
											label={__('H1 Text', 'maxi-blocks')}
											className={`maxi-style-cards-control__sc__h1-text-color--${SCStyle}`}
											color={getColor('h1-color-general')}
											defaultColor={getStyleCardAttr(
												'h1-color-general',
												SCStyle,
												true
											)}
											onChange={val => {
												onChangeValue(
													'h1-color-general',
													val,
													SCStyle
												);
											}}
											disableGradient
											noPalette
										/>
									)}
								<TypographyControl
									typography={getTypographyGroup('h1')}
									prefix='h1-'
									disableFormats
									className='maxi-style-cards-control__sc__h1-typography'
									textLevel='h1'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									noPalette
									styleCards
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
							</Fragment>
						),
					},
					{
						label: __('H2', 'maxi-blocks'),
						content: (
							<Fragment>
								{deviceType === 'general' && (
									<FancyRadioControl
										label={__(
											'Use Global H2 Colour',
											'maxi-blocks'
										)}
										selected={getColor(
											'h2-color-general-global'
										)}
										options={[
											{
												label: __('Yes', 'maxi-blocks'),
												value: 1,
											},
											{
												label: __('No', 'maxi-blocks'),
												value: 0,
											},
										]}
										onChange={val => {
											if (!val)
												onChangeDelete(
													'h2-text-color',
													SCStyle
												);
											if (val)
												onChangeValue(
													'h2-color-general',
													getColor(
														'h2-color-general'
													),
													SCStyle
												);
											onChangeValue(
												'h2-color-general-global',
												val,
												SCStyle
											);
										}}
									/>
								)}
								{deviceType === 'general' &&
									getColor('h2-color-general-global') && (
										<ColorControl
											label={__('H2 Text', 'maxi-blocks')}
											className={`maxi-style-cards-control__sc__h2-text-color--${SCStyle}`}
											color={getColor('h2-color-general')}
											defaultColor={getStyleCardAttr(
												'h2-color-general',
												SCStyle,
												true
											)}
											onChange={val => {
												onChangeValue(
													'h2-color-general',
													val,
													SCStyle
												);
											}}
											disableGradient
											noPalette
										/>
									)}
								<TypographyControl
									typography={getTypographyGroup('h2')}
									prefix='h2-'
									disableFormats
									className='maxi-style-cards-control__sc__h2-typography'
									textLevel='h2'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									noPalette
									styleCards
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
							</Fragment>
						),
					},
					{
						label: __('H3', 'maxi-blocks'),
						content: (
							<Fragment>
								{deviceType === 'general' && (
									<FancyRadioControl
										label={__(
											'Use Global H3 Colour',
											'maxi-blocks'
										)}
										selected={getColor(
											'h3-color-general-global'
										)}
										options={[
											{
												label: __('Yes', 'maxi-blocks'),
												value: 1,
											},
											{
												label: __('No', 'maxi-blocks'),
												value: 0,
											},
										]}
										onChange={val => {
											if (!val)
												onChangeDelete(
													'h3-text-color',
													SCStyle
												);
											if (val)
												onChangeValue(
													'h3-color-general',
													getColor(
														'h3-color-general'
													),
													SCStyle
												);
											onChangeValue(
												'h3-color-general-global',
												val,
												SCStyle
											);
										}}
									/>
								)}
								{deviceType === 'general' &&
									getColor('h3-color-general-global') && (
										<ColorControl
											label={__('H3 Text', 'maxi-blocks')}
											className={`maxi-style-cards-control__sc__h3-text-color--${SCStyle}`}
											color={getColor('h3-color-general')}
											defaultColor={getStyleCardAttr(
												'h3-color-general',
												SCStyle,
												true
											)}
											onChange={val => {
												onChangeValue(
													'h3-color-general',
													val,
													SCStyle
												);
											}}
											disableGradient
											noPalette
										/>
									)}
								<TypographyControl
									typography={getTypographyGroup('h3')}
									prefix='h3-'
									disableFormats
									className='maxi-style-cards-control__sc__h3-typography'
									textLevel='h3'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									noPalette
									styleCards
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
							</Fragment>
						),
					},
					{
						label: __('H4', 'maxi-blocks'),
						content: (
							<Fragment>
								{deviceType === 'general' && (
									<FancyRadioControl
										label={__(
											'Use Global H4 Colour',
											'maxi-blocks'
										)}
										selected={getColor(
											'h4-color-general-global'
										)}
										options={[
											{
												label: __('Yes', 'maxi-blocks'),
												value: 1,
											},
											{
												label: __('No', 'maxi-blocks'),
												value: 0,
											},
										]}
										onChange={val => {
											if (!val)
												onChangeDelete(
													'h4-text-color',
													SCStyle
												);
											if (val)
												onChangeValue(
													'h4-color-general',
													getColor(
														'h4-color-general'
													),
													SCStyle
												);
											onChangeValue(
												'h4-color-general-global',
												val,
												SCStyle
											);
										}}
									/>
								)}
								{deviceType === 'general' &&
									getColor('h4-color-general-global') && (
										<ColorControl
											label={__('H4 Text', 'maxi-blocks')}
											className={`maxi-style-cards-control__sc__h4-text-color--${SCStyle}`}
											color={getColor('h4-color-general')}
											defaultColor={getStyleCardAttr(
												'h4-color-general',
												SCStyle,
												true
											)}
											onChange={val => {
												onChangeValue(
													'h4-color-general',
													val,
													SCStyle
												);
											}}
											disableGradient
											noPalette
										/>
									)}
								<TypographyControl
									typography={getTypographyGroup('h4')}
									prefix='h4-'
									disableFormats
									className='maxi-style-cards-control__sc__h4-typography'
									textLevel='h4'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									noPalette
									styleCards
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
							</Fragment>
						),
					},
					{
						label: __('H5', 'maxi-blocks'),
						content: (
							<Fragment>
								{deviceType === 'general' && (
									<FancyRadioControl
										label={__(
											'Use Global H5 Colour',
											'maxi-blocks'
										)}
										selected={getColor(
											'h5-color-general-global'
										)}
										options={[
											{
												label: __('Yes', 'maxi-blocks'),
												value: 1,
											},
											{
												label: __('No', 'maxi-blocks'),
												value: 0,
											},
										]}
										onChange={val => {
											if (!val)
												onChangeDelete(
													'h5-text-color',
													SCStyle
												);
											if (val)
												onChangeValue(
													'h5-color-general',
													getColor(
														'h5-color-general'
													),
													SCStyle
												);
											onChangeValue(
												'h5-color-general-global',
												val,
												SCStyle
											);
										}}
									/>
								)}
								{deviceType === 'general' &&
									getColor('h5-color-general-global') && (
										<ColorControl
											label={__('H5 Text', 'maxi-blocks')}
											className={`maxi-style-cards-control__sc__h5-text-color--${SCStyle}`}
											color={getColor('h5-color-general')}
											defaultColor={getStyleCardAttr(
												'h5-color-general',
												SCStyle,
												true
											)}
											onChange={val => {
												onChangeValue(
													'h5-color-general',
													val,
													SCStyle
												);
											}}
											disableGradient
											noPalette
										/>
									)}
								<TypographyControl
									typography={getTypographyGroup('h5')}
									prefix='h5-'
									disableFormats
									className='maxi-style-cards-control__sc__h5-typography'
									textLevel='h5'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									noPalette
									styleCards
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
							</Fragment>
						),
					},
					{
						label: __('H6', 'maxi-blocks'),
						content: (
							<Fragment>
								{deviceType === 'general' && (
									<FancyRadioControl
										label={__(
											'Use Global H6 Colour',
											'maxi-blocks'
										)}
										selected={getColor(
											'h6-color-general-global'
										)}
										options={[
											{
												label: __('Yes', 'maxi-blocks'),
												value: 1,
											},
											{
												label: __('No', 'maxi-blocks'),
												value: 0,
											},
										]}
										onChange={val => {
											if (!val)
												onChangeDelete(
													'h6-text-color',
													SCStyle
												);
											if (val)
												onChangeValue(
													'h6-color-general',
													getColor(
														'h6-color-general'
													),
													SCStyle
												);
											onChangeValue(
												'h6-color-general-global',
												val,
												SCStyle
											);
										}}
									/>
								)}
								{deviceType === 'general' &&
									getColor('h6-color-general-global') && (
										<ColorControl
											label={__('H6 Text', 'maxi-blocks')}
											className={`maxi-style-cards-control__sc__h6-text-color--${SCStyle}`}
											color={getColor('h6-color-general')}
											defaultColor={getStyleCardAttr(
												'h6-color-general',
												SCStyle,
												true
											)}
											onChange={val => {
												onChangeValue(
													'h6-color-general',
													val,
													SCStyle
												);
											}}
											disableGradient
											noPalette
										/>
									)}
								<TypographyControl
									typography={getTypographyGroup('h6')}
									prefix='h6-'
									disableFormats
									className='maxi-style-cards-control__sc__h6-typography'
									textLevel='h6'
									hideAlignment
									hideTextShadow
									breakpoint={deviceType}
									noPalette
									styleCards
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
								noPalette
							/>
						),
					},
					deviceType === 'general' && {
						label: __('SVG Icon', 'maxi-blocks'),
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
									noPalette
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
									noPalette
								/>
							</Fragment>
						),
					},
					deviceType === 'general' && {
						label: __('Font Icon', 'maxi-blocks'),
						content: (
							<ColorControl
								label={__('Font Icon', 'maxi-blocks')}
								className={`maxi-style-cards-control__sc__font-icon-${SCStyle}`}
								color={getColor('font-icon-color')}
								defaultColor={getStyleCardAttr(
									'font-icon-color',
									SCStyle,
									true
								)}
								onChange={val => {
									onChangeValue(
										'font-icon-color',
										val,
										SCStyle
									);
								}}
								disableGradient
								noPalette
							/>
						),
					},
					deviceType === 'general' && {
						label: __('Divider', 'maxi-blocks'),
						content: (
							<ColorControl
								label={__('Divider', 'maxi-blocks')}
								className={`maxi-style-cards-control__sc__divider-color-${SCStyle}`}
								color={getColor('divider-color')}
								defaultColor={getStyleCardAttr(
									'divider-color',
									SCStyle,
									true
								)}
								onChange={val => {
									onChangeValue(
										'divider-color',
										val,
										SCStyle
									);
								}}
								disableGradient
								noPalette
							/>
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

	const onChangeDelete = (prop, style) => {
		const newStateSC = stateSC;

		delete newStateSC.styleCard[style][prop];

		const inlineStyles = document.getElementById(
			'maxi-blocks-sc-vars-inline-css'
		);
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

		console.log(prop + ': ' + value);

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
