/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const DisplayControl = props => {
	const {
		className,
		onChange,
		breakpoint,
		defaultDisplay = 'inherit',
	} = props;

	const display = { ...props.display };

	const classes = classnames('maxi-display-control', className);

	const isHide = () => {
		const objectKeys = Object.keys(display);
		const breakpointIndex = objectKeys.indexOf(breakpoint) - 1;

		if (breakpointIndex === 0) return false;

		let i = breakpointIndex;

		do {
			if (display[objectKeys[i]].display === 'none') return true;
			if (display[objectKeys[i]].display === defaultDisplay) return false;
			i -= 1;
		} while (i > 0);

		return false;
	};

	const getValue = () => {
		const isPrevHide = isHide();

		return isPrevHide && display[breakpoint].display === ''
			? 'none'
			: display[breakpoint].display;
	};

	const getOptions = () => {
		const isPrevHide = isHide();

		if (isPrevHide)
			return [
				{ label: __('Show', 'maxi-blocks'), value: defaultDisplay },
				{ label: __('Hide', 'maxi-blocks'), value: 'none' },
			];
		return [
			{ label: __('Show', 'maxi-blocks'), value: '' },
			{ label: __('Hide', 'maxi-blocks'), value: 'none' },
		];
	};

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Display block', 'maxi-blocks')}
				selected={getValue()}
				options={getOptions()}
				onChange={val => {
					display[breakpoint].display = val;
					onChange(display);
				}}
			/>
		</div>
	);
};

export default DisplayControl;
