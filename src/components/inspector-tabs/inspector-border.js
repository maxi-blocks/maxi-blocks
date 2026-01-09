/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import BorderControl from '@components/border-control';
import ToggleSwitch from '@components/toggle-switch';
import { getAttributeKey, getGroupAttributes } from '@extensions/styles';
import ManageHoverTransitions from '@components/manage-hover-transitions';
/**
 * Component
 */
const border = ({
	props,
	prefix = '',
	globalProps,
	hoverGlobalProps,
	inlineTarget = '',
	enableActiveState = false,
}) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		scValues = {},
		depth = 2,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	const {
		'hover-border-color-global': isActive,
		'hover-border-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus =
		attributes[`${prefix}border-status-hover`] || globalHoverStatus;
	const activeStatus = attributes[`${prefix}border-status-active`];

	const finalInlineTarget =
		inlineTarget === ''
			? attributes[`${prefix}background-layers`] &&
			  attributes[`${prefix}background-layers`].length > 0
				? '.maxi-background-displayer'
				: ''
			: inlineTarget;
	const borderIndicatorProp = getAttributeKey(
		'border-style',
		false,
		prefix,
		deviceType
	);

	return {
		label: __('Border', 'maxi-blocks'),
		indicatorProps: [borderIndicatorProp],
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal', 'maxi-blocks'),
						content: (
							<BorderControl
								{...getGroupAttributes(
									attributes,
									['border', 'borderWidth', 'borderRadius'],
									false,
									prefix
								)}
								prefix={prefix}
								onChangeInline={obj =>
									insertInlineStyles({
										obj,
										target: finalInlineTarget,
									})
								}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles(finalInlineTarget);
								}}
								breakpoint={deviceType}
								clientId={clientId}
								globalProps={globalProps}
							/>
						),
					},
					{
						label: __('Hover', 'maxi-blocks'),
						content: (
							<>
								<ManageHoverTransitions />
								{!globalHoverStatus && (
									<ToggleSwitch
										label={__(
											'Enable border hover',
											'maxi-blocks'
										)}
										selected={hoverStatus}
										className='maxi-border-status-hover'
										onChange={val =>
											maxiSetAttributes({
												[`${prefix}border-status-hover`]:
													val,
											})
										}
									/>
								)}
								{hoverStatus && (
									<BorderControl
										{...getGroupAttributes(
											attributes,
											[
												'border',
												'borderWidth',
												'borderRadius',
											],
											true,
											prefix
										)}
										prefix={prefix}
										onChange={obj => maxiSetAttributes(obj)}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
										globalProps={hoverGlobalProps}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}border-status-hover`],
					},
					enableActiveState && {
						label: __('Active', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable border active',
										'maxi-blocks'
									)}
									selected={activeStatus}
									className='maxi-border-status-active'
									onChange={val =>
										maxiSetAttributes({
											[`${prefix}border-status-active`]:
												val,
										})
									}
								/>
								{activeStatus && (
									<BorderControl
										{...getGroupAttributes(
											attributes,
											[
												'border',
												'borderWidth',
												'borderRadius',
											],
											false,
											`${prefix}active-`
										)}
										prefix={`${prefix}active-`}
										onChange={obj => maxiSetAttributes(obj)}
										breakpoint={deviceType}
										clientId={clientId}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}border-status-active`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default border;
