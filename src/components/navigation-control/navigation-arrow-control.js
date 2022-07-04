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

const NavigationArrowControl = props => {
	const { className, onChange, deviceType, attributes } = props;

	const classes = classnames('maxi-slider-navigation', className);

	return (
		<div className={classes}>
			<NavigationIconsControl
				{...props}
				prefix='navigation-arrow-both-icon'
			/>
		</div>
	);
};

export default NavigationArrowControl;
