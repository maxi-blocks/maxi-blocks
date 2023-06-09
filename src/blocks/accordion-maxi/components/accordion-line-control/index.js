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
					prefix,
					target: '_lh',
					breakpoint,
					attributes: props,
				})}
				defaultValue={getDefaultAttribute(
					getAttributeKey({ key: '_lh', prefix, breakpoint })
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
						[getAttributeKey({ key: '_lh', prefix, breakpoint })]:
							val,
					})
				}
				onReset={() => {
					onChange({
						[getAttributeKey({ key: '_lh', prefix, breakpoint })]:
							getDefaultAttribute(
								getAttributeKey({
									key: '_lh',
									prefix,
									breakpoint,
								})
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
										target: 'li.sh',
										prefix,
										props,
									})}
									onChange={val =>
										onChange({
											[getAttributeKey({
												key: 'li.sh',
												prefix,
											})]: val,
										})
									}
								/>
								{getAttributesValue({
									target: 'li.sh',
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
										target: 'li.sa',
										prefix,
										props,
									})}
									onChange={val =>
										onChange({
											[getAttributeKey({
												key: 'li.sa',
												prefix,
											})]: val,
										})
									}
								/>
								{getAttributesValue({
									target: 'li.sa',
									prefix,
									props,
								}) && (
									<DividerControl
										{...props}
										prefix={`${prefix}a-`}
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
