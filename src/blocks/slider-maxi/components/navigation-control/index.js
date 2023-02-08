/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../../../extensions/styles';
import { ToggleSwitch, SelectControl } from '../../../../components';

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
	const dotPrefix = 'navigation-dot-';
	const arrowPrefix = 'navigation-arrow-';

	const arrowsEnabled = getLastBreakpointAttribute({
		target: `${arrowPrefix}both-status`,
		breakpoint: deviceType,
		props,
		forceSingle: true,
	});
	const dotsEnabled = getLastBreakpointAttribute({
		target: `${dotPrefix}status`,
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
						[`${arrowPrefix}both-status-${deviceType}`]: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Enable dots')}
				selected={dotsEnabled}
				onChange={val =>
					onChange({ [`${dotPrefix}status-${deviceType}`]: val })
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
						target: `${arrowPrefix}position`,
						breakpoint: deviceType,
						props,
					})}
					onChange={val => {
						onChange({
							[`${arrowPrefix}position-${deviceType}`]: val,
							...(val === 'inside' && {
								[`${arrowPrefix}both-icon-spacing-horizontal-${deviceType}`]:
									-40,
							}),
							...(val === 'outside' && {
								[`${arrowPrefix}both-icon-spacing-horizontal-${deviceType}`]: 10,
							}),
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
						target: `${dotPrefix}position`,
						breakpoint: deviceType,
						props,
					})}
					onChange={val => {
						onChange({
							[`${dotPrefix}position-${deviceType}`]: val,
							...(val === 'inside' && {
								[`${dotPrefix}icon-spacing-vertical-${deviceType}`]: 85,
							}),
							...(val === 'outside' && {
								[`${dotPrefix}icon-spacing-vertical-${deviceType}`]: 110,
							}),
						});
					}}
				/>
			)}
		</div>
	);
};

export default NavigationControl;
