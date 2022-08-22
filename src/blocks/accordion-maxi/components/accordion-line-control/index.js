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
import { getLastBreakpointAttribute } from '../../../../extensions/styles';

const AccordionLineControl = props => {
	const { onChange, breakpoint } = props;

	return (
		<>
			<SelectControl
				label={__('Line horizontal position', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: 'line-horizontal',
					breakpoint,
					props,
				})}
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
						[`line-horizontal-${breakpoint}`]: val,
					})
				}
			/>
			<SettingTabsControl
				depth={2}
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: <DividerControl {...props} />,
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable hover', 'maxi-blocks')}
									selected={props['line-status-hover']}
									onChange={val =>
										onChange({ 'line-status-hover': val })
									}
								/>
								{props['line-status-hover'] && (
									<DividerControl {...props} isHover />
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
									selected={props['line-status-active']}
									onChange={val =>
										onChange({ 'line-status-active': val })
									}
								/>
								{props['line-status-active'] && (
									<DividerControl
										{...props}
										prefix='active-'
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
