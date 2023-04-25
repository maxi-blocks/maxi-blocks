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
	const [borderStatusHover, borderStatusActive, backgroundLayers] =
		getAttributesValue({
			target: ['bo.sh', 'bo.sa', 'b_ly'],
			props: attributes,
			prefix,
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
												[`${prefix}bo.sh`]: val,
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
						extraIndicators: [`${prefix}bo.sh`],
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
											[`${prefix}bo.sa`]: val,
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
											`${prefix}a-`
										)}
										prefix={`${prefix}a-`}
										onChange={obj => maxiSetAttributes(obj)}
										breakpoint={deviceType}
										clientId={clientId}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}bo.sa`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default border;
