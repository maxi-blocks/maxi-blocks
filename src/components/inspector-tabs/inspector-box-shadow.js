/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import BoxShadowControl from '../box-shadow-control';
import ToggleSwitch from '../toggle-switch';
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import ManageHoverTransitions from '../manage-hover-transitions';

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
	const {
		'box-shadow-status-hover': boxShadowStatusHover,
		'box-shadow-status-active': boxShadowStatusActive,
	} = getAttributesValue({
		target: ['box-shadow-status-hover', 'box-shadow-status-active'],
		props: attributes,
	});

	return {
		label: __('Box shadow', 'maxi-blocks'),
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
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
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ManageHoverTransitions />
								<ToggleSwitch
									label={__(
										'Enable box shadow hover',
										'maxi-blocks'
									)}
									selected={boxShadowStatusHover}
									className='maxi-box-shadow-status-hover'
									onChange={val =>
										maxiSetAttributes({
											[`${prefix}box-shadow-status-hover`]:
												val,
										})
									}
								/>

								{boxShadowStatusHover && (
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
						label: __('Active state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable box shadow active',
										'maxi-blocks'
									)}
									selected={boxShadowStatusActive}
									className='maxi-box-shadow-status-active'
									onChange={val =>
										maxiSetAttributes({
											[`${prefix}box-shadow-status-active`]:
												val,
										})
									}
								/>
								{boxShadowStatusActive && (
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
