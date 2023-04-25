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
	const [boxShadowStatusHover, boxShadowStatusActive] = getAttributesValue({
		target: ['bs.sh', 'bs.sa'],
		props: attributes,
		prefix,
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
											[`${prefix}bs.sh`]: val,
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
						extraIndicators: [`${prefix}bs.sh`],
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
											[`${prefix}bs.sa`]: val,
										})
									}
								/>
								{boxShadowStatusActive && (
									<BoxShadowControl
										{...getGroupAttributes(
											attributes,
											'boxShadow',
											false,
											`${prefix}a-`
										)}
										prefix={`${prefix}a-`}
										onChange={obj => maxiSetAttributes(obj)}
										breakpoint={deviceType}
										clientId={clientId}
										dropShadow={dropShadow}
										disableInset={disableInset}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}bs.sa`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default boxShadow;
