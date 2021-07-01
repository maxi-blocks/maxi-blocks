/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import FontFamilySelector from '../../../font-family-selector';
import ToolbarPopover from '../toolbar-popover';
import TextFormatStrikethrough from '../text-format-strikethrough';
import TextFormatUnderline from '../text-format-underline';
import TextFormatOverline from '../text-format-overline';
import TextFormatSubscript from '../text-format-subscript';
import TextFormatSuperscript from '../text-format-superscript';
import TextFormatCode from '../text-format-code';
import SettingTabsControl from '../../../setting-tabs-control';
import AdvancedNumberControl from '../../../advanced-number-control';
import {
	setFormat,
	getCustomFormatValue,
	withFormatValue,
} from '../../../../extensions/text/formats';
import {
	getGroupAttributes,
	getDefaultAttribute,
	getLastBreakpointAttribute,
	getBlockStyle,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, inRange } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * Component
 */
const breakpoints = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];

const TextOptions = props => {
	const {
		getValue,
		getDefault,
		onChangeFormat,
		prefix,
		minMaxSettings,
		minMaxSettingsLetterSpacing,
		breakpoint,
		avoidXXL,
	} = props;

	return (
		<>
			<AdvancedNumberControl
				className='maxi-typography-control__size'
				label={__('Size', 'maxi-blocks')}
				enableUnit
				unit={getValue(`${prefix}font-size-unit`, breakpoint, avoidXXL)}
				defaultUnit={getDefault(`${prefix}font-size-unit`, breakpoint)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}font-size-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(`${prefix}font-size`, breakpoint, avoidXXL)}
				defaultValue={getDefault(`${prefix}font-size`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}font-size`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}font-size-unit`]: getDefault(
								`${prefix}font-size-unit`
							),
							[`${prefix}font-size`]: getDefault(
								`${prefix}font-size`
							),
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%']}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__line-height'
				label={__('Line Height', 'maxi-blocks')}
				enableUnit
				unit={
					getValue(
						`${prefix}line-height-unit`,
						breakpoint,
						avoidXXL
					) || ''
				}
				defaultUnit={getDefault(
					`${prefix}line-height-unit`,
					breakpoint
				)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}line-height-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(`${prefix}line-height`, breakpoint, avoidXXL)}
				defaultValue={getDefault(`${prefix}line-height`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}line-height`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}line-height-unit`]: getDefault(
								`${prefix}line-height-unit`
							),
							[`${prefix}line-height`]: getDefault(
								`${prefix}line-height`
							),
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%', '-']}
			/>
			<AdvancedNumberControl
				className='maxi-typography-control__letter-spacing'
				label={__('Letter Spacing', 'maxi-blocks')}
				enableUnit
				allowedUnits={['px', 'em', 'vw']}
				unit={getValue(
					`${prefix}letter-spacing-unit`,
					breakpoint,
					avoidXXL
				)}
				defaultUnit={getDefault(
					`${prefix}letter-spacing-unit`,
					breakpoint
				)}
				onChangeUnit={val => {
					onChangeFormat(
						{
							[`${prefix}letter-spacing-unit`]: val,
						},
						breakpoint
					);
				}}
				value={getValue(
					`${prefix}letter-spacing`,
					breakpoint,
					avoidXXL
				)}
				defaultValue={getDefault(`${prefix}letter-spacing`, breakpoint)}
				onChangeValue={val => {
					onChangeFormat(
						{
							[`${prefix}letter-spacing`]: val,
						},
						breakpoint
					);
				}}
				onReset={() =>
					onChangeFormat(
						{
							[`${prefix}letter-spacing-unit`]: getDefault(
								`${prefix}letter-spacing-unit`
							),
							[`${prefix}letter-spacing`]: '',
						},
						breakpoint
					)
				}
				minMaxSettings={minMaxSettingsLetterSpacing}
				step={0.1}
			/>
		</>
	);
};

/**
 * TypographyControl
 */
const TypographyControl = withFormatValue(props => {
	const {
		blockName,
		onChange,
		breakpoint,
		isList,
		textLevel,
		formatValue,
		clientId,
		prefix = '',
		styleCards = false,
		disableFormats = false,
		isHover = false,
		styleCardPrefix,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...getGroupAttributes(props, 'typography') };

	const { styleCard, winWidth, maxiBreakpoints } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = wp.data.select(
			'maxiBlocks/style-cards'
		);
		const { receiveMaxiSettings, receiveMaxiBreakpoints } =
			wp.data.select('maxiBlocks');

		const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

		const winWidth = receiveMaxiSettings().window?.width || null;

		const maxiBreakpoints = receiveMaxiBreakpoints();

		return {
			styleCard,
			winWidth,
			maxiBreakpoints,
		};
	});

	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

	const getValue = (prop, customBreakpoint, avoidXXL) => {
		const currentBreakpoint = customBreakpoint || breakpoint;

		if (disableFormats)
			return getLastBreakpointAttribute(
				prop,
				currentBreakpoint,
				typography,
				isHover,
				false,
				avoidXXL
			);

		const blockStyle = getBlockStyle(clientId);

		const nonHoverValue = getCustomFormatValue({
			typography,
			formatValue,
			prop,
			breakpoint: currentBreakpoint,
			blockStyle,
			textLevel,
			styleCard,
			styleCardPrefix,
			avoidXXL,
		});

		if (!isHover) return nonHoverValue;

		return (
			getCustomFormatValue({
				typography,
				formatValue,
				prop,
				breakpoint: currentBreakpoint,
				isHover,
				blockStyle,
				textLevel,
				styleCard,
				styleCardPrefix,
			}) || nonHoverValue
		);
	};

	const onChangeFormat = value => {
		const obj = setFormat({
			formatValue,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value,
			breakpoint,
			textLevel,
		});

		onChange(obj);
	};

	const getWinBreakpoint = () => {
		if (!maxiBreakpoints || isEmpty(maxiBreakpoints)) return null;

		if (winWidth > maxiBreakpoints.xl) return 'xxl';

		const response = Object.entries(maxiBreakpoints).reduce(
			([prevKey, prevValue], [currKey, currValue]) => {
				if (!prevValue) return [prevKey];
				if (inRange(winWidth, prevValue, currValue + 1))
					return [currKey];

				return [prevKey, prevValue];
			}
		)[0];

		return response.toLowerCase();
	};

	const getDefault = (prop, customBreakpoint) => {
		const currentBreakpoint = customBreakpoint || breakpoint;
		const defaultAttribute = getDefaultAttribute(
			`${prop}-${currentBreakpoint}`,
			clientId
		);

		return defaultAttribute;
	};

	const showNotification = customBreakpoint => {
		if (breakpoint !== 'general')
			return breakpoint === customBreakpoint.toLowerCase();

		return getWinBreakpoint() === customBreakpoint.toLowerCase();
	};

	const getTextOptionsTab = () => {
		if (breakpoint !== 'general')
			return breakpoints.indexOf(breakpoint.toUpperCase());

		const userBreakpoint = getWinBreakpoint();

		if (!userBreakpoint) return null;

		return breakpoints.indexOf(userBreakpoint.toUpperCase());
	};

	const minMaxSettings = {
		px: {
			min: 0,
			max: 99,
		},
		em: {
			min: 0,
			max: 99,
		},
		vw: {
			min: 0,
			max: 99,
		},
		'%': {
			min: 0,
			max: 100,
		},
		'-': {
			min: 0,
			max: 16,
		},
	};

	const minMaxSettingsLetterSpacing = {
		px: {
			min: -3,
			max: 30,
		},
		em: {
			min: -1,
			max: 10,
		},
		vw: {
			min: -1,
			max: 10,
		},
	};

	return (
		<ToolbarPopover
			className='toolbar-item__typography-control'
			tooltip={__('Typography', 'maxi-blocks')}
			icon={toolbarType}
			advancedOptions='typography'
		>
			<div className='toolbar-item__popover__font-options'>
				<div className='toolbar-item__popover__font-options__font'>
					<FontFamilySelector
						className='toolbar-item__popover__font-options__font__selector'
						defaultValue={getDefaultAttribute(
							`font-family-${breakpoint}`
						)}
						font={getValue('font-family')}
						onChange={font => {
							onChangeFormat({
								'font-family': font.value,
							});
						}}
						theme='dark'
					/>
				</div>
				<>
					<SettingTabsControl
						className='toolbar-item__typography-control__typography-tabs'
						items={breakpoints.map(breakpoint => {
							return {
								label: breakpoint,
								content: (
									<TextOptions
										getValue={getValue}
										getDefault={getDefault}
										onChangeFormat={onChangeFormat}
										prefix={prefix}
										minMaxSettings={minMaxSettings}
										minMaxSettingsLetterSpacing={
											minMaxSettingsLetterSpacing
										}
										breakpoint={breakpoint.toLowerCase()}
										avoidXXL={!styleCards}
									/>
								),
								showNotification: showNotification(breakpoint),
								callback: () =>
									styleCards
										? setMaxiDeviceType(
												breakpoint.toLowerCase()
										  )
										: null,
							};
						})}
						forceTab={getTextOptionsTab()}
					/>
					<div className='toolbar-item__typography-control__extra-text-options'>
						<TextFormatOverline
							{...getGroupAttributes(props, 'typography')}
							formatValue={formatValue}
							onChange={obj => onChange(obj)}
							isList={isList}
							breakpoint={breakpoint}
							textLevel={textLevel}
							styleCard={styleCard}
						/>
						<TextFormatStrikethrough
							{...getGroupAttributes(props, 'typography')}
							formatValue={formatValue}
							onChange={obj => onChange(obj)}
							isList={isList}
							breakpoint={breakpoint}
							textLevel={textLevel}
							styleCard={styleCard}
						/>
						<TextFormatUnderline
							{...getGroupAttributes(props, 'typography')}
							formatValue={formatValue}
							onChange={obj => onChange(obj)}
							isList={isList}
							breakpoint={breakpoint}
							textLevel={textLevel}
							styleCard={styleCard}
						/>
						<TextFormatSubscript
							{...getGroupAttributes(props, 'typography')}
							formatValue={formatValue}
							onChange={obj => onChange(obj)}
							isList={isList}
							breakpoint={breakpoint}
							textLevel={textLevel}
							styleCard={styleCard}
						/>
						<TextFormatSuperscript
							{...getGroupAttributes(props, 'typography')}
							formatValue={formatValue}
							onChange={obj => onChange(obj)}
							isList={isList}
							breakpoint={breakpoint}
							textLevel={textLevel}
							styleCard={styleCard}
						/>
						<TextFormatCode
							onChange={content => onChange({ content })}
							isList={isList}
							formatValue={formatValue}
							textLevel={textLevel}
							styleCard={styleCard}
						/>
					</div>
				</>
			</div>
		</ToolbarPopover>
	);
});

export default TypographyControl;
