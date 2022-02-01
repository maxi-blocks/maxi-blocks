/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import TypographyControl from '../typography-control';
import ToggleSwitch from '../toggle-switch';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const typography = ({
	props,
	styleCardPrefix = '',
	hideAlignment = false,
	disableCustomFormats = false,
	allowLink = false,
	globalProps,
	hoverGlobalProps,
}) => {
	const {
		attributes,
		clientId,
		deviceType,
		handleSetAttributes,
		scValues = {},
	} = props;
	const {
		parentBlockStyle,
		textLevel,
		isList,
		'typography-status-hover': typographyHoverStatus,
	} = attributes;

	const { 'hover-color-global': isActive, 'hover-color-all': affectAll } =
		scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus = typographyHoverStatus || globalHoverStatus;

	const typographyTarget = allowLink ? ['typography', 'link'] : 'typography';

	return {
		label: __('Typography', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<TypographyControl
								{...getGroupAttributes(
									attributes,
									typographyTarget
								)}
								onChange={obj => handleSetAttributes(obj)}
								hideAlignment={hideAlignment}
								breakpoint={deviceType}
								clientId={clientId}
								disableCustomFormats={disableCustomFormats}
								blockStyle={parentBlockStyle}
								styleCardPrefix={styleCardPrefix}
								textLevel={textLevel}
								isList={isList}
								allowLink={allowLink}
								globalProps={globalProps}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								{!globalHoverStatus && (
									<ToggleSwitch
										label={__(
											'Enable Typography Hover',
											'maxi-blocks'
										)}
										selected={hoverStatus}
										onChange={val =>
											handleSetAttributes({
												'typography-status-hover': val,
											})
										}
									/>
								)}
								{hoverStatus && (
									<TypographyControl
										{...getGroupAttributes(
											attributes,
											'typography',
											true
										)}
										onChange={obj =>
											handleSetAttributes(obj)
										}
										hideAlignment={hideAlignment}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
										disableCustomFormats={
											disableCustomFormats
										}
										blockStyle={parentBlockStyle}
										styleCardPrefix={styleCardPrefix}
										globalProps={hoverGlobalProps}
									/>
								)}
							</>
						),
						extraIndicators: ['typography-status-hover'],
					},
				]}
			/>
		),
	};
};

export default typography;
