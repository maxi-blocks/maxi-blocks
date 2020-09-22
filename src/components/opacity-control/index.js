/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl, RadioControl } = wp.components;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import classnames from 'classnames';
import { isObject, isNil, isNumber, round } from 'lodash';

/**
 * Component
 */
const OpacityControl = props => {
	const {
		opacity,
		defaultOpacity,
		className,
		onChange,
		breakpoint = 'general',
		displayToggle = false,
	} = props;

	const value = !isObject(opacity) ? JSON.parse(opacity) : opacity;

	const defaultValue = !isObject(defaultOpacity)
		? JSON.parse(defaultOpacity)
		: defaultOpacity;

	const classes = classnames('maxi-opacity-control', className);

	const getOpacityValue = () => {
		const response = getLastBreakpointValue(value, 'opacity', breakpoint);

		if (!isNumber(response)) return response;

		return round(response * 100);
	};

	const isEnabled = () => {
		const response = getLastBreakpointValue(value, 'opacity', breakpoint);

		if (response === 0) return 1;

		if (response) return 1;

		return 0;
	};

	return (
		<div className={classes}>
			{!!displayToggle && (
				<div className='maxi-fancy-radio-control'>
					<RadioControl
						label={__('Enable Opacity', 'maxi-blocks')}
						selected={isEnabled()}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => {
							if (val === '1') {
								value[breakpoint].opacity = 1;
							} else {
								value[breakpoint].opacity = '';
							}

							onChange(JSON.stringify(value));
						}}
					/>
				</div>
			)}
			{(!!isEnabled() || !displayToggle) && (
				<RangeControl
					label={__('Opacity', 'maxi-blocks')}
					value={getOpacityValue()}
					onChange={val => {
						isNil(val)
							? (value[breakpoint].opacity =
									defaultValue[breakpoint].opacity)
							: (value[breakpoint].opacity = Number(val / 100));
						onChange(JSON.stringify(value));
					}}
					min={0}
					max={100}
					allowReset
					initialPosition={defaultValue[breakpoint].opacity}
				/>
			)}
		</div>
	);
};

export default OpacityControl;
