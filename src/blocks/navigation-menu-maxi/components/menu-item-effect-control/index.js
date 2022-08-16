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
	getAttributeKey,
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
						[getAttributeKey('color', isHover, prefix)]: color,
						[getAttributeKey('palette-color', isHover, prefix)]:
							paletteColor,
						[getAttributeKey('palette-status', isHover, prefix)]:
							paletteStatus,
						[getAttributeKey('palette-opacity', isHover, prefix)]:
							paletteOpacity,
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
					isHover,
				})}
				value={getLastBreakpointAttribute({
					target: `${prefix}width`,
					breakpoint,
					attributes: props,
					isHover,
				})}
				onChangeValue={val =>
					onChange({
						[getAttributeKey('width', isHover, prefix, breakpoint)]:
							val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: `${prefix}width-unit`,
					breakpoint,
					attributes: props,
					isHover,
				})}
				minMaxSettings={{
					px: {
						min: 0,
						max: 999,
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
				}}
				onChangeUnit={val =>
					onChange({
						[getAttributeKey(
							'width-unit',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
				onReset={() => {
					onChange({
						[getAttributeKey('width', isHover, prefix, breakpoint)]:
							getDefaultAttribute(
								getAttributeKey(
									'width',
									isHover,
									prefix,
									breakpoint
								)
							),
						[getAttributeKey(
							'width-unit',
							isHover,
							prefix,
							breakpoint
						)]: getDefaultAttribute(
							getAttributeKey(
								'width-unit',
								isHover,
								prefix,
								breakpoint
							)
						),
					});
				}}
				optionType='string'
			/>
			<AdvancedNumberControl
				label={__('Thickness', 'maxi-blocks')}
				className='menu-item-effect-control__effect-thickness'
				placeholder={getLastBreakpointAttribute({
					target: `${prefix}thickness`,
					breakpoint,
					attributes: props,
					isHover,
				})}
				value={getLastBreakpointAttribute({
					target: `${prefix}thickness`,
					breakpoint,
					attributes: props,
					isHover,
				})}
				onChangeValue={val =>
					onChange({
						[getAttributeKey(
							'thickness',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: `${prefix}thickness-unit`,
					breakpoint,
					attributes: props,
					isHover,
				})}
				minMaxSettings={{
					px: {
						min: 0,
						max: 99,
					},
					em: {
						min: 0,
						max: 99,
					},
					vh: {
						min: 0,
						max: 99,
					},
					'%': {
						min: 0,
						max: 100,
					},
				}}
				onChangeUnit={val =>
					onChange({
						[getAttributeKey(
							'thickness-unit',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
				onReset={() => {
					onChange({
						[getAttributeKey(
							'thickness',
							isHover,
							prefix,
							breakpoint
						)]: getDefaultAttribute(
							getAttributeKey(
								'thickness',
								isHover,
								prefix,
								breakpoint
							)
						),
						[getAttributeKey(
							'thickness-unit',
							isHover,
							prefix,
							breakpoint
						)]: getDefaultAttribute(
							getAttributeKey(
								'thickness-unit',
								isHover,
								prefix,
								breakpoint
							)
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
