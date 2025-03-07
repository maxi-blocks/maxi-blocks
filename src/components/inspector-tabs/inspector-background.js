/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import BackgroundControl from '@components/background-control';
import ToggleSwitch from '@components/toggle-switch';
import { getGroupAttributes } from '@extensions/styles';
import ManageHoverTransitions from '@components/manage-hover-transitions';

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
	enableActiveState = false,
	globalProps,
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
		getBounds,
	} = props;

	const {
		'hover-background-color-global': isActive,
		'hover-background-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus =
		attributes[`${prefix}background-status-hover`] || globalHoverStatus;
	const activeStatus = attributes[`${prefix}background-status-active`];

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
		getBounds,
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
									className={`maxi-background-status-hover-${prefix.replace(
										/-/g,
										''
									)}`}
									onChange={val =>
										maxiSetAttributes({
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
					enableActiveState && {
						label: 'Active state',
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable background active',
										'maxi-blocks'
									)}
									selected={activeStatus}
									className={`maxi-background-status-active-${prefix.replace(
										/-/g,
										''
									)}`}
									onChange={val =>
										maxiSetAttributes({
											[`${prefix}background-status-active`]:
												val,
										})
									}
								/>
								{activeStatus && (
									<BackgroundControl
										{...getGroupAttributes(
											attributes,
											[
												'background',
												'backgroundColor',
												'backgroundGradient',
											],
											false,
											`${prefix}active-`
										)}
										onChange={obj => {
											maxiSetAttributes(obj);
										}}
										{...backgroundControlBasicProps}
										prefix={`${prefix}active-`}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}background-status-active`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default background;
