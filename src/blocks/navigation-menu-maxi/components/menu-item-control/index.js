/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ToggleSwitch,
	TypographyControl,
	SettingTabsControl,
} from '../../../../components';

const MenuItemControl = props => {
	const { onChange } = props;

	const prefix = 'menu-item-';

	return (
		<SettingTabsControl
			depth={2}
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: <TypographyControl {...props} prefix={prefix} />,
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__('Enable hover', 'maxi-blocks')}
								selected={
									props[`${prefix}typography-status-hover`]
								}
								onChange={val =>
									onChange({
										[`${prefix}typography-status-hover`]:
											val,
									})
								}
							/>
							{props[`${prefix}typography-status-hover`] && (
								<TypographyControl
									{...props}
									isHover
									prefix={prefix}
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
									props[`${prefix}typography-status-active`]
								}
								onChange={val =>
									onChange({
										[`${prefix}typography-status-active`]:
											val,
									})
								}
							/>
							{props[`${prefix}typography-status-active`] && (
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
