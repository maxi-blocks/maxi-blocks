/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import NavigationIconsControl from './navigation-control';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

const NavigationDotControl = props => {
	const { className } = props;

	const classes = classnames('maxi-slider-dot-navigation', className);

	return (
		<div className={classes}>
			<NavigationIconsControl {...props} prefix='navigation-dot-icon' />
		</div>
	);
};

export default NavigationDotControl;
