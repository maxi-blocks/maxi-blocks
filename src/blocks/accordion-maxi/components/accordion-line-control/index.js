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
} from '../../../../components';
import {
	getAttributeValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

const AccordionLineControl = props => {
	const { onChange, breakpoint, prefix } = props;

	return (
		<>
			<SelectControl
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
									selected={getAttributeValue({
										target: 'line-status-hover',
										prefix,
									})}
									onChange={val =>
										onChange({
											[`${prefix}line-status-hover`]: val,
										})
									}
								/>
								{getAttributeValue({
									target: 'line-status-hover',
									prefix,
								}) && (
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
									selected={getAttributeValue({
										target: 'line-status-active',
										prefix,
									})}
									onChange={val =>
										onChange({
											[`${prefix}line-status-active`]:
												val,
										})
									}
								/>
								{getAttributeValue({
									target: 'line-status-active',
									prefix,
								}) && (
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
