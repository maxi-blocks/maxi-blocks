/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OpacityControl from '../opacity-control';
import {
	getAttributeKey,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { opacity as opacityAttr } from '../../extensions/styles/defaults';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import ManageHoverTransitions from '../manage-hover-transitions';

/**
 * Component
 */
const opacity = ({ props, depth = 2 }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const hoverStatus = attributes['opacity-status-hover'];

	const normalOpacity = getLastBreakpointAttribute({
		target: 'opacity',
		breakpoint: deviceType,
		attributes: getGroupAttributes(attributes, 'opacity'),
	});

	return {
		label: __('Opacity', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<SettingTabsControl
					depth={depth}
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: (
								<OpacityControl
									opacity={normalOpacity}
									onChange={val =>
										maxiSetAttributes({
											[getAttributeKey(
												'opacity',
												false,
												'',
												deviceType
											)]: val,
										})
									}
								/>
							),
						},
						{
							label: __('Hover state', 'maxi-blocks'),
							content: (
								<>
									<ManageHoverTransitions />
									<ToggleSwitch
										label={__(
											'Enable opacity hover',
											'maxi-blocks'
										)}
										selected={hoverStatus}
										onChange={value =>
											maxiSetAttributes({
												'opacity-status-hover': value,
											})
										}
									/>
									{hoverStatus && (
										<OpacityControl
											opacity={
												getLastBreakpointAttribute({
													target: 'opacity',
													breakpoint: deviceType,
													attributes:
														getGroupAttributes(
															attributes,
															'opacityHover'
														),
													isHover: true,
												}) ?? normalOpacity
											}
											onChange={val =>
												maxiSetAttributes({
													[getAttributeKey(
														'opacity',
														true,
														'',
														deviceType
													)]: val,
												})
											}
											onReset={() => {
												maxiSetAttributes({
													[getAttributeKey(
														'opacity',
														true,
														'',
														deviceType
													)]: getLastBreakpointAttribute(
														{
															target: 'opacity',
															breakpoint:
																deviceType,
															attributes:
																getGroupAttributes(
																	attributes,
																	'opacity'
																),
														}
													),
												});
											}}
										/>
									)}
								</>
							),
						},
					]}
				/>
			</ResponsiveTabsControl>
		),
		extraIndicators: Object.keys(opacityAttr),
	};
};

export default opacity;
