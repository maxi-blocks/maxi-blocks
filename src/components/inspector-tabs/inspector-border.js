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

/**
 * Component
 */
const border = ({ props, prefix }) => {
	const { attributes, clientId, deviceType, setAttributes } = props;

	const hoverStatus = attributes[`${prefix}border-status-hover`];

	return {
		label: __('Border', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal', 'maxi-blocks'),
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
								isButton
							/>
						),
					},
					{
						label: __('Hover', 'maxi-blocks'),
						content: (
							<>
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
										isButton
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
