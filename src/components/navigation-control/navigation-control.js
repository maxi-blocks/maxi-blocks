/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingTabsControl, ToggleSwitch } from '../../components';
import NavigationIconControl from './navigation-icon-control';

const NavigationIconsControl = props => {
	const {
		onChange,
		deviceType,
		insertInlineStyles,
		cleanInlineStyles,
		clientId,
		blockStyle,
		prefix = 'navigation-arrow-both-icon',
	} = props;

	let svgType = 'Filled';

	if (prefix === 'navigation-arrow-both-icon')
		svgType =
			props['navigation-arrow-first-svgType'] ===
			props['navigation-arrow-second-svgType']
				? props['navigation-arrow-first-svgType']
				: 'Filed';

	if (prefix === 'navigation-dot-icon')
		svgType = props['navigation-dot-svgType'];

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
									target,
									isMultiplySelector,
								})
							}
							onChange={(obj, target) => {
								onChange(obj);
								cleanInlineStyles(target);
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
								selected={props[`${prefix}-status-hover`]}
								onChange={val =>
									onChange({
										[`${prefix}-status-hover`]: val,
									})
								}
							/>
							{props[`${prefix}-status-hover`] && (
								<NavigationIconControl
									{...props}
									onChangeInline={(
										obj,
										target,
										isMultiplySelector = false
									) =>
										insertInlineStyles({
											obj,
											target,
											isMultiplySelector,
										})
									}
									onChange={(obj, target) => {
										onChange(obj);
										cleanInlineStyles(target);
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
									props['navigation-active-dot-icon-status']
								}
								onChange={val =>
									onChange({
										'navigation-active-dot-icon-status':
											val,
									})
								}
							/>
							{props['navigation-active-dot-icon-status'] && (
								<NavigationIconControl
									{...props}
									onChangeInline={(
										obj,
										target,
										isMultiplySelector = false
									) =>
										insertInlineStyles({
											obj,
											target,
											isMultiplySelector,
										})
									}
									onChange={(obj, target) => {
										onChange(obj);
										cleanInlineStyles(target);
									}}
									svgType={svgType}
									breakpoint={deviceType}
									clientId={clientId}
									blockStyle={blockStyle}
									prefix='navigation-active-dot-icon'
									isHover={false}
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
