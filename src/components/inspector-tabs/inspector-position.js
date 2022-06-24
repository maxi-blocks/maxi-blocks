/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PositionControl from '../position-control';
import { getGroupAttributes } from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';

/**
 * Component
 */
const position = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Position', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<SettingTabsControl
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: (
								<PositionControl
									{...getGroupAttributes(
										attributes,
										'position'
									)}
									onChange={obj => maxiSetAttributes(obj)}
									breakpoint={deviceType}
								/>
							),
						},
						{
							label: __('Hover state', 'maxi-blocks'),
							content: (
								<>
									<ToggleSwitch
										label={__(
											'Enable position hover',
											'maxi-blocks'
										)}
										selected={
											attributes['position-status-hover']
										}
										onChange={val =>
											maxiSetAttributes({
												'position-status-hover': val,
											})
										}
									/>
									{attributes['position-status-hover'] && (
										<PositionControl
											{...getGroupAttributes(
												attributes,
												'position'
											)}
											onChange={obj =>
												maxiSetAttributes(obj)
											}
											breakpoint={deviceType}
											isHover
										/>
									)}
								</>
							),
						},
					]}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default position;
