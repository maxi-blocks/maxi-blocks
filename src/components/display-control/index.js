import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';

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
		(isHide() || props[`display-${breakpoint}`] === 'none') &&
		!props?.clientId;
	const classes = classnames('maxi-display-control', className);

	const openListView = () => {
		// Try core/editor first (WordPress 6.5+), then fall back to core/edit-post
		const editorDispatch = dispatch('core/editor');
		const editPostDispatch = dispatch('core/edit-post');

		if (editorDispatch?.setIsListViewOpened) {
			editorDispatch.setIsListViewOpened(true);
		} else if (editPostDispatch?.setIsListViewOpened) {
			editPostDispatch.setIsListViewOpened(true);
		}
	};

	return (
		<div className={classes}>
			{shouldBeHidden && (
				<InfoBox
					className='maxi-warning-box__hidden-reveal'
					message={
						<>
							{__(
								'To view or edit a hidden block,',
								'maxi-blocks'
							)}{' '}
							<a
								className='maxi-warning-box__link-inline'
								onClick={openListView}
							>
								{__('open List View', 'maxi-blocks')}
							</a>
							{__(
								', select the block, then choose Show.',
								'maxi-blocks'
							)}
						</>
					}
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
