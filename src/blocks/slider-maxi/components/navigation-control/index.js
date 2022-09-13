/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { ToggleSwitch, SelectControl } from '../../../../components';

const NavigationControl = props => {
	const { className, onChange, deviceType } = props;

	const classes = classnames('maxi-slider-navigation', className);

	const arrowsEnabled = getLastBreakpointAttribute({
		target: 'navigation-arrow-both-status',
		breakpoint: deviceType,
		props,
		forceSingle: true,
	});
	const dotsEnabled = getLastBreakpointAttribute({
		target: 'navigation-dot-status',
		breakpoint: deviceType,
		props,
		forceSingle: true,
	});

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Enable arrows')}
				selected={arrowsEnabled}
				onChange={val =>
					onChange({
						[`navigation-arrow-both-status-${deviceType}`]: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Enable dots')}
				selected={dotsEnabled}
				onChange={val =>
					onChange({ [`navigation-dot-status-${deviceType}`]: val })
				}
			/>
			{arrowsEnabled && (
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
			{dotsEnabled && (
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
