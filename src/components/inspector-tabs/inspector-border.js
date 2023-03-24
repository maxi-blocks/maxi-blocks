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
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
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
		'border-status-hover': borderStatusHover,
		'border-status-active': borderStatusActive,
		'background-layers': backgroundLayers,
	} = getAttributesValue({
		target: [
			'border-status-hover',
			'border-status-active',
			'background-layers',
		],
		props: attributes,
	});

	const {
		'hover-border-color-global': isActive,
		'hover-border-color-all': affectAll,
	} = scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus = borderStatusHover || globalHoverStatus;

	const finalInlineTarget =
		inlineTarget === ''
			? backgroundLayers && backgroundLayers.length > 0
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
						label: __('Active state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable border active',
										'maxi-blocks'
									)}
									selected={borderStatusActive}
									className='maxi-border-status-active'
									onChange={val =>
										maxiSetAttributes({
											[`${prefix}border-status-active`]:
												val,
										})
									}
								/>
								{borderStatusActive && (
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
