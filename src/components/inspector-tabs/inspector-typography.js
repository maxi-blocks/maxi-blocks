/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import TypographyControl from '@components/typography-control';
import ToggleSwitch from '@components/toggle-switch';
import { getGroupAttributes } from '@extensions/styles';
import ManageHoverTransitions from '@components/manage-hover-transitions';

/**
 * Component
 */
const typography = ({
	props,
	styleCardPrefix = '',
	hideAlignment = false,
	showBottomGap = false,
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
		setShowLoader,
	} = props;
	const {
		blockStyle,
		textLevel,
		isList,
		[`${prefix}typography-status-hover`]: typographyHoverStatus,
	} = attributes;

	const { 'hover-color-global': isActive, 'hover-color-all': affectAll } =
		scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus = typographyHoverStatus || globalHoverStatus;

	const typographyTarget = allowLink ? ['typography', 'link'] : 'typography';

	// Generate text alignment attribute names if alignment is shown
	const textAlignmentAttributes = [];
	if (!hideAlignment) {
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		breakpoints.forEach(bp => {
			textAlignmentAttributes.push(`${prefix}text-alignment-${bp}`);
			textAlignmentAttributes.push(`${prefix}text-alignment-${bp}-hover`);
		});
	}

	// Get RTL setting to determine the correct default text alignment
	const { getEditorSettings } = select('core/editor');
	const isRTL = getEditorSettings()?.isRTL || false;

	// Text alignment default depends on RTL: 'left' for LTR, 'right' for RTL
	const textAlignmentDefaultValue = isRTL ? 'right' : 'left';

	// Check if text alignment has non-default values
	const hasNonDefaultTextAlignment =
		!hideAlignment &&
		textAlignmentAttributes.some(attr => {
			const value = attributes[attr];
			// If undefined/null, it's default
			if (value === undefined || value === null) return false;
			// If set to default value, it's default
			if (value === textAlignmentDefaultValue) return false;
			// Otherwise it's non-default
			return true;
		});

	return {
		label: __('Typography', 'maxi-blocks'),
		disablePadding: true,
		...(!hideAlignment &&
			hasNonDefaultTextAlignment === false && {
				ignoreIndicator: textAlignmentAttributes,
			}),
		...(allowLink && {
			ignoreIndicatorGroups: ['link'],
		}),
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
								setShowLoader={setShowLoader}
								hideAlignment={hideAlignment}
								showBottomGap={showBottomGap}
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
												[`${prefix}typography-status-hover`]:
													val,
											})
										}
									/>
								)}
								{hoverStatus && (
									<TypographyControl
										{...getGroupAttributes(
											attributes,
											typographyTarget,
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
										allowLink={allowLink}
										globalProps={hoverGlobalProps}
										textLevel={textLevel}
										prefix={prefix}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}typography-status-hover`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default typography;
