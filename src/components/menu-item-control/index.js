/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import TypographyControl from '../typography-control';

const MenuItemControl = props => {
	const { onChange } = props;

	const prefix = 'menu-item-';

	return (
		<SettingTabsControl
			depth={2}
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: <TypographyControl {...props} />,
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__('Enable hover', 'maxi-blocks')}
								selected={props[`${prefix}status-hover`]}
								onChange={val =>
									onChange({ [`${prefix}status-hover`]: val })
								}
							/>
							{props[`${prefix}status-hover`] && (
								<TypographyControl {...props} isHover />
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
								selected={props[`${prefix}status-active`]}
								onChange={val =>
									onChange({
										[`${prefix}status-active`]: val,
									})
								}
							/>
							{props[`${prefix}status-active`] && (
								<TypographyControl
									{...props}
									prefix={`active-${prefix}`}
								/>
							)}
						</>
					),
				},
			]}
		/>
	);
};

export default MenuItemControl;
