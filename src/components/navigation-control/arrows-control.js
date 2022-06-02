/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	IconControl,
	SettingTabsControl,
	ToggleSwitch,
	ResponsiveTabsControl,
} from '../../components';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import ArrowIconControl from './arrow-icon-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

const NavigationArrowsControl = props => {
	const {
		onChange,
		deviceType,
		attributes,
		insertInlineStyles,
		cleanInlineStyles,
		svgType,
		clientId,
		blockStyle,
	} = props;

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: (
						<ArrowIconControl
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
								onChange(obj);
								cleanInlineStyles(target);
							}}
							svgType={svgType}
							breakpoint={deviceType}
							clientId={clientId}
							blockStyle={blockStyle}
						/>
					),
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__('Enable Icon Hover', 'maxi-blocks')}
								selected={attributes['icon-status-hover']}
								onChange={val =>
									onChange({
										'icon-status-hover': val,
									})
								}
							/>
							{attributes['icon-status-hover'] && (
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
										onChange(obj);
									}}
									svgType={svgType}
									breakpoint={deviceType}
									clientId={clientId}
									blockStyle={blockStyle}
									isHover
								/>
							)}
						</>
					),
				},
			]}
		/>
	);
};

export default NavigationArrowsControl;
