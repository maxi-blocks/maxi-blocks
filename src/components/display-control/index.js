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
import { isEmpty } from 'lodash';

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

	const classes = classnames('maxi-display-control', className);

	const isHide = () => {
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		const breakpointIndex = breakpoints.indexOf(breakpoint) - 1;

		if (breakpointIndex <= 0) return false;

		let i = breakpointIndex;

		do {
			if (props[`$display-${breakpoint[i]}`] === 'none') return true;
			if (props[`$display-${breakpoint[i]}`] === defaultDisplay)
				return false;
			i -= 1;
		} while (i > 0);

		return false;
	};

	const getValue = () => {
		const isPrevHide = isHide();

		return isPrevHide && props[`display-${breakpoint}`]
			? 'none'
			: props[`display-${breakpoint}`];
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
				onChange={val =>
					onChange({
						[`display-${breakpoint}`]: !isEmpty(val) ? val : '',
					})
				}
			/>
		</div>
	);
};

export default DisplayControl;
