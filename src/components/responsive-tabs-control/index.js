/**
 * WordPress dependencies
 */
import { useSelect, useDispatch, select } from '@wordpress/data';
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
	const {
		className,
		children,
		breakpoint,
		disableCallback = false,
		target,
	} = props;

	const { winBreakpoint } = useSelect(select => {
		const { receiveWinBreakpoint } = select('maxiBlocks');

		const winBreakpoint = receiveWinBreakpoint();

		return {
			winBreakpoint,
		};
	});

	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

	const breakpoints = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];

	const setScreenSize = size => {
		const xxlSize = select('maxiBlocks').receiveXXLSize();
		const breakpointsWidth = select('maxiBlocks').receiveMaxiBreakpoints();

		if (size === 'general') setMaxiDeviceType('general');
		else
			setMaxiDeviceType(
				size,
				size !== 'xxl' ? breakpointsWidth[size] : xxlSize
			);
	};

	const classes = classnames('maxi-responsive-tabs-control', className);

	const getTextOptionsTab = () => {
		if (breakpoint !== 'general')
			return breakpoints.indexOf(breakpoint.toUpperCase());

		if (!winBreakpoint) return null;

		return breakpoints.indexOf(winBreakpoint.toUpperCase());
	};

	const showNotification = customBreakpoint => {
		return winBreakpoint === customBreakpoint.toLowerCase();
	};

	return (
		<SettingTabsControl
			className={classes}
			items={breakpoints.map(breakpoint => {
				return {
					label: breakpoint,
					content: cloneElement(children, {
						breakpoint:
							winBreakpoint === breakpoint.toLowerCase()
								? 'general'
								: breakpoint.toLowerCase(),
					}),
					// content: children,
					showNotification: showNotification(breakpoint),
					callback: () =>
						!disableCallback
							? setScreenSize(breakpoint.toLowerCase())
							: null,
					breakpoint: breakpoint.toLowerCase(),
				};
			})}
			forceTab={getTextOptionsTab()}
			target={target}
		/>
	);
};

export default ResponsiveTabsControl;
