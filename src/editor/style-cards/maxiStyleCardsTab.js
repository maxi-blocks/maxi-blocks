/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import getStyleCardAttr from '../../extensions/styles/defaults/style-card';
import { processSCAttribute, getDefaultSCAttribute } from './utils';
import {
	SettingTabsControl,
	AccordionControl,
	Button,
	ColorControl,
	Icon,
	TypographyControl,
	FancyRadioControl,
} from '../../components';
import { getTypographyFromSC } from '../../extensions/style-cards';

/**
 * Icons
 */
import { reset } from '../../icons';

/**
 * Component
 */
const SCTab = props => {
	const {
		type,
		disableTypography = false,
		breakpoint,
		SC,
		SCStyle,
		onChangeValue,
		firstLabel,
		firstColor = 'color',
		firstColorDefault,
		secondColor = false,
		secondLabel,
		secondColorDefault,
		thirdColor = false,
		thirdLabel,
		thirdColorDefault,
		forthColor = false,
		forthLabel,
		forthColorDefault,
		sixthColor = false,
		sixthLabel,
		sixthColorDefault,
		seventhColor = false,
		seventhLabel,
		seventhColorDefault,
	} = props;

	const firstColorGlobal = `${firstColor}-global`;
	const secondColorGlobal = `${secondColor}-global`;
	const thirdColorGlobal = `${thirdColor}-global`;
	const forthColorGlobal = `${forthColor}-global`;
	const sixthColorGlobal = `${sixthColor}-global`;
	const seventhColorGlobal = `${seventhColor}-global`;

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

	return (
		<>
			{!disableTypography && (
				<TypographyControl
					typography={getTypographyFromSC(SC, type)}
					disableFormats
					disableCustomFormats
					className={`maxi-style-cards-control__sc__${type}-typography`}
					textLevel={type}
					hideAlignment
					hideTextShadow
					breakpoint={breakpoint}
					disablePalette
					styleCards
					onChange={obj => onChangeValue({ typography: obj }, type)}
					blockStyle={SCStyle}
					disableFontFamily={breakpoint !== 'general'}
				/>
			)}
			{breakpoint === 'general' && (
				<FancyRadioControl
					label={__(`Use Global ${firstLabel} Colour`, 'maxi-blocks')}
					selected={processSCAttribute(SC, firstColorGlobal, type)}
					options={options}
					onChange={val =>
						onChangeValue(
							{
								[firstColorGlobal]: val,
								...(isEmpty(
									processSCAttribute(
										SC,
										firstColorGlobal,
										type
									)
								) && {
									[firstColor]: processSCAttribute(
										SC,
										firstColorDefault,
										'color'
									),
								}),
							},
							type
						)
					}
				/>
			)}
			{breakpoint === 'general' &&
				processSCAttribute(SC, firstColorGlobal, type) && (
					<ColorControl
						label={__(`${firstLabel} Text`, 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__color--${SCStyle}`}
						color={
							processSCAttribute(SC, firstColor, type) ||
							getStyleCardAttr(firstColorDefault, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(
							firstColorDefault,
							SCStyle,
							true
						)}
						onChange={({ color }) =>
							onChangeValue({ [firstColor]: color }, type)
						}
						disableGradient
						disablePalette
					/>
				)}
			{!!forthColor && breakpoint === 'general' && (
				<FancyRadioControl
					label={__(`Use Global ${forthLabel} Colour`, 'maxi-blocks')}
					selected={processSCAttribute(SC, forthColorGlobal, type)}
					options={options}
					onChange={val =>
						onChangeValue(
							{
								[forthColorGlobal]: val,
								...(isEmpty(
									processSCAttribute(SC, forthColor, type)
								) && {
									[forthColor]: processSCAttribute(
										SC,
										forthColorDefault,
										'color'
									),
								}),
							},
							type
						)
					}
				/>
			)}
			{!!forthColor &&
				breakpoint === 'general' &&
				processSCAttribute(SC, forthColorGlobal, type) && (
					<ColorControl
						label={__(forthLabel, 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__${forthColor}--${SCStyle}`}
						color={
							processSCAttribute(SC, forthColor, type) ||
							getStyleCardAttr(forthColorDefault, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(
							forthColorDefault,
							SCStyle,
							true
						)}
						onChange={({ color }) =>
							onChangeValue({ [forthColor]: color }, type)
						}
						disableGradient
						disablePalette
					/>
				)}
			{!!secondColor && breakpoint === 'general' && (
				<FancyRadioControl
					label={__(
						`Use Global ${secondLabel} Colour`,
						'maxi-blocks'
					)}
					selected={processSCAttribute(SC, secondColorGlobal, type)}
					options={options}
					onChange={val =>
						onChangeValue(
							{
								[secondColorGlobal]: val,
								...(isEmpty(
									processSCAttribute(SC, secondColor, type)
								) && {
									[secondColor]: processSCAttribute(
										SC,
										secondColorDefault,
										'color'
									),
								}),
							},
							type
						)
					}
				/>
			)}
			{!!secondColor &&
				breakpoint === 'general' &&
				processSCAttribute(SC, secondColorGlobal, type) && (
					<ColorControl
						label={__(secondLabel, 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__${secondColor}--${SCStyle}`}
						color={
							processSCAttribute(SC, secondColor, type) ||
							getStyleCardAttr(secondColorDefault, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(
							secondColorDefault,
							SCStyle,
							true
						)}
						onChange={({ color }) =>
							onChangeValue({ [secondColor]: color }, type)
						}
						disableGradient
						disablePalette
					/>
				)}
			{!!thirdColor && breakpoint === 'general' && (
				<FancyRadioControl
					label={__(`Use Global ${thirdLabel} Colour`, 'maxi-blocks')}
					selected={processSCAttribute(SC, thirdColorGlobal, type)}
					options={options}
					onChange={val =>
						onChangeValue(
							{
								[thirdColorGlobal]: val,
								...(isEmpty(
									processSCAttribute(SC, thirdColor, type)
								) && {
									[thirdColor]: processSCAttribute(
										SC,
										thirdColorDefault,
										'color'
									),
								}),
							},
							type
						)
					}
				/>
			)}
			{!!thirdColor &&
				breakpoint === 'general' &&
				processSCAttribute(SC, thirdColorGlobal, type) && (
					<ColorControl
						label={__(thirdLabel, 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__${thirdColor}--${SCStyle}`}
						color={
							processSCAttribute(SC, thirdColor, type) ||
							getStyleCardAttr(thirdColorDefault, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(
							thirdColorDefault,
							SCStyle,
							true
						)}
						onChange={({ color }) =>
							onChangeValue({ [thirdColor]: color }, type)
						}
						disableGradient
						disablePalette
					/>
				)}
			{!!sixthColor && breakpoint === 'general' && (
				<FancyRadioControl
					label={__(`Use Global ${sixthLabel} Colour`, 'maxi-blocks')}
					selected={processSCAttribute(SC, sixthColorGlobal, type)}
					options={options}
					onChange={val =>
						onChangeValue(
							{
								[sixthColorGlobal]: val,
								...(isEmpty(
									processSCAttribute(SC, sixthColor, type)
								) && {
									[sixthColor]: processSCAttribute(
										SC,
										sixthColorDefault,
										'color'
									),
								}),
							},
							type
						)
					}
				/>
			)}
			{!!sixthColor &&
				breakpoint === 'general' &&
				processSCAttribute(SC, sixthColorGlobal, type) && (
					<ColorControl
						label={__(sixthLabel, 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__${sixthColor}--${SCStyle}`}
						color={
							processSCAttribute(SC, sixthColor, type) ||
							getStyleCardAttr(sixthColorDefault, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(
							sixthColorDefault,
							SCStyle,
							true
						)}
						onChange={({ color }) =>
							onChangeValue({ [sixthColor]: color }, type)
						}
						disableGradient
						disablePalette
					/>
				)}
			{!!seventhColor && breakpoint === 'general' && (
				<FancyRadioControl
					label={__(
						`Use Global ${seventhLabel} Colour`,
						'maxi-blocks'
					)}
					selected={processSCAttribute(SC, seventhColorGlobal, type)}
					options={options}
					onChange={val =>
						onChangeValue(
							{
								[seventhColorGlobal]: val,
								...(isEmpty(
									processSCAttribute(SC, seventhColor, type)
								) && {
									[seventhColor]: processSCAttribute(
										SC,
										seventhColorDefault,
										'color'
									),
								}),
							},
							type
						)
					}
				/>
			)}
			{!!seventhColor &&
				breakpoint === 'general' &&
				processSCAttribute(SC, seventhColorGlobal, type) && (
					<ColorControl
						label={__(seventhLabel, 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__${seventhColor}--${SCStyle}`}
						color={
							processSCAttribute(SC, seventhColor, type) ||
							getStyleCardAttr(seventhColorDefault, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(
							seventhColorDefault,
							SCStyle,
							true
						)}
						onChange={({ color }) =>
							onChangeValue({ [seventhColor]: color }, type)
						}
						disableGradient
						disablePalette
					/>
				)}
		</>
	);
};

const LinkTab = props => {
	const { SC, onChangeValue, SCStyle } = props;

	return {
		label: __('Link', 'maxi-blocks'),
		content: (
			<>
				<FancyRadioControl
					label={__('Use Global Link Colour', 'maxi-blocks')}
					selected={processSCAttribute(
						SC,
						'link-color-global',
						'link'
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
					onChange={val =>
						onChangeValue(
							{
								'link-color-global': val,
								...(isEmpty(
									processSCAttribute(SC, 'link-color', 'link')
								) && {
									'link-color': processSCAttribute(
										SC,
										4,
										'color'
									),
								}),
							},
							'link'
						)
					}
				/>
				{processSCAttribute(SC, 'link-color-global', 'link') && (
					<ColorControl
						label={__('Link', 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__link--${SCStyle}`}
						color={
							processSCAttribute(SC, 'link-color', 'link') ||
							getStyleCardAttr(4, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(4, SCStyle, true)}
						onChange={({ color }) =>
							onChangeValue({ 'link-color': color }, 'link')
						}
						disableGradient
						disablePalette
					/>
				)}
				<FancyRadioControl
					label={__('Use Global Link Hover Colour', 'maxi-blocks')}
					selected={processSCAttribute(
						SC,
						'hover-color-global',
						'link'
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
					onChange={val =>
						onChangeValue(
							{
								'hover-color-global': val,
								...(isEmpty(
									processSCAttribute(
										SC,
										'hover-color',
										'link'
									)
								) && {
									'hover-color': processSCAttribute(
										SC,
										6,
										'color'
									),
								}),
							},
							'link'
						)
					}
				/>
				{processSCAttribute(SC, 'hover-color-global', 'link') && (
					<ColorControl
						label={__('Link Hover', 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__link--${SCStyle}`}
						color={
							processSCAttribute(SC, 'hover-color', 'link') ||
							getStyleCardAttr(1, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(4, SCStyle, true)}
						onChange={({ color }) =>
							onChangeValue({ 'hover-color': color }, 'link')
						}
						disableGradient
						disablePalette
					/>
				)}
				<FancyRadioControl
					label={__('Use Global Link Active Colour', 'maxi-blocks')}
					selected={processSCAttribute(
						SC,
						'active-color-global',
						'link'
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
					onChange={val =>
						onChangeValue(
							{
								'active-color-global': val,
								...(isEmpty(
									processSCAttribute(
										SC,
										'active-color',
										'link'
									)
								) && {
									'active-color': processSCAttribute(
										SC,
										6,
										'color'
									),
								}),
							},
							'link'
						)
					}
				/>
				{processSCAttribute(SC, 'active-color-global', 'link') && (
					<ColorControl
						label={__('Link Active', 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__link--${SCStyle}`}
						color={
							processSCAttribute(SC, 'active-color', 'link') ||
							getStyleCardAttr(1, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(4, SCStyle, true)}
						onChange={({ color }) =>
							onChangeValue({ 'active-color': color }, 'link')
						}
						disableGradient
						disablePalette
					/>
				)}
				<FancyRadioControl
					label={__('Use Global Link Visited Colour', 'maxi-blocks')}
					selected={processSCAttribute(
						SC,
						'visited-color-global',
						'link'
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
					onChange={val =>
						onChangeValue(
							{
								'visited-color-global': val,
								...(isEmpty(
									processSCAttribute(
										SC,
										'visited-color',
										'link'
									)
								) && {
									'visited-color': processSCAttribute(
										SC,
										6,
										'color'
									),
								}),
							},
							'link'
						)
					}
				/>
				{processSCAttribute(SC, 'visited-color-global', 'link') && (
					<ColorControl
						label={__('Link Visited', 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__link--${SCStyle}`}
						color={
							processSCAttribute(SC, 'visited-color', 'link') ||
							getStyleCardAttr(1, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(4, SCStyle, true)}
						onChange={({ color }) =>
							onChangeValue({ 'visited-color': color }, 'link')
						}
						disableGradient
						disablePalette
					/>
				)}
			</>
		),
	};
};

const MaxiStyleCardsTab = ({ SC, SCStyle, breakpoint, onChangeValue }) => {
	const [quickColorPreset, setQuickColorPreset] = useState(1);

	const generateTab = props => {
		return {
			label: __(props.tabLabel, 'maxi-blocks'),
			content: (
				<SCTab
					breakpoint={breakpoint}
					SC={SC}
					SCStyle={SCStyle}
					onChangeValue={onChangeValue}
					{...props}
				/>
			),
		};
	};

	const headingItems = () =>
		[1, 2, 3, 4, 5, 6].map(item => {
			return {
				label: __(`H${item}`, 'maxi-blocks'),
				content: (
					<SCTab
						breakpoint={breakpoint}
						SC={SC}
						SCStyle={SCStyle}
						onChangeValue={onChangeValue}
						type={`h${item}`}
						firstLabel={`H${item}`}
						firstColorDefault={5}
					/>
				),
			};
		});

	return (
		<div className='maxi-tab-content__box'>
			<AccordionControl
				isSecondary
				items={[
					{
						label: __('Quick Pick Colour Presets', 'maxi-blocks'),
						content: (
							<>
								<div className='maxi-style-cards__quick-color-presets'>
									{[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
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
													background: `rgba(${processSCAttribute(
														SC,
														item,
														'color'
													)}, 1)`,
												}}
											/>
										</div>
									))}
								</div>
								<ColorControl
									className={`maxi-style-cards-control__sc__color-${quickColorPreset}-${SCStyle}`}
									color={`rgba(${processSCAttribute(
										SC,
										quickColorPreset,
										'color'
									)}, 1)`}
									defaultColor={`rgba(${processSCAttribute(
										SC,
										quickColorPreset,
										'color'
									)}, 1)`}
									onChange={({ color }) =>
										onChangeValue(
											{
												[`${quickColorPreset}`]: color
													.replace('rgb(', '')
													.replace(')', ''),
											},
											'color'
										)
									}
									format='colorString'
									disableColorDisplay
									disableOpacity
									disableGradient
									disablePalette
								/>
								<Button
									className='maxi-style-cards__quick-color-presets__reset-button'
									onClick={() =>
										onChangeValue(
											{
												[`${quickColorPreset}`]:
													SC.defaultStyleCard.color[
														quickColorPreset
													],
											},
											'color'
										)
									}
								>
									<span
										className='maxi-style-cards__quick-color-presets__reset-button__preview'
										style={{
											background: `rgba(${getDefaultSCAttribute(
												SC,
												quickColorPreset,
												'color'
											)}, 1)`,
										}}
									/>
									<Icon icon={reset} />
									{__('Reset Preset', 'maxi-blocks')}
								</Button>
							</>
						),
					},
					generateTab({
						type: 'button',
						tabLabel: __('Button', 'maxi-blocks'),
						firstLabel: __('Button Text', 'maxi-blocks'),
						firstColorDefault: 1,
						secondColor: 'background-color',
						secondLabel: __('Button Background', 'maxi-blocks'),
						secondColorDefault: 4,
						thirdColor: 'hover-background-color',
						thirdLabel: __(
							'Button Background Hover',
							'maxi-blocks'
						),
						thirdColorDefault: 6,
						forthColor: 'hover-color',
						forthLabel: __('Button Text Hover', 'maxi-blocks'),
						forthColorDefault: 5,
						sixthColor: 'border-color',
						sixthLabel: __('Button Border', 'maxi-blocks'),
						sixthColorDefault: 5,
						seventhColor: 'hover-border-color',
						seventhLabel: __('Button Border Hover', 'maxi-blocks'),
						seventhColorDefault: 6,
					}),
					generateTab({
						type: 'p',
						tabLabel: __('Paragraph', 'maxi-blocks'),
						firstLabel: __('Paragraph', 'maxi-blocks'),
						firstColorDefault: 3,
					}),
					LinkTab({ SC, onChangeValue, SCStyle }),
					{
						label: __('Headings', 'maxi-blocks'),
						content: <SettingTabsControl items={headingItems()} />,
					},
					breakpoint === 'general' &&
						generateTab({
							type: 'icon',
							tabLabel: __('SVG Icons', 'maxi-blocks'),
							disableTypography: true,
							firstLabel: __('Line', 'maxi-blocks'),
							firstColor: 'line',
							firstColorDefault: 7,
							secondColor: 'fill',
							secondLabel: __('Fill', 'maxi-blocks'),
							secondColorDefault: 4,
						}),
					breakpoint === 'general' &&
						generateTab({
							type: 'divider',
							tabLabel: __('Divider', 'maxi-blocks'),
							firstLabel: __('Divider', 'maxi-blocks'),
							firstColorDefault: 4,
							disableTypography: true,
						}),
				]}
			/>
		</div>
	);
};

export default MaxiStyleCardsTab;
