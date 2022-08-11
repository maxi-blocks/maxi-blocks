/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	SelectControl,
	ToggleSwitch,
	ColorControl,
	AdvancedNumberControl,
	SettingTabsControl,
} from '../../../../components';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

const EffectControl = props => {
	const { onChange, clientId, prefix, isHover = false, breakpoint } = props;

	return (
		<>
			<ColorControl
				label={__('Effect', 'maxi-blocks')}
				className='menu-item-effect-control__effect-colour'
				color={getLastBreakpointAttribute({
					target: `${prefix}color`,
					props,
					isHover,
				})}
				prefix={prefix}
				paletteColor={getLastBreakpointAttribute({
					target: `${prefix}palette-color`,
					props,
					isHover,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: `${prefix}palette-opacity`,
					props,
					isHover,
				})}
				paletteStatus={getLastBreakpointAttribute({
					target: `${prefix}palette-status`,
					props,
					isHover,
				})}
				onChangeInline={({ color }) =>
					// insertInlineStyles({
					// 	obj: { color },
					// 	target: ' .maxi-search-block__input',
					// 	pseudoElement: '::after',
					// })
					null
				}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) => {
					onChange({
						[`${prefix}color`]: color,
						[`${prefix}palette-color`]: paletteColor,
						[`${prefix}palette-status`]: paletteStatus,
						[`${prefix}palette-opacity`]: paletteOpacity,
					});
					// cleanInlineStyles(
					// 	' .maxi-search-block__input',
					// 	'::${prefix}'
					// );
				}}
				clientId={clientId}
				disableGradient
			/>
			<AdvancedNumberControl
				label={__('Width', 'maxi-blocks')}
				className='menu-item-effect-control__effect-width'
				placeholder={getLastBreakpointAttribute({
					target: `${prefix}width`,
					breakpoint,
					attributes: props,
				})}
				value={getLastBreakpointAttribute({
					target: `${prefix}width`,
					breakpoint,
					attributes: props,
				})}
				onChangeValue={val =>
					onChange({
						[`${prefix}width-${breakpoint}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: `${prefix}width-unit`,
					breakpoint,
					attributes: props,
				})}
				minMaxSettings={{
					px: {
						min: -999,
						max: 999,
					},
					em: {
						min: -99,
						max: 99,
					},
					vw: {
						min: -99,
						max: 99,
					},
					'%': {
						min: -100,
						max: 100,
					},
				}}
				onChangeUnit={val =>
					onChange({
						[`${prefix}width-unit-${breakpoint}`]: val,
					})
				}
				onReset={() => {
					onChange({
						[`${prefix}width-${breakpoint}`]: getDefaultAttribute(
							`${prefix}width-${breakpoint}`
						),
						[`${prefix}width-unit-${breakpoint}`]:
							getDefaultAttribute(
								`${prefix}width-unit-${breakpoint}`
							),
					});
				}}
				optionType='string'
			/>
			<AdvancedNumberControl
				label={__('Thickness', 'maxi-blocks')}
				className='menu-item-effect-control__effect-thickness'
				placeholder={getLastBreakpointAttribute({
					target: `${prefix}height`,
					breakpoint,
					attributes: props,
				})}
				value={getLastBreakpointAttribute({
					target: `${prefix}height`,
					breakpoint,
					attributes: props,
				})}
				onChangeValue={val =>
					onChange({
						[`${prefix}height-${breakpoint}`]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: `${prefix}height-unit`,
					breakpoint,
					attributes: props,
				})}
				minMaxSettings={{
					px: {
						min: -999,
						max: 999,
					},
					em: {
						min: -99,
						max: 99,
					},
					vw: {
						min: -99,
						max: 99,
					},
					'%': {
						min: -100,
						max: 100,
					},
				}}
				onChangeUnit={val =>
					onChange({
						[`${prefix}height-unit-${breakpoint}`]: val,
					})
				}
				onReset={() => {
					onChange({
						[`${prefix}height-${breakpoint}`]: getDefaultAttribute(
							`${prefix}height-${breakpoint}`
						),
						[`${prefix}height-unit-${breakpoint}`]:
							getDefaultAttribute(
								`${prefix}height-unit-${breakpoint}`
							),
					});
				}}
				optionType='string'
			/>
		</>
	);
};

const MenuItemEffectControl = props => {
	const { onChange } = props;

	const prefix = 'effect-';

	return (
		<>
			<SelectControl
				label={__('Effect type', 'maxi-blocks')}
				className='menu-item-effect-control__effect-type'
				value={props[`${prefix}type`]}
				options={[
					{
						label: __('None', 'maxi-blocks'),
						value: 'none',
					},
					{
						label: __('Underline', 'maxi-blocks'),
						value: 'underline',
					},
					{
						label: __('Overline', 'maxi-blocks'),
						value: 'overline',
					},
					{
						label: __('Double Line', 'maxi-blocks'),
						value: 'doubleLine',
					},
					{
						label: __('Boxed', 'maxi-blocks'),
						value: 'boxed',
					},
					{
						label: __('Solid background', 'maxi-blocks'),
						value: 'solidBackground',
					},
					{
						label: __('Bold text', 'maxi-blocks'),
						value: 'boldText',
					},
				]}
				onChange={val =>
					onChange({
						[`${prefix}type`]: val,
					})
				}
			/>
			<SelectControl
				label={__('Hover animation', 'maxi-blocks')}
				className='menu-item-effect-control__hover-animation'
				value={props[`${prefix}animation`]}
				options={[
					{
						label: __('None', 'maxi-blocks'),
						value: 'none',
					},
					{
						label: __('Fade', 'maxi-blocks'),
						value: 'fade',
					},
					{
						label: __('Slide', 'maxi-blocks'),
						value: 'slide',
					},
					{
						label: __('Grow', 'maxi-blocks'),
						value: 'grow',
					},
				]}
				onChange={val =>
					onChange({
						[`${prefix}animation`]: val,
					})
				}
			/>
			<SelectControl
				label={__('Direction', 'maxi-blocks')}
				className='menu-item-effect-control__direction'
				value={props[`${prefix}animation`]}
				options={[
					{
						label: __('None', 'maxi-blocks'),
						value: 'none',
					},
					{
						label: __('Fade', 'maxi-blocks'),
						value: 'fade',
					},
					{
						label: __('Slide', 'maxi-blocks'),
						value: 'slide',
					},
					{
						label: __('Grow', 'maxi-blocks'),
						value: 'grow',
					},
				]}
				onChange={val =>
					onChange({
						[`${prefix}animation`]: val,
					})
				}
			/>
			<SettingTabsControl
				depth={2}
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: <EffectControl {...props} prefix={prefix} />,
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable hover', 'maxi-blocks')}
									selected={props[`${prefix}status-hover`]}
									onChange={val =>
										onChange({
											[`${prefix}status-hover`]: val,
										})
									}
								/>
								{props[`${prefix}status-hover`] && (
									<EffectControl
										isHover
										{...props}
										prefix={prefix}
									/>
								)}
							</>
						),
					},
					{
						label: __('Active state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable active', 'maxi-blocks')}
									selected={props[`${prefix}status-active`]}
									onChange={val =>
										onChange({
											[`${prefix}status-active`]: val,
										})
									}
								/>
								{props[`${prefix}status-active`] && (
									<EffectControl
										{...props}
										prefix={`active-${prefix}`}
									/>
								)}
							</>
						),
					},
				]}
			/>
		</>
	);
};

export default MenuItemEffectControl;
