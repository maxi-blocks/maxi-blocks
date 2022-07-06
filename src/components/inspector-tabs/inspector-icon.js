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

const icon = ({ props, depth = 2, prefix }) => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
		clientId,
	} = props;
	const {
		'icon-status-hover': hoverStatus,
		blockStyle,
		svgType,
	} = attributes;

	const iconControlBasicProps = {
		svgType,
		breakpoint: deviceType,
		clientId,
		blockStyle,
		getIconWithColor: args => getIconWithColor(attributes, args),
	};

	return {
		label: __('Icon', 'maxi-blocks'),
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<IconControl
								{...getGroupAttributes(attributes, [
									'icon',
									'iconBackground',
									'iconBackgroundGradient',
									'iconBackgroundColor',
									'iconBorder',
									'iconBorderWidth',
									'iconBorderRadius',
									'iconPadding',
								])}
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
								{...iconControlBasicProps}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Icon Hover',
										'maxi-blocks'
									)}
									selected={hoverStatus}
									onChange={val =>
										maxiSetAttributes({
											'icon-status-hover': val,
										})
									}
								/>
								{hoverStatus && (
									<IconControl
										{...getGroupAttributes(
											attributes,
											[
												'icon',
												'iconHover',
												'iconBackgroundGradient',
												'iconBackgroundColor',
												'iconBorder',
												'iconBackgroundHover',
												'iconBorderWidth',
												'iconBorderRadius',
											],
											true
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
			/>
		),
	};
};

export default icon;
