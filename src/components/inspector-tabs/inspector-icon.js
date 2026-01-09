/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import IconControl from '@components/icon-control';
import ToggleSwitch from '@components/toggle-switch';
import SettingTabsControl from '@components/setting-tabs-control';
import { getGroupAttributes, getIconWithColor } from '@extensions/styles';
import ManageHoverTransitions from '@components/manage-hover-transitions';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const icon = ({
	props,
	label = __('Icon', 'maxi-blocks'),
	type,
	depth = 2,
	disableBackground = false,
	disableBorder = false,
	disableIconInherit = false,
	disableIconOnly = false,
	disablePadding = false,
	disablePosition = false,
	disableSpacing = false,
	disableHeightFitContent = false,
	disablePositionY = false,
	inlineTarget = '.maxi-button-block__icon',
	prefix = '',
	ignoreIndicator = [],
}) => {
	const { attributes, deviceType } = props;
	const { [`${prefix}icon-content`]: iconContent } = attributes;
	if (deviceType !== 'general' && isEmpty(iconContent)) return null;

	const {
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
		clientId,
	} = props;
	const {
		[`${prefix}icon-status-hover`]: hoverStatus,
		[`${prefix}icon-status-hover-target`]: hoverStatusTarget,
		blockStyle,
		[`${prefix}svgType`]: svgType,
		ariaLabels,
	} = attributes;

	const iconControlBasicProps = {
		svgType,
		breakpoint: deviceType,
		clientId,
		blockStyle,
		disableBackground,
		disableBorder,
		disableIconInherit,
		disableIconOnly,
		disablePadding,
		disablePosition,
		disableSpacing,
		disableHeightFitContent,
		disablePositionY,
		type,
		prefix,
		getIconWithColor: args => getIconWithColor(attributes, args, prefix),
		ariaLabels,
	};

	const groupAttributes = [
		'icon',
		'iconHover',
		'iconBackgroundGradient',
		'iconBackgroundColor',
		'iconBorder',
		'iconBackgroundHover',
		'iconBorderWidth',
		'iconBorderRadius',
		'iconPadding',
	];
	const normalIndicatorProps = Object.keys(
		getGroupAttributes(attributes, groupAttributes, false, prefix)
	);
	const hoverIndicatorProps = Object.keys(
		getGroupAttributes(attributes, groupAttributes, true, prefix)
	).filter(key => !normalIndicatorProps.includes(key));

	return {
		label,
		content: (
			<SettingTabsControl
				hasMarginBottom
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						indicatorProps: normalIndicatorProps,
						content: (
							<IconControl
								{...getGroupAttributes(
									attributes,
									groupAttributes,
									false,
									prefix
								)}
								onChangeInline={(
									obj,
									target,
									isMultiplySelector = false
								) =>
									insertInlineStyles({
										obj,
										target,
										isMultiplySelector,
									})
								}
								onChange={(obj, target) => {
									maxiSetAttributes(obj);
									cleanInlineStyles(target);
								}}
								inlineTarget={inlineTarget}
								{...iconControlBasicProps}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						indicatorProps: hoverStatus ? hoverIndicatorProps : [],
						extraIndicators: hoverStatus
							? [
									`${prefix}icon-status-hover`,
									`${prefix}icon-status-hover-target`,
							  ]
							: [],
						content: (
							<>
								<ManageHoverTransitions />
								<ToggleSwitch
									label={__(
										'Enable Icon Hover',
										'maxi-blocks'
									)}
									selected={hoverStatus}
									onChange={val =>
										maxiSetAttributes({
											[`${prefix}icon-status-hover`]: val,
										})
									}
								/>
								{hoverStatus && (
									<>
										<ToggleSwitch
											label={__(
												'Switch hover target to canvas',
												'maxi-blocks'
											)}
											selected={!hoverStatusTarget}
											onChange={val =>
												maxiSetAttributes({
													[`${prefix}icon-status-hover-target`]:
														!val,
												})
											}
										/>
										<IconControl
											{...getGroupAttributes(
												attributes,
												groupAttributes,
												true,
												prefix
											)}
											onChange={obj => {
												maxiSetAttributes(obj);
											}}
											isHover
											{...iconControlBasicProps}
										/>
									</>
								)}
							</>
						),
					},
				]}
				depth={depth}
			/>
		),
		ignoreIndicator,
	};
};

export default icon;
