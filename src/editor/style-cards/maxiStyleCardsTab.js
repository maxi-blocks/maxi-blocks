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
import { processSCAttribute } from './utils';
import {
	SettingTabsControl,
	AccordionControl,
	ColorControl,
	TypographyControl,
	FancyRadioControl,
} from '../../components';
import { getTypographyFromSC } from '../../extensions/style-cards';

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
	} = props;

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
			{breakpoint === 'general' && (
				<FancyRadioControl
					label={__('Use Global SVG Line Colour', 'maxi-blocks')}
					selected={processSCAttribute(SC, 'line-global', type)}
					options={options}
					onChange={val => {
						onChangeValue(
							{
								'line-global': val,
								...(isEmpty(
									processSCAttribute(SC, 'line-global', type)
								) && {
									line: processSCAttribute(SC, 7, 'color'),
								}),
							},
							type
						);
					}}
				/>
			)}
			{breakpoint === 'general' &&
				processSCAttribute(SC, 'line-global', type) && (
					<ColorControl
						label={__('Line', 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__line--${SCStyle}`}
						color={
							processSCAttribute(SC, 'line', type) ||
							getStyleCardAttr(7, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(7, SCStyle, true)}
						onChange={({ color }) => {
							onChangeValue({ line: color }, type);
						}}
						disableGradient
						disablePalette
					/>
				)}
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
					onChange={obj => {
						// const parsedTypography = getSCFromTypography(SC, obj);
						onChangeValue({ typography: obj }, type);
					}}
					blockStyle={SCStyle}
					disableFontFamily={breakpoint !== 'general'}
				/>
			)}
			{breakpoint === 'general' && (
				<FancyRadioControl
					label={__('Use Global SVG Fill Colour', 'maxi-blocks')}
					selected={processSCAttribute(SC, 'fill-global', type)}
					options={options}
					onChange={val => {
						onChangeValue(
							{
								'fill-global': val,
								...(isEmpty(
									processSCAttribute(SC, 'fill', type)
								) && {
									fill: processSCAttribute(SC, 4, 'color'),
								}),
							},
							type
						);
					}}
				/>
			)}
			{breakpoint === 'general' &&
				processSCAttribute(SC, 'fill-global', type) && (
					<ColorControl
						label={__('Fill', 'maxi-blocks')}
						className={`maxi-style-cards-control__sc__fill--${SCStyle}`}
						color={
							processSCAttribute(SC, 'fill', type) ||
							getStyleCardAttr(4, SCStyle, true)
						}
						defaultColor={getStyleCardAttr(4, SCStyle, true)}
						onChange={({ color }) => {
							onChangeValue({ fill: color }, type);
						}}
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
					onChange={val => {
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
						);
					}}
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
						onChange={({ color }) => {
							onChangeValue({ 'link-color': color }, 'link');
						}}
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
					onChange={val => {
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
						);
					}}
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
						onChange={({ color }) => {
							onChangeValue({ 'hover-color': color }, 'link');
						}}
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
					onChange={val => {
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
						);
					}}
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
						onChange={({ color }) => {
							onChangeValue({ 'active-color': color }, 'link');
						}}
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
					onChange={val => {
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
						);
					}}
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
						onChange={({ color }) => {
							onChangeValue({ 'visited-color': color }, 'link');
						}}
						disableGradient
						disablePalette
					/>
				)}
			</>
		),
		classNameItem: 'maxi-blocks-sc__type--link',
	};
};

const MaxiStyleCardsTab = ({ SC, SCStyle, breakpoint, onChangeValue }) => {
	const [quickColorPreset, setQuickColorPreset] = useState(1);

	const generateTab = props => {
		return {
			label: __(props.firstLabel, 'maxi-blocks'),
			content: (
				<SCTab
					breakpoint={breakpoint}
					SC={SC}
					SCStyle={SCStyle}
					onChangeValue={onChangeValue}
					{...props}
				/>
			),
			classNameItem: `maxi-blocks-sc__type--${props.type}`,
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
				classNameItem: `maxi-blocks-sc__type--h${item}`,
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
													background:
														processSCAttribute(
															SC,
															item,
															'color'
														),
												}}
											/>
										</div>
									))}
								</div>
								<ColorControl
									disableColorDisplay
									disableOpacity
									className={`maxi-style-cards-control__sc__color-${quickColorPreset}-${SCStyle}`}
									color={processSCAttribute(
										SC,
										quickColorPreset,
										'color'
									)}
									defaultColor={processSCAttribute(
										SC,
										quickColorPreset,
										'color'
									)}
									onChange={({ color }) => {
										onChangeValue(
											{
												[`${quickColorPreset}`]: color,
											},
											'color'
										);
									}}
									disableGradient
									disablePalette
								/>
							</>
						),
						classNameItem: 'maxi-blocks-sc__type--quick-color',
					},
					generateTab({
						type: 'button',
						firstLabel: 'Button',
						firstColorDefault: 1,
						secondColor: 'background-color',
						secondLabel: 'Button Background',
						secondColorDefault: 4,
					}),
					generateTab({
						type: 'p',
						firstLabel: 'Paragraph',
						firstColorDefault: 3,
					}),
					LinkTab({ SC, onChangeValue, SCStyle }),
					{
						label: __('Headings', 'maxi-blocks'),
						content: <SettingTabsControl items={headingItems()} />,
						classNameItem: 'maxi-blocks-sc__type--heading',
					},
					generateTab({
						type: 'hover',
						firstLabel: 'Hover',
						firstColorDefault: 6,
						disableTypography: true,
					}),
					generateTab({
						type: 'icon',
						firstLabel: 'SVG Icons',
						disableTypography: true,
					}),
					generateTab({
						type: 'divider',
						firstLabel: 'Divider',
						firstColorDefault: 4,
						disableTypography: true,
					}),
				]}
			/>
		</div>
	);
};

export default MaxiStyleCardsTab;
