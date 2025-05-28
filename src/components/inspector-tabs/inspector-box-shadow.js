/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import BoxShadowControl from '@components/box-shadow-control';
import ToggleSwitch from '@components/toggle-switch';
import { getGroupAttributes } from '@extensions/styles';
import ManageHoverTransitions from '@components/manage-hover-transitions';

/**
 * Component
 */
const boxShadow = ({
	props,
	prefix = '',
	depth = 2,
	inlineTarget = '',
	dropShadow,
	enableActiveState = false,
	disableInset,
}) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	const hoverStatus = attributes[`${prefix}box-shadow-status-hover`];
	const activeStatus = attributes[`${prefix}box-shadow-status-active`];

	return {
		label: __('Box shadow', 'maxi-blocks'),
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal', 'maxi-blocks'),
						content: (
							<BoxShadowControl
								{...getGroupAttributes(
									attributes,
									'boxShadow',
									false,
									prefix
								)}
								prefix={prefix}
								onChangeInline={obj =>
									insertInlineStyles({
										obj,
										target: inlineTarget,
									})
								}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles(inlineTarget);
								}}
								breakpoint={deviceType}
								clientId={clientId}
								dropShadow={dropShadow}
								disableInset={disableInset}
							/>
						),
					},
					{
						label: __('Hover', 'maxi-blocks'),
						content: (
							<>
								<ManageHoverTransitions />
								<ToggleSwitch
									label={__(
										'Enable box shadow hover',
										'maxi-blocks'
									)}
									selected={hoverStatus}
									className='maxi-box-shadow-status-hover'
									onChange={val =>
										maxiSetAttributes({
											[`${prefix}box-shadow-status-hover`]:
												val,
										})
									}
								/>

								{hoverStatus && (
									<BoxShadowControl
										{...getGroupAttributes(
											attributes,
											'boxShadow',
											true,
											prefix
										)}
										prefix={prefix}
										onChange={obj => maxiSetAttributes(obj)}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
										dropShadow={dropShadow}
										disableInset={disableInset}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}box-shadow-status-hover`],
					},
					enableActiveState && {
						label: __('Active', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable box shadow active',
										'maxi-blocks'
									)}
									selected={activeStatus}
									className='maxi-box-shadow-status-active'
									onChange={val =>
										maxiSetAttributes({
											[`${prefix}box-shadow-status-active`]:
												val,
										})
									}
								/>
								{activeStatus && (
									<BoxShadowControl
										{...getGroupAttributes(
											attributes,
											'boxShadow',
											false,
											`${prefix}active-`
										)}
										prefix={`${prefix}active-`}
										onChange={obj => maxiSetAttributes(obj)}
										breakpoint={deviceType}
										clientId={clientId}
										dropShadow={dropShadow}
										disableInset={disableInset}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}box-shadow-status-active`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default boxShadow;
