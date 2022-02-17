/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { cloneElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const ResponsiveTabsControl = props => {
	const { className, breakpoint, disableCallback = false, target } = props;

	const { winBreakpoint } = useSelect(select => {
		const { receiveWinBreakpoint } = wp.data.select('maxiBlocks');

		const winBreakpoint = receiveWinBreakpoint();

		return {
			winBreakpoint,
		};
	});

	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

	const breakpoints = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];

	const classes = classnames('maxi-responsive-tabs-control', className);

	const getTextOptionsTab = () => {
		if (breakpoint !== 'general')
			return breakpoints.indexOf(breakpoint?.toUpperCase());

		if (!winBreakpoint) return null;

		return breakpoints.indexOf(winBreakpoint?.toUpperCase());
	};

	const showNotification = customBreakpoint => {
		return winBreakpoint === customBreakpoint?.toLowerCase();
	};
	console.log(props);
	return (
		<SettingTabsControl
			className={classes}
			items={breakpoints.map(breakpoint => {
				return {
					label: breakpoint,
					content: cloneElement(<> </>, props),
					showNotification: showNotification(breakpoint),
					callback: () =>
						!disableCallback
							? setMaxiDeviceType(
									winBreakpoint === breakpoint?.toLowerCase()
										? 'general'
										: breakpoint?.toLowerCase()
							  )
							: null,
					breakpoint: breakpoint?.toLowerCase(),
				};
			})}
			forceTab={getTextOptionsTab()}
			target={target}
		/>
	);
};

export default ResponsiveTabsControl;
