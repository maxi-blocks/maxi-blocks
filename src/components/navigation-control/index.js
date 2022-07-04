/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

const NavigationControl = props => {
	const { className, onChange, deviceType } = props;

	const classes = classnames('maxi-slider-navigation', className);

	const navigationType = getLastBreakpointAttribute({
		target: 'navigation-type',
		breakpoint: deviceType,
		props,
		forceSingle: true,
	});

	return (
		<div className={classes}>
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
				value={navigationType}
				onChange={val =>
					onChange({
						[`navigation-type-${deviceType}`]: val,
					})
				}
			/>
			{navigationType.includes('arrow') && (
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
						props,
					})}
					onChange={val => {
						onChange({
							[`navigation-arrow-position-${deviceType}`]: val,
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
			{navigationType.includes('dot') && (
				<SelectControl
					label={__('Dots position', 'maxi-blocks')}
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
						target: 'navigation-dot-position',
						deviceType,
						props,
					})}
					onChange={val => {
						onChange({
							[`navigation-dot-position-${deviceType}`]: val,
						});
						val === 'inside' &&
							onChange({
								[`navigation-dot-icon-spacing-vertical-${deviceType}`]: 85,
							});
						val === 'outside' &&
							onChange({
								[`navigation-dot-icon-spacing-vertical-${deviceType}`]: 110,
							});
					}}
				/>
			)}
		</div>
	);
};

export default NavigationControl;
