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
	getAttributeKey,
	getAttributesValue,
	getGroupAttributes,
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
		'background-status-hover': backgroundStatusHover,
		'background-status-active': backgroundStatusActive,
	} = getAttributesValue({
		target: ['background-status-hover', 'background-status-active'],
		props: attributes,
		prefix,
	});

	const {
		'hover-background-color-global': isActive,
		'hover-background-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus = backgroundStatusHover || globalHoverStatus;

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
									className='maxi-background-status-hover'
									onChange={val =>
										maxiSetAttributes({
											[getAttributeKey(
												'background-status-hover',
												false,
												prefix
											)]: val,
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
						extraIndicators: [
							getAttributeKey(
								'background-status-hover',
								false,
								prefix
							),
						],
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
									selected={backgroundStatusActive}
									className='maxi-background-status-active'
									onChange={val =>
										maxiSetAttributes({
											[getAttributeKey(
												'background-status-active',
												false,
												prefix
											)]: val,
										})
									}
								/>
								{backgroundStatusActive && (
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
						extraIndicators: [
							getAttributeKey(
								'background-status-active',
								false,
								prefix
							),
						],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default background;
