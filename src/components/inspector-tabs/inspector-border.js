/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
// import BorderControl from '@components/border-control';
import ToggleSwitch from '@components/toggle-switch';
import { getGroupAttributes } from '@extensions/styles';
import ManageHoverTransitions from '@components/manage-hover-transitions';
import ContentLoader from '@components/content-loader';

const BorderControl = lazy(() =>
	import(/* webpackChunkName: "maxi-border-control" */ '@components/border-control')
);

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

	return {
		label: __('Border', 'maxi-blocks'),
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal', 'maxi-blocks'),
						content: (
							<Suspense fallback={<ContentLoader />}>
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
							</Suspense>
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
									<Suspense fallback={<ContentLoader />}>
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
									</Suspense>
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
									<Suspense fallback={<ContentLoader />}>
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
									</Suspense>
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
