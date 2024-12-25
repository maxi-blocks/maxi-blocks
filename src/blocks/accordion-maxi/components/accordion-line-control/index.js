/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	SettingTabsControl,
	DividerControl,
	ToggleSwitch,
	SelectControl,
} from '@components';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

const AccordionLineControl = props => {
	const { onChange, breakpoint, prefix } = props;

	return (
		<>
			<SelectControl
				__nextHasNoMarginBottom
				label={__('Line horizontal position', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: `${prefix}line-horizontal`,
					breakpoint,
					attributes: props,
				})}
				defaultValue={getDefaultAttribute(
					`${prefix}line-horizontal-${breakpoint}`
				)}
				options={[
					{
						label: __('Left', 'maxi-blocks'),
						value: 'flex-start',
					},
					{
						label: __('Center', 'maxi-blocks'),
						value: 'center',
					},
					{
						label: __('Right', 'maxi-blocks'),
						value: 'flex-end',
					},
				]}
				onChange={val =>
					onChange({
						[`${prefix}line-horizontal-${breakpoint}`]: val,
					})
				}
				onReset={() => {
					onChange({
						[`${prefix}line-horizontal-${breakpoint}`]:
							getDefaultAttribute(
								`${prefix}line-horizontal-${breakpoint}`
							),
						isReset: true,
					});
				}}
			/>
			<SettingTabsControl
				depth={3}
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: <DividerControl {...props} disableRTC />,
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable hover', 'maxi-blocks')}
									selected={
										props[`${prefix}line-status-hover`]
									}
									onChange={val =>
										onChange({
											[`${prefix}line-status-hover`]: val,
										})
									}
								/>
								{props[`${prefix}line-status-hover`] && (
									<DividerControl
										{...props}
										isHover
										disableRTC
									/>
								)}
							</>
						),
					},
					{
						label: __('Active state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable active', 'maxi-blocks')}
									selected={
										props[`${prefix}line-status-active`]
									}
									onChange={val =>
										onChange({
											[`${prefix}line-status-active`]:
												val,
										})
									}
								/>
								{props[`${prefix}line-status-active`] && (
									<DividerControl
										{...props}
										prefix={`${prefix}active-`}
									/>
								)}
							</>
						),
					},
				]}
			/>
		</>
	);
};

export default AccordionLineControl;
