/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ColorControl from '../color-control';
import DefaultStylesControl from '../default-styles-control';
import Icon from '../icon';
import SelectControl from '../select-control';
import ToggleSwitch from '../toggle-switch';
import withRTC from '../../extensions/maxi-block/withRTC';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';

/**
 * Icons
 */
import { styleNone, dashed, dotted, solid } from '../../icons';

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

	const {
		[`${prefix}line-orientation`]: lineOrientation,
		[`${prefix}divider-border-style`]: dividerBorderStyle,
		[`${prefix}divider-border-radius`]: dividerBorderRadius,
	} = getLastBreakpointAttribute({
		target: [
			'line-orientation',
			'divider-border-style',
			'divider-border-radius',
		],
		prefix,
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
					value={
						getLastBreakpointAttribute({
							target: 'divider-border-style',
							prefix,
							breakpoint,
							attributes: props,
							isHover,
						}) || 'none'
					}
					defaultValue={getDefaultAttribute(
						getAttributeKey(
							'divider-border-style',
							false,
							false,
							breakpoint
						)
					)}
					onReset={() =>
						onChange({
							[getAttributeKey(
								'divider-border-style',
								false,
								false,
								breakpoint
							)]: getDefaultAttribute(
								getAttributeKey(
									'divider-border-style',
									false,
									false,
									breakpoint
								)
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
						target: 'divider-border-color',
						prefix,
						breakpoint,
						attributes: props,
						isHover,
					})}
					deviceType={breakpoint}
					prefix='divider-border-'
					paletteColor={getLastBreakpointAttribute({
						target: 'divider-border-palette-color',
						prefix,
						breakpoint,
						attributes: props,
						isHover,
					})}
					paletteOpacity={getLastBreakpointAttribute({
						target: 'divider-border-palette-opacity',
						prefix,
						breakpoint,
						attributes: props,
						isHover,
					})}
					paletteStatus={getLastBreakpointAttribute({
						target: 'divider-border-palette-status',
						prefix,
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
								target: 'divider-width.u',
								prefix,
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
								target: 'divider-width',
								prefix,
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
							unit={getLastBreakpointAttribute({
								target: 'divider-border-top.u',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeUnit={val =>
								onChange({
									[getAttributeKey(
										'divider-border-top-unit',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							onChange={val =>
								onChange({
									[getAttributeKey(
										'divider-border-top',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							value={getLastBreakpointAttribute({
								target: 'divider-border-top',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeValue={val =>
								onChange({
									[getAttributeKey(
										'divider-border-top',
										isHover,
										prefix,
										breakpoint
									)]: val,
								})
							}
							onReset={() =>
								onChange({
									[getAttributeKey(
										'divider-border-top',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`divider-border-top-${breakpoint}`
									),
									[getAttributeKey(
										'divider-border-top-unit',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										`divider-border-top-unit-${breakpoint}`
									),
									isReset: true,
								})
							}
							minMaxSettings={minMaxSettings}
						/>
					</>
				)}
			{dividerBorderStyle !== 'none' &&
				(lineOrientation === 'vertical' ||
					lineOrientation === undefined) && (
					<>
						<AdvancedNumberControl
							label={__('Size', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'divider-height',
								prefix,
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
										getAttributeKey(
											'divider-height',
											false,
											false,
											breakpoint
										)
									),
									isReset: true,
								})
							}
							initialPosition={getDefaultAttribute(
								getAttributeKey(
									'divider-height',
									false,
									false,
									breakpoint
								)
							)}
						/>
						<AdvancedNumberControl
							label={__('Weight', 'maxi-blocks')}
							value={getLastBreakpointAttribute({
								target: 'divider-border-right',
								prefix,
								breakpoint,
								attributes: props,
								isHover,
							})}
							onChangeValue={val => {
								onChange({
									[getAttributeKey(
										'divider-border-right',
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
										'divider-border-right',
										isHover,
										prefix,
										breakpoint
									)]: getDefaultAttribute(
										getAttributeKey(
											'divider-border-right',
											false,
											false,
											breakpoint
										)
									),
									isReset: true,
								})
							}
							initialPosition={getDefaultAttribute(
								getAttributeKey(
									'divider-border-right',
									false,
									false,
									breakpoint
								)
							)}
						/>
					</>
				)}
		</>
	);
};

export default withRTC(DividerControl);
