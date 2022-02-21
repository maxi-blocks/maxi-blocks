/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import BackgroundControl from '../background-control';
import ToggleSwitch from '../toggle-switch';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';

/**
 * Component
 */
const background = ({
	label = '',
	props,
	prefix = '',
	disableImage = false,
	disableVideo = false,
	disableGradient = false,
	disableColor = false,
	disableSVG = false,
	disableClipPath = false,
	globalProps,
	hoverGlobalProps,
	groupAttributes = ['background', 'backgroundColor', 'backgroundGradient'],
	depth = 2,
}) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		scValues = {},
	} = props;

	const {
		'hover-background-color-global': isActive,
		'hover-background-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus =
		attributes[`${prefix}background-hover-status`] || globalHoverStatus;

	return {
		label: __(`${label} background`, 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<>
								<BackgroundControl
									{...getGroupAttributes(
										attributes,
										groupAttributes,
										false,
										prefix
									)}
									prefix={prefix}
									onChange={obj => maxiSetAttributes(obj)}
									disableColor={disableColor}
									disableImage={disableImage}
									disableGradient={disableGradient}
									disableVideo={disableVideo}
									disableSVG={disableSVG}
									disableClipPath={disableClipPath}
									clientId={clientId}
									breakpoint={deviceType}
									globalProps={globalProps}
								/>
							</>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable background hover',
										'maxi-blocks'
									)}
									selected={hoverStatus}
									className='maxi-background-status-hover'
									onChange={val =>
										maxiSetAttributes({
											...(val &&
												setHoverAttributes(
													{
														...getGroupAttributes(
															attributes,
															[
																'background',
																'backgroundColor',
																'backgroundGradient',
															],
															false,
															prefix
														),
													},
													{
														...getGroupAttributes(
															attributes,
															[
																'background',
																'backgroundColor',
																'backgroundGradient',
															],
															true,
															prefix
														),
													}
												)),
											[`${prefix}background-hover-status`]:
												val,
										})
									}
								/>
								{hoverStatus && (
									<BackgroundControl
										{...getGroupAttributes(
											attributes,
											[
												'background',
												'backgroundColor',
												'backgroundGradient',
											],
											true,
											prefix
										)}
										prefix={prefix}
										onChange={obj => maxiSetAttributes(obj)}
										disableImage
										disableVideo
										disableClipPath
										disableSVG
										isHover
										clientId={clientId}
										breakpoint={deviceType}
										globalProps={hoverGlobalProps}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}background-hover-status`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default background;
