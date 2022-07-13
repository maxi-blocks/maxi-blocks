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
				label={__(`${label} position`, 'maxi-block')}
				className={classes}
				type='buttons'
				selected={selected}
				items={[
					...(!disableY && [
						{
							label: __('Top', 'maxi-block'),
							value: 'top',
						},
						{
							label: __('Bottom', 'maxi-block'),
							value: 'bottom',
						},
					]),
					{
						label: __('Left', 'maxi-block'),
						value: 'left',
					},
					enableCenter && {
						label: __('Center', 'maxi-block'),
						value: 'center',
					},
					{
						label: __('Right', 'maxi-block'),
						value: 'right',
					},
				]}
				onChange={onChange}
			/>
		)
	);
};

export default AxisPositionControl;
