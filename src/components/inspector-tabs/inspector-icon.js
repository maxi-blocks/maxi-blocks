/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import IconControl from '../icon-control';
import ToggleSwitch from '../toggle-switch';
import SettingTabsControl from '../setting-tabs-control';
import { getGroupAttributes, getIconWithColor } from '../../extensions/styles';
import ManageHoverTransitions from '../manage-hover-transitions';

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
		blockStyle,
		[`${prefix}svgType`]: svgType,
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

	return {
		label,
		content: (
			<SettingTabsControl
				hasMarginBottom
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
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
