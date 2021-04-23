/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import SettingTabsControl from '../setting-tabs-control';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * Component
 */
const LinkColor = props => {
	const { className, onChange } = props;

	const classes = classnames('maxi-link-color', className);

	return (
		<div className={classes}>
			<SettingTabsControl
				items={[
					{
						label: __('Normal', 'maxi-blocks'),
						content: (
							<ColorControl
								label=''
								color={props['link-color-link']}
								defaultColor={getDefaultAttribute(
									'link-color-link'
								)}
								onChange={val => {
									onChange({ ['link-color-link']: val });
								}}
							/>
						),
					},
					{
						label: __('Hover', 'maxi-blocks'),
						content: (
							<ColorControl
								label=''
								color={props['link-color-hover']}
								defaultColor={getDefaultAttribute(
									'link-color-hover'
								)}
								onChange={val => {
									onChange({ ['link-color-hover']: val });
								}}
							/>
						),
					},
					{
						label: __('Active', 'maxi-blocks'),
						content: (
							<ColorControl
								label=''
								color={props['link-color-active']}
								defaultColor={getDefaultAttribute(
									'link-color-active'
								)}
								onChange={val => {
									onChange({ ['link-color-active']: val });
								}}
							/>
						),
					},
					{
						label: __('Visited', 'maxi-blocks'),
						content: (
							<ColorControl
								label=''
								color={props['link-color-visited']}
								defaultColor={getDefaultAttribute(
									'link-color-visited'
								)}
								onChange={val => {
									onChange({ ['link-color-visited']: val });
								}}
							/>
						),
					},
				]}
			/>
		</div>
	);
};

export default LinkColor;
