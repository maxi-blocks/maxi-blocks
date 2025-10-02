import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import InfoBox from '@components/info-box';

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

	// Subscribe to global "Reveal Hidden Blocks" flag from maxiBlocks settings
	const isRevealModeActive = useSelect(select => {
		const settings = select('maxiBlocks').receiveMaxiSettings();
		// Expect a boolean settings flag. Default to false if missing.
		return !!settings?.reveal_hidden_blocks;
	}, []);

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

	// Determine effective hidden state for current breakpoint (accounts for inheritance)
	const effectiveValue = getValue();
	const shouldBeHidden =
		isHide() || props[`display-${breakpoint}`] === 'none';

	const classes = classnames('maxi-display-control', className, {
		'is-temporarily-revealed': shouldBeHidden && isRevealModeActive,
	});

	return (
		<div className={classes}>
			{shouldBeHidden && !isRevealModeActive && (
				<InfoBox
					className='maxi-warning-box__hidden-reveal'
					message={__(
						'To view or edit a hidden block, open List View, select the block, then choose Show.',
						'maxi-blocks'
					)}
				/>
			)}
			<SettingTabsControl
				label={__('Show or hide by breakpoint', 'maxi-blocks')}
				type='buttons'
				selected={effectiveValue}
				items={getOptions()}
				onChange={val => {
					onChange({
						[`display-${breakpoint}`]: !isEmpty(val) ? val : null,
					});
				}}
				hasBorder
			/>
		</div>
	);
};

export default DisplayControl;
