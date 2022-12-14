/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import BorderControl from '../border-control';
import ToggleSwitch from '../toggle-switch';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';
import ManageHoverTransitions from '../manage-hover-transitions';
/**
 * Component
 */
const border = ({
	props,
	prefix = '',
	globalProps,
	hoverGlobalProps,
	inlineTarget = '',
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

	const finalInlineTarget =
		inlineTarget === ''
			? attributes[`${prefix}background-layers`] &&
			  attributes[`${prefix}background-layers`].length > 0
				? '.maxi-background-displayer'
				: ''
			: inlineTarget;

	return {
		label: __('Border', 'maxi-blocks'),
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
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
						label: __('Hover state', 'maxi-blocks'),
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
												...(val &&
													setHoverAttributes(
														{
															...getGroupAttributes(
																attributes,
																[
																	'border',
																	'borderWidth',
																	'borderRadius',
																],
																false,
																prefix
															),
														},
														{
															...getGroupAttributes(
																attributes,
																[
																	'border',
																	'borderWidth',
																	'borderRadius',
																],
																true,
																prefix
															),
														}
													)),
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
				]}
				depth={depth}
			/>
		),
	};
};

export default border;
