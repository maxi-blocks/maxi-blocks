/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OpacityControl from '../opacity-control';
import {
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import { opacity as opacityAttr } from '../../extensions/attributes/defaults';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import ManageHoverTransitions from '../manage-hover-transitions';

/**
 * Component
 */
const opacity = ({ props, depth = 2 }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const opacityHoverStatus = getAttributesValue({
		target: 'opacity-status',
		props: attributes,
		isHover: true,
	});

	const normalOpacity = getLastBreakpointAttribute({
		target: 'opacity',
		breakpoint: deviceType,
		attributes: getGroupAttributes(attributes, 'opacity'),
	});

	return {
		label: __('Opacity', 'maxi-blocks'),
		content: (
			<SettingTabsControl
				depth={depth}
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<OpacityControl
								opacity={normalOpacity}
								onChange={maxiSetAttributes}
								breakpoint={deviceType}
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
									selected={opacityHoverStatus}
									onChange={value =>
										maxiSetAttributes({
											'opacity-status-hover': value,
										})
									}
								/>
								{opacityHoverStatus && (
									<OpacityControl
										opacity={
											getLastBreakpointAttribute({
												target: 'opacity',
												breakpoint: deviceType,
												attributes: getGroupAttributes(
													attributes,
													'opacityHover'
												),
												isHover: true,
											}) ?? normalOpacity
										}
										onChange={maxiSetAttributes}
										breakpoint={deviceType}
										isHover
									/>
								)}
							</>
						),
					},
				]}
			/>
		),
		extraIndicators: Object.keys(opacityAttr),
	};
};

export default opacity;
