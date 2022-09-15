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
import ManageHoverTransitions from '../manage-hover-transitions';

/**
 * Component
 */
const background = ({
	label = '',
	props,
	prefix = '',
	disableClipPath = false,
	disableColor = false,
	disableGradient = false,
	disableImage = false,
	disableNoneStyle = false,
	disableSVG = false,
	disableVideo = false,
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
		attributes[`${prefix}background-status-hover`] || globalHoverStatus;

	const backgroundControlBasicProps = {
		prefix,
		disableClipPath,
		disableColor,
		disableGradient,
		disableImage,
		disableNoneStyle,
		disableSVG,
		disableVideo,
		clientId,
		breakpoint: deviceType,
		globalProps,
	};

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
								{...backgroundControlBasicProps}
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
											[`${prefix}background-status-hover`]:
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
										onChange={obj => {
											maxiSetAttributes(obj);
										}}
										isHover
										{...backgroundControlBasicProps}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}background-status-hover`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default background;
