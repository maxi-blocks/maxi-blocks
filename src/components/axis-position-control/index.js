/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

const AxisPositionControl = ({
	label,
	onChange,
	selected,
	breakpoint,
	className,
	disableY = false,
	enableCenter = false,
	buttonClasses = {},
}) => {
	const classes = classnames('maxi-axis-position-control', className);

	return (
		breakpoint === 'general' && (
			<SettingTabsControl
				label={__(`${label} position`, 'maxi-blocks')}
				className={classes}
				type='buttons'
				selected={selected}
				items={[
					...(!disableY && [
						{
							label: __('Top', 'maxi-blocks'),
							value: 'top',
							className: buttonClasses.top,
						},
						{
							label: __('Bottom', 'maxi-blocks'),
							value: 'bottom',
							className: buttonClasses.bottom,
						},
					]),
					{
						label: __('Left', 'maxi-blocks'),
						value: 'left',
						className: buttonClasses.left,
					},
					enableCenter && {
						label: __('Center', 'maxi-blocks'),
						value: 'center',
						className: buttonClasses.center,
					},
					{
						label: __('Right', 'maxi-blocks'),
						value: 'right',
						className: buttonClasses.right,
					},
				]}
				onChange={onChange}
			/>
		)
	);
};

export default AxisPositionControl;
