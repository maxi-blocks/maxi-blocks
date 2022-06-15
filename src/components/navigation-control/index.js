/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import NavigationArrowsControl from './arrows-control';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

const NavigationControl = props => {
	const { className, onChange, deviceType, attributes } = props;

	const classes = classnames('maxi-slider-navigation', className);

	return (
		<div className={classes}>
			<ResponsiveTabsControl breakpoint={deviceType}>
				<>
					<SelectControl
						label={__('Navigation', 'maxi-blocks')}
						options={[
							{
								label: __('Arrows and dots ', 'maxi-blocks'),
								value: 'arrows-dots',
							},
							{
								label: __('Arrows', 'maxi-blocks'),
								value: 'arrows',
							},
							{ label: __('Dots', 'maxi-blocks'), value: 'dots' },
							{ label: __('None', 'maxi-blocks'), value: 'none' },
						]}
						value={getLastBreakpointAttribute({
							target: 'navigation-type',
							deviceType,
							attributes,
						})}
						onChange={val =>
							onChange({
								[`navigation-type-${deviceType}`]: val,
							})
						}
					/>
					{props[`navigation-type-${deviceType}`] !== 'dots' && (
						<SelectControl
							label={__('Arrow position', 'maxi-blocks')}
							options={[
								{
									label: __('Inside', 'maxi-blocks'),
									value: 'inside',
								},
								{
									label: __('Outside', 'maxi-blocks'),
									value: 'outside',
								},
							]}
							value={getLastBreakpointAttribute({
								target: 'navigation-arrow-position',
								deviceType,
								attributes,
							})}
							onChange={val => {
								onChange({
									[`navigation-arrow-position-${deviceType}`]:
										val,
								});
								val === 'inside' &&
									onChange({
										[`navigation-arrow-both-icon-spacing-horizontal-${deviceType}`]:
											-40,
									});
								val === 'outside' &&
									onChange({
										[`navigation-arrow-both-icon-spacing-horizontal-${deviceType}`]: 10,
									});
							}}
						/>
					)}
				</>
			</ResponsiveTabsControl>
			{attributes[`navigation-type-${deviceType}`].includes('arrows') && (
				<NavigationArrowsControl {...props} />
			)}
		</div>
	);
};

export default NavigationControl;
