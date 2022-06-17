/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingTabsControl, ToggleSwitch } from '../../components';
import NavigationIconControl from './navigation-icon-control';

const NavigationIconsControl = props => {
	const {
		onChange,
		deviceType,
		insertInlineStyles,
		cleanInlineStyles,
		svgType,
		clientId,
		blockStyle,
		attributes,
		prefix = 'navigation-arrow-both-icon',
	} = props;

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: (
						<NavigationIconControl
							{...attributes}
							onChangeInline={(
								obj,
								target,
								isMultiplySelector = false
							) =>
								insertInlineStyles({
									obj,
									target,
									isMultiplySelector,
								})
							}
							onChange={(obj, target) => {
								onChange(obj);
								cleanInlineStyles(target);
							}}
							svgType={svgType}
							breakpoint={deviceType}
							clientId={clientId}
							blockStyle={blockStyle}
							prefix={prefix}
						/>
					),
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__('Enable icon hover', 'maxi-blocks')}
								selected={attributes[`${prefix}-status-hover`]}
								onChange={val =>
									onChange({
										[`${prefix}-status-hover`]: val,
									})
								}
							/>
							{attributes[`${prefix}-status-hover`] && (
								<NavigationIconControl
									{...attributes}
									onChangeInline={(
										obj,
										target,
										isMultiplySelector = false
									) =>
										insertInlineStyles({
											obj,
											target,
											isMultiplySelector,
										})
									}
									onChange={(obj, target) => {
										onChange(obj);
										cleanInlineStyles(target);
									}}
									svgType={svgType}
									breakpoint={deviceType}
									clientId={clientId}
									blockStyle={blockStyle}
									prefix={prefix}
									isHover
								/>
							)}
						</>
					),
				},
			]}
		/>
	);
};

export default NavigationIconsControl;
