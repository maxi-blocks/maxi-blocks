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
import {
	getAttributeKey,
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import ManageHoverTransitions from '../manage-hover-transitions';

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
	depth = 2,
	inlineTarget = '.maxi-text-block__content',
	prefix = '',
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
	const [blockStyle, textLevel, isList, typographyHoverStatus] =
		getAttributesValue({
			target: ['_bs', '_tl', '_ili', `${prefix}t.sh`],
			props: attributes,
		});

	const { 'h_col.g': isActive, 'h_col.a': affectAll } = scValues;
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
									typographyTarget,
									false,
									prefix
								)}
								onChangeInline={(
									obj,
									target,
									isMultiplySelector
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
								hideAlignment={hideAlignment}
								breakpoint={deviceType}
								clientId={clientId}
								disableCustomFormats={disableCustomFormats}
								blockStyle={blockStyle}
								styleCardPrefix={styleCardPrefix}
								textLevel={textLevel}
								inlineTarget={inlineTarget}
								isList={isList}
								allowLink={allowLink}
								globalProps={globalProps}
								prefix={prefix}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ManageHoverTransitions />
								{!globalHoverStatus && (
									<ToggleSwitch
										label={__(
											'Enable typography hover',
											'maxi-blocks'
										)}
										selected={hoverStatus}
										onChange={val =>
											maxiSetAttributes({
												[getAttributeKey({
													key: 't.sh',
													prefix,
												})]: val,
											})
										}
									/>
								)}
								{hoverStatus && (
									<TypographyControl
										{...getGroupAttributes(
											attributes,
											'typography',
											true,
											prefix
										)}
										onChange={obj => maxiSetAttributes(obj)}
										hideAlignment={hideAlignment}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
										disableCustomFormats={
											disableCustomFormats
										}
										blockStyle={blockStyle}
										styleCardPrefix={styleCardPrefix}
										isList={isList}
										globalProps={hoverGlobalProps}
										prefix={prefix}
									/>
								)}
							</>
						),
						extraIndicators: ['typography-status-hover'],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default typography;
