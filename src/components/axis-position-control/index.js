/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

const AxisPositionControl = ({
	label,
	onChange,
	selected,
	breakpoint,
	className,
	disableY = false,
	enableCenter = false,
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
						},
						{
							label: __('Bottom', 'maxi-blocks'),
							value: 'bottom',
						},
					]),
					{
						label: __('Left', 'maxi-blocks'),
						value: 'left',
					},
					enableCenter && {
						label: __('Center', 'maxi-blocks'),
						value: 'center',
					},
					{
						label: __('Right', 'maxi-blocks'),
						value: 'right',
					},
				]}
				onChange={onChange}
			/>
		)
	);
};

export default AxisPositionControl;
