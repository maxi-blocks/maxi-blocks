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
import getActiveAttributes from '../../extensions/active-indicators';

/**
 * Component
 */
const border = ({ props, prefix = '', globalProps, hoverGlobalProps }) => {
	const {
		attributes,
		clientId,
		deviceType,
		setAttributes,
		scValues = {},
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
			<SettingTabsControl
				activeTabs={getActiveAttributes(
					{
						...getGroupAttributes(
							attributes,
							['border', 'borderWidth', 'borderRadius'],
							false,
							prefix
						),
						...getGroupAttributes(
							attributes,
							['border', 'borderWidth', 'borderRadius'],
							true,
							prefix
						),
					},
					'border'
				)}
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<BorderControl
								{...getGroupAttributes(
									attributes,
									['border', 'borderWidth', 'borderRadius'],
									false,
									prefix
								)}
								prefix={prefix}
								onChange={obj => {
									setAttributes(obj);
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
											setAttributes({
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
										onChange={obj => setAttributes(obj)}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
										globalProps={hoverGlobalProps}
									/>
								)}
							</>
						),
					},
				]}
			/>
		),
	};
};

export default border;
