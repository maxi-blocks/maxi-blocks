/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil } from 'lodash';

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

		if (breakpointIndex < 0) return false;

		let i = breakpointIndex;

		do {
			if (props[`display-${breakpoints[i]}`] === 'none') return true;
			if (props[`display-${breakpoints[i]}`] === defaultDisplay)
				return false;
			i -= 1;
		} while (i >= 0);

		return false;
	};

	const getValue = () => {
		if (props[`display-${breakpoint}`] === 'none') return 'none';

		const isPrevHide = isHide();
		if (
			isPrevHide &&
			(isNil(props[`display-${breakpoint}`]) ||
				props[`display-${breakpoint}`] === '')
		)
			return 'none';

		if (
			isPrevHide &&
			(!isNil(props[`display-${breakpoint}`]) ||
				props[`display-${breakpoint}`] !== '')
		)
			return defaultDisplay;

		return '';
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
			<SettingTabsControl
				label={__('Show or hide by breakpoint', 'maxi-blocks')}
				type='buttons'
				selected={getValue()}
				items={getOptions()}
				onChange={val =>
					onChange({
						[`display-${breakpoint}`]: !isEmpty(val) ? val : null,
					})
				}
				hasBorder
			/>
		</div>
	);
};

export default DisplayControl;
