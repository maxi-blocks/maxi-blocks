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
import { inRange, isEmpty } from 'lodash';

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
		activeTabs = [],
	} = props;

	const { winWidth, maxiBreakpoints } = useSelect(select => {
		const { receiveMaxiSettings, receiveMaxiBreakpoints } =
			wp.data.select('maxiBlocks');

		const winWidth = receiveMaxiSettings().window?.width || null;

		const maxiBreakpoints = receiveMaxiBreakpoints();

		return {
			winWidth,
			maxiBreakpoints,
		};
	});

	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

	const breakpoints = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];

	const classes = classnames('maxi-responsive-tabs-control', className);

	const getWinBreakpoint = () => {
		if (!maxiBreakpoints || isEmpty(maxiBreakpoints)) return null;

		if (winWidth > maxiBreakpoints.xl) return 'xxl';

		const response = Object.entries(maxiBreakpoints).reduce(
			([prevKey, prevValue], [currKey, currValue]) => {
				if (!prevValue) return [prevKey];
				if (inRange(winWidth, prevValue, currValue + 1))
					return [currKey];

				return [prevKey, prevValue];
			}
		)[0];

		return response.toLowerCase();
	};

	const getTextOptionsTab = () => {
		if (breakpoint !== 'general')
			return breakpoints.indexOf(breakpoint.toUpperCase());

		const userBreakpoint = getWinBreakpoint();

		if (!userBreakpoint) return null;

		return breakpoints.indexOf(userBreakpoint.toUpperCase());
	};

	const showNotification = customBreakpoint => {
		if (breakpoint !== 'general')
			return breakpoint === customBreakpoint.toLowerCase();

		return getWinBreakpoint() === customBreakpoint.toLowerCase();
	};

	return (
		<SettingTabsControl
			className={classes}
			items={breakpoints.map(breakpoint => {
				return {
					label: breakpoint,
					content: cloneElement(children, {
						breakpoint: breakpoint.toLowerCase(),
						isGeneral: props.breakpoint === 'general',
					}),
					showNotification: showNotification(breakpoint),
					callback: () =>
						!disableCallback
							? setMaxiDeviceType(breakpoint.toLowerCase())
							: null,
				};
			})}
			activeTabs={activeTabs}
			forceTab={getTextOptionsTab()}
		/>
	);
};

export default ResponsiveTabsControl;
