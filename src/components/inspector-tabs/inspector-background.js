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
import { getIgnoreIndicator } from '../../extensions/indicators';
import ManageHoverTransitions from '../manage-hover-transitions';

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
	inlineTarget = '',
}) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		scValues = {},
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	const {
		'hover-background-color-global': isActive,
		'hover-background-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus =
		attributes[`${prefix}background-hover-status`] || globalHoverStatus;

	const ignoreIndicator = getIgnoreIndicator({
		attributes,
		ignoreGroupAttributes: groupAttributes,
		prefix,
		target: 'background-active-media',
		valueToCompare: 'none',
	});
	const ignoreIndicatorHover = getIgnoreIndicator({
		attributes,
		ignoreGroupAttributes: groupAttributes,
		isHover: true,
		prefix,
		target: 'background-active-media',
		valueToCompare: 'none',
	});

	return {
		label: __(`${label} background`, 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<BackgroundControl
								{...getGroupAttributes(
									attributes,
									groupAttributes,
									false,
									prefix
								)}
								prefix={prefix}
								onChangeInline={obj => {
									insertInlineStyles({
										obj,
										target: inlineTarget,
									});
								}}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles(inlineTarget);
								}}
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
						),
						ignoreIndicator,
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ManageHoverTransitions />

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
										onChange={obj => {
											maxiSetAttributes(obj);
										}}
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
						ignoreIndicator: ignoreIndicatorHover,
					},
				]}
				depth={depth}
			/>
		),
		ignoreIndicator: [...ignoreIndicator, ...ignoreIndicatorHover],
	};
};

export default background;
