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
}) => {
	const { attributes, clientId, deviceType, setAttributes } = props;
	const { parentBlockStyle, textLevel, isList } = attributes;

	const bgHoverStatus = attributes['typography-status-hover'];
	const typographyTarget = allowLink ? ['typography', 'link'] : 'typography';

	return {
		label: __('Typography', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal', 'maxi-blocks'),
						content: (
							<TypographyControl
								{...getGroupAttributes(
									attributes,
									typographyTarget
								)}
								onChange={obj => setAttributes(obj)}
								hideAlignment={hideAlignment}
								breakpoint={deviceType}
								clientId={clientId}
								disableCustomFormats={disableCustomFormats}
								blockStyle={parentBlockStyle}
								styleCardPrefix={styleCardPrefix}
								textLevel={textLevel}
								isList={isList}
								allowLink={allowLink}
							/>
						),
					},
					{
						label: __('Hover', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Typography Hover',
										'maxi-blocks'
									)}
									selected={bgHoverStatus}
									onChange={val =>
										setAttributes({
											'typography-status-hover': val,
										})
									}
								/>
								{bgHoverStatus && (
									<TypographyControl
										{...getGroupAttributes(
											attributes,
											'typography',
											true
										)}
										onChange={obj => setAttributes(obj)}
										hideAlignment={hideAlignment}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
										disableCustomFormats={
											disableCustomFormats
										}
										blockStyle={parentBlockStyle}
										styleCardPrefix={styleCardPrefix}
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

export default typography;
