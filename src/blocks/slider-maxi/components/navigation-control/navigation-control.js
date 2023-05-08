/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingTabsControl, ToggleSwitch } from '../../../../components';
import NavigationIconControl from './navigation-icon-control';
import { getAttributesValue } from '../../../../extensions/attributes';

const NavigationIconsControl = props => {
	const {
		onChange,
		deviceType,
		insertInlineStyles,
		cleanInlineStyles,
		normalInlineTarget,
		activeInlineTarget,
		clientId,
		blockStyle,
		prefix = 'nab-i-',
	} = props;
	const hoverStatus = getAttributesValue({
		target: `${prefix}.sh`,
		props,
	});

	const getSvgType = prefix => {
		switch (prefix) {
			case 'nab-i-':
				return getAttributesValue({
					target: 'naf_st',
					props,
				}) ===
					getAttributesValue({
						target: 'nas_st',
						props,
					})
					? getAttributesValue({
							target: 'naf_st',
							props,
					  })
					: 'Filled';
			case 'nd-i-':
			default:
				return getAttributesValue({
					target: 'nd_st',
					props,
				});
		}
	};
	const svgType = getSvgType(prefix);

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: (
						<NavigationIconControl
							{...props}
							onChangeInline={(
								obj,
								target,
								isMultiplySelector = false
							) =>
								insertInlineStyles({
									obj,
									target: `${normalInlineTarget} ${target}`,
									isMultiplySelector,
								})
							}
							onChange={(obj, target) => {
								onChange(obj);
								cleanInlineStyles(
									`${normalInlineTarget} ${target}`
								);
							}}
							svgType={svgType}
							breakpoint={deviceType}
							clientId={clientId}
							blockStyle={blockStyle}
							prefix={prefix}
						/>
					),
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__('Enable icon hover', 'maxi-blocks')}
								selected={hoverStatus}
								onChange={val =>
									onChange({
										[`${prefix}.sh`]: val,
									})
								}
							/>
							{hoverStatus && (
								<NavigationIconControl
									{...props}
									onChange={(obj, target) => {
										onChange(obj);
									}}
									svgType={svgType}
									breakpoint={deviceType}
									clientId={clientId}
									blockStyle={blockStyle}
									prefix={prefix}
									isHover
								/>
							)}
						</>
					),
				},
				prefix.includes('d') && {
					label: __('Active state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__(
									'Enable active icon state',
									'maxi-blocks'
								)}
								selected={getAttributesValue({
									target: 'a-nd-i.s',
									props,
								})}
								onChange={val =>
									onChange({
										'a-nd-i.s': val,
									})
								}
							/>
							{getAttributesValue({
								target: 'a-nd-i.s',
								props,
							}) && (
								<NavigationIconControl
									{...props}
									onChangeInline={(
										obj,
										target,
										isMultiplySelector = false
									) =>
										insertInlineStyles({
											obj,
											target: `${activeInlineTarget} ${target}`,
											isMultiplySelector,
										})
									}
									onChange={(obj, target) => {
										onChange(obj);
										cleanInlineStyles(
											`${activeInlineTarget} ${target}`
										);
									}}
									svgType={svgType}
									breakpoint={deviceType}
									clientId={clientId}
									blockStyle={blockStyle}
									prefix='a-nd-i-'
									longPrefix='active-navigation-dot-icon'
								/>
							)}
						</>
					),
				},
			]}
		/>
	);
};

export default NavigationIconsControl;
