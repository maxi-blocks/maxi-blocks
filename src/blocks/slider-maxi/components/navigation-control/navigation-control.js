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
		prefix = 'navigation-arrow-both-icon-',
	} = props;
	const hoverStatus = getAttributesValue({
		target: `${prefix}status-hover`,
		props,
	});

	const getSvgType = prefix => {
		switch (prefix) {
			case 'navigation-arrow-both-icon-':
				return getAttributesValue({
					target: 'navigation-arrow-first-svgType',
					props,
				}) ===
					getAttributesValue({
						target: 'navigation-arrow-second-svgType',
					})
					? getAttributesValue({
							target: 'navigation-arrow-first-svgType',
					  })
					: 'Filled';
			case 'navigation-dot-icon-':
			default:
				return getAttributesValue({
					target: 'navigation-dot-svgType',
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
										[`${prefix}status-hover`]: val,
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
				prefix.includes('dot') && {
					label: __('Active state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__(
									'Enable active icon state',
									'maxi-blocks'
								)}
								selected={getAttributesValue({
									target: 'active-navigation-dot-icon-status',
									props,
								})}
								onChange={val =>
									onChange({
										'active-navigation-dot-icon-status':
											val,
									})
								}
							/>
							{getAttributesValue({
								target: 'active-navigation-dot-icon-status',
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
