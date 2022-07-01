/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { cloneElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import { setScreenSize } from '../../extensions/styles';

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
		extraIndicators,
		extraIndicatorsResponsive,
		ignoreIndicator,
		ignoreIndicatorResponsive,
		ignoreIndicatorGroups,
		isBgLayersHover = false,
	} = props;

	const { winBreakpoint } = useSelect(select => {
		const { receiveWinBreakpoint } = select('maxiBlocks');

		const winBreakpoint = receiveWinBreakpoint();

		return {
			winBreakpoint,
		};
	});

	const breakpoints = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];

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
					showNotification: showNotification(breakpoint),
					callback: () =>
						!disableCallback
							? winBreakpoint === breakpoint.toLowerCase()
								? setScreenSize('general')
								: setScreenSize(breakpoint.toLowerCase())
							: null,
					breakpoint: breakpoint.toLowerCase(),
					extraIndicators,
					extraIndicatorsResponsive,
					ignoreIndicator,
					ignoreIndicatorResponsive,
					ignoreIndicatorGroups,
					isBgLayersHover,
				};
			})}
			forceTab={getTextOptionsTab()}
			target={target}
		/>
	);
};

export default ResponsiveTabsControl;
