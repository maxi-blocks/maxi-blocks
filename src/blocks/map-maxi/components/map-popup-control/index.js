/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AxisControl,
	BackgroundControl,
	BoxShadowControl,
	ColorControl,
	SettingTabsControl,
	ToggleSwitch,
} from '../../../../components';
import PresetsControl from '../presets-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	setHoverAttributes,
} from '../../../../extensions/styles';

/**
 * Icons
 */
import * as mapPopups from '../../../../icons/map-icons/popups';

const MapPopupControl = props => {
	const { onChange, clientId, deviceType, ...attributes } = props;
	const prefix = 'popup-';
	const hoverStatus = attributes[`${prefix}box-shadow-status-hover`];

	return (
		<>
			<div className='maxi-map-popup-control'>
				<PresetsControl
					items={mapPopups}
					onChange={mapPopup => {
						onChange({
							'map-popup': mapPopup,
						});
					}}
					prop={attributes['map-popup']}
				/>
			</div>
			<BackgroundControl
				{...getGroupAttributes(
					attributes,
					['background', 'backgroundColor'],
					false,
					prefix
				)}
				prefix={prefix}
				onChange={obj => onChange(obj)}
				disableNoneStyle
				disableImage
				disableGradient
				disableVideo
				disableSVG
				disableClipPath
				clientId={clientId}
				breakpoint={deviceType}
			/>
			<ColorControl
				label={__('Border', 'maxi-blocks')}
				color={getLastBreakpointAttribute({
					target: `${prefix}border-color`,
					breakpoint: deviceType,
					attributes,
				})}
				prefix={`${prefix}border-`}
				useBreakpointForDefault
				paletteStatus={getLastBreakpointAttribute({
					target: `${prefix}border-palette-status`,
					breakpoint: deviceType,
					attributes,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: `${prefix}border-palette-color`,
					breakpoint: deviceType,
					attributes,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: `${prefix}border-palette-opacity`,
					breakpoint: deviceType,
					attributes,
				})}
				onChange={({
					paletteColor,
					paletteStatus,
					paletteOpacity,
					color,
				}) => {
					onChange({
						[`${prefix}border-palette-status-${deviceType}`]:
							paletteStatus,
						[`${prefix}border-palette-color-${deviceType}`]:
							paletteColor,
						[`${prefix}border-palette-opacity-${deviceType}`]:
							paletteOpacity,
						[`${prefix}border-color-${deviceType}`]: color,
					});
				}}
				disableImage
				disableVideo
				disableGradient
				deviceType={deviceType}
				clientId={clientId}
			/>
			<AxisControl
				{...getGroupAttributes(
					attributes,
					'borderWidth',
					false,
					prefix
				)}
				target={`${prefix}border`}
				auxTarget='width'
				label={__('Border width', 'maxi-blocks')}
				onChange={obj => onChange(obj)}
				breakpoint={deviceType}
				allowedUnits={['px', 'em', 'vw']}
				minMaxSettings={{
					px: {
						min: 0,
						max: 20,
					},
					em: {
						min: 0,
						max: 4,
						step: 0.1,
					},
					vw: {
						min: 0,
						max: 3,
						step: 0.1,
					},
				}}
				disableAuto
			/>
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<BoxShadowControl
								{...getGroupAttributes(
									attributes,
									'boxShadow',
									false,
									prefix
								)}
								prefix={prefix}
								onChange={obj => onChange(obj)}
								breakpoint={deviceType}
								clientId={clientId}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Box Shadow Hover',
										'maxi-blocks'
									)}
									selected={hoverStatus}
									className='maxi-box-shadow-status-hover'
									onChange={val =>
										onChange({
											...(val &&
												setHoverAttributes(
													{
														...getGroupAttributes(
															attributes,
															'boxShadow',
															false,
															prefix
														),
													},
													{
														...getGroupAttributes(
															attributes,
															'boxShadow',
															true,
															prefix
														),
													}
												)),
											[`${prefix}box-shadow-status-hover`]:
												val,
										})
									}
								/>
								{hoverStatus && (
									<BoxShadowControl
										{...getGroupAttributes(
											attributes,
											'boxShadow',
											true,
											prefix
										)}
										prefix={prefix}
										onChange={obj => onChange(obj)}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}box-shadow-status-hover`],
					},
				]}
			/>
		</>
	);
};

export default MapPopupControl;
