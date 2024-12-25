/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import ToggleSwitch from '@components/toggle-switch';
import SelectControl from '@components/select-control';
import { getLastBreakpointAttribute } from '@extensions/styles';

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
				label={__('Enable arrows', 'maxi-blocks')}
				selected={arrowsEnabled}
				onChange={val =>
					onChange({
						[`${arrowPrefix}both-status-${deviceType}`]: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Enable dots', 'maxi-blocks')}
				selected={dotsEnabled}
				onChange={val =>
					onChange({ [`${dotPrefix}status-${deviceType}`]: val })
				}
			/>
			{arrowsEnabled && (
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Arrow position', 'maxi-blocks')}
					newStyle
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
					__nextHasNoMarginBottom
					label={__('Dots position', 'maxi-blocks')}
					newStyle
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
