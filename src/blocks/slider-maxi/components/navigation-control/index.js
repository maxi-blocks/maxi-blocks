/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../../../extensions/attributes';
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
	const dotPrefix = 'nd';
	const arrowPrefix = 'na';

	const arrowsEnabled = getLastBreakpointAttribute({
		target: 'nab.s',
		breakpoint: deviceType,
		props,
		forceSingle: true,
	});
	const dotsEnabled = getLastBreakpointAttribute({
		target: '.s',
		prefix: dotPrefix,
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
						[`${arrowPrefix}b.s-${deviceType}`]: val,
					})
				}
			/>
			<ToggleSwitch
				label={__('Enable dots')}
				selected={dotsEnabled}
				onChange={val =>
					onChange({ [`${dotPrefix}.s-${deviceType}`]: val })
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
						target: '_pos',
						prefix: arrowPrefix,
						breakpoint: deviceType,
						props,
					})}
					onChange={val => {
						onChange({
							[`${arrowPrefix}_pos-${deviceType}`]: val,
							...(val === 'inside' && {
								[`${arrowPrefix}b-i_sh-${deviceType}`]: -40,
							}),
							...(val === 'outside' && {
								[`${arrowPrefix}b-i_sh-${deviceType}`]: 10,
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
						target: '_pos',
						prefix: dotPrefix,
						breakpoint: deviceType,
						props,
					})}
					onChange={val => {
						onChange({
							[`${dotPrefix}_pos-${deviceType}`]: val,
							...(val === 'inside' && {
								[`${dotPrefix}-i_sv-${deviceType}`]: 85,
							}),
							...(val === 'outside' && {
								[`${dotPrefix}-i_sv-${deviceType}`]: 110,
							}),
						});
					}}
				/>
			)}
		</div>
	);
};

export default NavigationControl;
