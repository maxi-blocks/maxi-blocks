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
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';

/**
 * Component
 */
const boxShadow = ({ props, prefix = '', depth = 2, inlineTarget = '' }) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	const hoverStatus = attributes[`${prefix}box-shadow-status-hover`];

	return {
		label: __('Box shadow', 'maxi-blocks'),
		disablePadding: true,
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
									insertInlineStyles(obj, inlineTarget)
								}
								onChange={obj => {
									maxiSetAttributes(obj);
									cleanInlineStyles(inlineTarget);
								}}
								breakpoint={deviceType}
								clientId={clientId}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Box Shadow Hover',
										'maxi-blocks'
									)}
									selected={hoverStatus}
									className='maxi-box-shadow-status-hover'
									onChange={val =>
										maxiSetAttributes({
											...(val &&
												setHoverAttributes(
													{
														...getGroupAttributes(
															attributes,
															'boxShadow',
															false,
															prefix
														),
													},
													{
														...getGroupAttributes(
															attributes,
															'boxShadow',
															true,
															prefix
														),
													}
												)),
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
										onChangeInline={obj =>
											insertInlineStyles(
												obj,
												`${inlineTarget}:hover`
											)
										}
										onChange={obj => {
											maxiSetAttributes(obj);
											cleanInlineStyles(
												`${inlineTarget}:hover`
											);
										}}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
									/>
								)}
							</>
						),
						extraIndicators: [`${prefix}box-shadow-status-hover`],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default boxShadow;
