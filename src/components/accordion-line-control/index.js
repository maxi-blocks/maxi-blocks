/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import DividerControl from '../divider-control';
import ToggleSwitch from '../toggle-switch';

const AccordionLineControl = props => {
	const { onChange } = props;

	return (
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
								<DividerControl {...props} prefix='active-' />
							)}
						</>
					),
				},
			]}
		/>
	);
};

export default AccordionLineControl;
