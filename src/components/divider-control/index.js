/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ColorControl from '@components/color-control';
import DefaultStylesControl from '@components/default-styles-control';
import Icon from '@components/icon';
import SelectControl from '@components/select-control';
import ToggleSwitch from '@components/toggle-switch';
import withRTC from '@extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '@maxi-icons';

/**
 * Component
 */
export const DefaultDividersControl = props => {
	const { onChange, breakpoint, dividerBorderStyle, isHover, prefix } = props;

	const onChangeStyle = newStyle => {
		onChange({
			[getAttributeKey(
				'divider-border-style',
				isHover,
				prefix,
				breakpoint
			)]: newStyle,
		});
	};

	return (
		<DefaultStylesControl
			items={[
				{
					activeItem: dividerBorderStyle === 'none',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={styleNone}
						/>
					),
					onChange: () => onChangeStyle('none'),
				},
				{
					activeItem: dividerBorderStyle === 'solid',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={solid}
						/>
					),
					onChange: () => onChangeStyle('solid'),
				},
				{
					activeItem: dividerBorderStyle === 'dashed',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={dashed}
						/>
					),
					onChange: () => onChangeStyle('dashed'),
				},
				{
					activeItem: dividerBorderStyle === 'dotted',
					content: (
						<Icon
							className='maxi-default-styles-control__button__icon'
							icon={dotted}
						/>
					),
					onChange: () => onChangeStyle('dotted'),
				},
			]}
		/>
	);
};

const DividerControl = props => {
	const {
		onChangeInline,
		onChange,
		isHover = false,
		disableLineStyle = false,
		disableBorderRadius = false,
		clientId,
		breakpoint,
		prefix = '',
	} = props;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 100,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const lineOrientation = getLastBreakpointAttribute({
		target: `${prefix}line-orientation`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const dividerBorderStyle = getLastBreakpointAttribute({
		target: `${prefix}divider-border-style`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const dividerBorderRadius = getLastBreakpointAttribute({
		target: `${prefix}divider-border-radius`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const handleLineWeightChange = val => {
		// Sync both horizontal and vertical line weights
		onChange({
			[getAttributeKey(
				'divider-border-top-width',
				isHover,
				prefix,
				breakpoint
			)]: val,
			[getAttributeKey(
				'divider-border-right-width',
				isHover,
				prefix,
				breakpoint
			)]: val,
		});
	};

	const handleLineWeightUnitChange = val => {
		// Sync both horizontal and vertical line weight units
		onChange({
			[getAttributeKey(
				'divider-border-top-unit',
				isHover,
				prefix,
				breakpoint
			)]: val,
			[getAttributeKey(
				'divider-border-right-unit',
				isHover,
				prefix,
				breakpoint
			)]: val,
		});
	};

	const handleLineWeightReset = () => {
		const defaultWidth = getDefaultAttribute(
			`divider-border-top-width-${breakpoint}`
		);
		const defaultUnit = getDefaultAttribute(
			`divider-border-top-unit-${breakpoint}`
		);

		onChange({
			[getAttributeKey(
				'divider-border-top-width',
				isHover,
				prefix,
				breakpoint
			)]: defaultWidth,
			[getAttributeKey(
				'divider-border-right-width',
				isHover,
				prefix,
				breakpoint
			)]: defaultWidth,
			[getAttributeKey(
				'divider-border-top-unit',
				isHover,
				prefix,
				breakpoint
			)]: defaultUnit,
			[getAttributeKey(
				'divider-border-right-unit',
				isHover,
				prefix,
				breakpoint
			)]: defaultUnit,
			isReset: true,
		});
	};

	// Get the current line weight value based on orientation
	const currentLineWeight = getLastBreakpointAttribute({
		target:
			lineOrientation === 'vertical'
				? `${prefix}divider-border-right-width`
				: `${prefix}divider-border-top-width`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const currentLineWeightUnit = getLastBreakpointAttribute({
		target:
			lineOrientation === 'vertical'
				? `${prefix}divider-border-right-unit`
				: `${prefix}divider-border-top-unit`,
		breakpoint,
		attributes: props,
		isHover,
	});

	return (
		<>
			<DefaultDividersControl
				lineOrientation={lineOrientation}
				onChange={onChange}
				breakpoint={breakpoint}
				dividerBorderStyle={dividerBorderStyle}
				isHover={isHover}
				prefix={prefix}
			/>
			{!disableLineStyle && (
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Add border line', 'maxi-blocks')}
					options={[
						{ label: __('None', 'maxi-blocks'), value: 'none' },
						{
							label: __('Dotted', 'maxi-blocks'),
							value: 'dotted',
						},
						{
							label: __('Dashed', 'maxi-blocks'),
							value: 'dashed',
						},
						{
							label: __('Solid', 'maxi-blocks'),
							value: 'solid',
						},
						{
							label: __('Double', 'maxi-blocks'),
							value: 'double',
						},
					]}
					newStyle
					value={
						getLastBreakpointAttribute({
							target: `${prefix}divider-border-style`,
							breakpoint,
							attributes: props,
							isHover,
						}) || 'none'
					}
					defaultValue={getDefaultAttribute(
						`${prefix}divider-border-style-${breakpoint}`
					)}
					onReset={() =>
						onChange({
							[`${prefix}divider-border-style-${breakpoint}`]:
								getDefaultAttribute(
									`${prefix}divider-border-style-${breakpoint}`
								),
							isReset: true,
						})
					}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'divider-border-style',
								isHover,
								prefix,
								breakpoint
							)]: val,
						})
					}
				/>
			)}
			{dividerBorderStyle !== 'none' &&
				!disableBorderRadius &&
				dividerBorderStyle === 'solid' && (
					<ToggleSwitch
						label={__('Line radius', 'maxi-blocks')}
						selected={dividerBorderRadius}
						onChange={val =>
							onChange({
								[getAttributeKey(
									'divider-border-radius',
									isHover,
									prefix,
									breakpoint
								)]: val,
							})
						}
					/>
				)}
			{dividerBorderStyle !== 'none' && (
				<ColorControl
					label={__('Divider', 'maxi-blocks')}
					color={getLastBreakpointAttribute({
						target: `${prefix}divider-border-color`,
						breakpoint,
						attributes: props,
						isHover,
					})}
					deviceType={breakpoint}
					prefix='divider-border-'
					paletteColor={getLastBreakpointAttribute({
						target: `${prefix}divider-border-palette-color`,
						breakpoint,
						attributes: props,
						isHover,
					})}
					paletteOpacity={getLastBreakpointAttribute({
						target: `${prefix}divider-border-palette-opacity`,
						breakpoint,
						attributes: props,
						isHover,
					})}
					paletteStatus={getLastBreakpointAttribute({
						target: `${prefix}divider-border-palette-status`,
						breakpoint,
						attributes: props,
						isHover,
					})}
					paletteSCStatus={getLastBreakpointAttribute({
						target: `${prefix}divider-border-palette-sc-status`,
						breakpoint,
						attributes: props,
						isHover,
					})}
					onChangeInline={({ color }) =>
						!isHover && onChangeInline({ 'border-color': color })
					}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteSCStatus,
						paletteOpacity,
					}) =>
						onChange({
							[getAttributeKey(
								'divider-border-color',
								isHover,
								prefix,
								breakpoint
							)]: color,
							[getAttributeKey(
								'divider-border-palette-color',
								isHover,
								prefix,
								breakpoint
							)]: paletteColor,
							[getAttributeKey(
								'divider-border-palette-status',
								isHover,
								prefix,
								breakpoint
							)]: paletteStatus,
							[getAttributeKey(
								'divider-border-palette-sc-status',
								isHover,
								prefix,
								breakpoint
							)]: paletteSCStatus,
							[getAttributeKey(
								'divider-border-palette-opacity',
								isHover,
								prefix,
								breakpoint
							)]: paletteOpacity,
						})
					}
					disableGradient
					globalProps={{ target: '', type: 'divider' }}
					isHover={isHover}
					clientId={clientId}
				/>
			)}
			{dividerBorderStyle !== 'none' &&
				(lineOrientation === 'horizontal' ||
					lineOrientation === undefined) && (
					<>
						<AdvancedNumberControl
							label={__('Line size', 'maxi-blocks')}
							enableUnit
							unit={getLastBreakpointAttribute({
								target: `${prefix}divider-width-unit`,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeUnit={val =>
								onChange({
									[getAttributeKey(
										'divider-width-unit',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: `${prefix}divider-width`,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeValue={val =>
								onChange({
									[getAttributeKey(
										'divider-width',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							onReset={() =>
								onChange({
									[getAttributeKey(
										'divider-width',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`divider-width-${breakpoint}`
									),
									[getAttributeKey(
										'divider-width-unit',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`divider-width-unit-${breakpoint}`
									),
									isReset: true,
								})
							}
							minMaxSettings={minMaxSettings}
						/>
						<AdvancedNumberControl
							label={__('Line weight', 'maxi-blocks')}
							enableUnit
							allowedUnits={['px', 'em', 'vw']}
							unit={currentLineWeightUnit}
							onChangeUnit={handleLineWeightUnitChange}
							value={currentLineWeight}
							onChangeValue={handleLineWeightChange}
							onReset={handleLineWeightReset}
							minMaxSettings={minMaxSettings}
						/>
					</>
				)}
			{dividerBorderStyle !== 'none' &&
				(lineOrientation === 'vertical' ||
					lineOrientation === undefined) && (
					<>
						<AdvancedNumberControl
							label={__('Line size', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: `${prefix}divider-height`,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeValue={val => {
								onChange({
									[getAttributeKey(
										'divider-height',
										isHover,
										prefix,
										breakpoint
									)]:
										val !== undefined && val !== ''
											? val
											: '',
								});
							}}
							min={0}
							max={100}
							onReset={() =>
								onChange({
									[getAttributeKey(
										'divider-height',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`divider-height-${breakpoint}`
									),
									isReset: true,
								})
							}
							initialPosition={getDefaultAttribute(
								`divider-height-${breakpoint}`
							)}
						/>
						<AdvancedNumberControl
							label={__('Line weight', 'maxi-blocks')}
							enableUnit
							allowedUnits={['px', 'em', 'vw']}
							unit={currentLineWeightUnit}
							onChangeUnit={handleLineWeightUnitChange}
							value={currentLineWeight}
							onChangeValue={handleLineWeightChange}
							onReset={handleLineWeightReset}
							minMaxSettings={minMaxSettings}
						/>
					</>
				)}
		</>
	);
};

export default withRTC(DividerControl);
