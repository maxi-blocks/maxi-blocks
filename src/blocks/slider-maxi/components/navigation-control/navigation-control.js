/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const ToggleSwitch = loadable(() =>
	import('../../../../components/toggle-switch')
);
const SettingTabsControl = loadable(() =>
	import('../../../../components/setting-tabs-control')
);
const NavigationIconControl = loadable(() =>
	import('./navigation-icon-control')
);

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
		prefix = 'navigation-arrow-both-icon-',
	} = props;

	const getSvgType = prefix => {
		switch (prefix) {
			case 'navigation-arrow-both-icon-':
				return props['navigation-arrow-first-svgType'] ===
					props['navigation-arrow-second-svgType']
					? props['navigation-arrow-first-svgType']
					: 'Filled';
			case 'navigation-dot-icon-':
			default:
				return props['navigation-dot-svgType'];
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
								selected={props[`${prefix}status-hover`]}
								onChange={val =>
									onChange({
										[`${prefix}status-hover`]: val,
									})
								}
							/>
							{props[`${prefix}status-hover`] && (
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
				prefix.includes('dot') && {
					label: __('Active state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__(
									'Enable active icon state',
									'maxi-blocks'
								)}
								selected={
									props['active-navigation-dot-icon-status']
								}
								onChange={val =>
									onChange({
										'active-navigation-dot-icon-status':
											val,
									})
								}
							/>
							{props['active-navigation-dot-icon-status'] && (
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
									prefix='active-navigation-dot-icon-'
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
