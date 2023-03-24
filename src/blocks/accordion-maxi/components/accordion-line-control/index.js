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
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

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
					getAttributeKey(
						'line-horizontal',
						false,
						prefix,
						breakpoint
					)
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
						[getAttributeKey(
							'line-horizontal',
							false,
							prefix,
							breakpoint
						)]: val,
					})
				}
				onReset={() => {
					onChange({
						[getAttributeKey(
							'line-horizontal',
							false,
							prefix,
							breakpoint
						)]: getDefaultAttribute(
							getAttributeKey(
								'line-horizontal',
								false,
								prefix,
								breakpoint
							)
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
									selected={getAttributesValue({
										target: 'line-status',
										prefix,
										isHover: true,
										props,
									})}
									onChange={val =>
										onChange({
											[getAttributeKey(
												'line-status-hover',
												false,
												prefix
											)]: val,
										})
									}
								/>
								{getAttributesValue({
									target: 'line-status',
									prefix,
									isHover: true,
									props,
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
									selected={getAttributesValue({
										target: 'line-status-active',
										prefix,
										props,
									})}
									onChange={val =>
										onChange({
											[getAttributeKey(
												'line-status-active',
												false,
												prefix
											)]: val,
										})
									}
								/>
								{getAttributesValue({
									target: 'line-status-active',
									prefix,
									props,
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
