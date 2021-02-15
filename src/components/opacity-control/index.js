/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty, round } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const OpacityControl = props => {
	const {
		label,
		opacity,
		defaultOpacity = 1,
		fullWidthMode = false,
		className,
		onChange,
	} = props;

	const classes = classnames(
		'maxi-opacity-control',
		fullWidthMode && 'maxi-opacity-control--full-width',
		className
	);

	return (
		<RangeControl
			label={isEmpty(label) ? __('Opacity', 'maxi-blocks') : label}
			className={classes}
			value={opacity * 100}
			onChange={val => {
				let value = val;

				if (value > 100) value = 100;
				if (value < 0) value = 0;

				isNil(value)
					? onChange(defaultOpacity)
					: onChange(round(value / 100, 2));
			}}
			min={0}
			max={100}
			allowReset
			initialPosition={defaultOpacity}
		/>
	);
};

export default OpacityControl;
