/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import BorderControl from '../border-control';
import ToggleSwitch from '../toggle-switch';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * Component
 */
const border = ({ props, prefix = '', globalProps, hoverGlobalProps }) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		scValues = {},
		depth = 2,
	} = props;

	const {
		'hover-border-color-global': isActive,
		'hover-border-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus =
		attributes[`${prefix}border-status-hover`] || globalHoverStatus;

	return {
		label: __('Border', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<SettingTabsControl
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: (
								<BorderControl
									{...getGroupAttributes(
										attributes,
										[
											'border',
											'borderWidth',
											'borderRadius',
										],
										false,
										prefix
									)}
									prefix={prefix}
									onChange={obj => {
										maxiSetAttributes(obj);
									}}
									breakpoint={deviceType}
									clientId={clientId}
									globalProps={globalProps}
								/>
							),
						},
						{
							label: __('Hover state', 'maxi-blocks'),
							content: (
								<>
									{!globalHoverStatus && (
										<ToggleSwitch
											label={__(
												'Enable Border Hover',
												'maxi-blocks'
											)}
											selected={hoverStatus}
											className='maxi-border-status-hover'
											onChange={val =>
												maxiSetAttributes({
													...(val &&
														setHoverAttributes(
															{
																...getGroupAttributes(
																	attributes,
																	[
																		'border',
																		'borderWidth',
																		'borderRadius',
																	],
																	false,
																	prefix
																),
															},
															{
																...getGroupAttributes(
																	attributes,
																	[
																		'border',
																		'borderWidth',
																		'borderRadius',
																	],
																	true,
																	prefix
																),
															}
														)),
													[`${prefix}border-status-hover`]:
														val,
												})
											}
										/>
									)}
									{hoverStatus && (
										<BorderControl
											{...getGroupAttributes(
												attributes,
												[
													'border',
													'borderWidth',
													'borderRadius',
												],
												true,
												prefix
											)}
											prefix={prefix}
											onChange={obj =>
												maxiSetAttributes(obj)
											}
											breakpoint={deviceType}
											isHover
											clientId={clientId}
											globalProps={hoverGlobalProps}
										/>
									)}
								</>
							),
							extraIndicators: [`${prefix}border-status-hover`],
						},
					]}
					depth={depth}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default border;
