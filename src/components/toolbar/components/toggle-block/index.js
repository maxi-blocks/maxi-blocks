/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Icons & Styles
 */
import './editor.scss';
import { toolbarHide, toolbarShow } from '../../../../icons';

/**
 * Toggle Block
 */
const ToggleBlock = props => {
	const { breakpoint, onChange, defaultDisplay = 'inherit' } = props;

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
		<Fragment>
			<Tooltip
				text={
					getValue() === 'none'
						? __('Show', 'maxi-blocks')
						: __('Hide', 'maxi-blocks')
				}
				position='bottom center'
			>
				<Button
					className='toolbar-item toolbar-item__toggle-block'
					onClick={e => {
						e.preventDefault();

						getValue() === 'none'
							? onChange({
									[`display-${breakpoint}`]: getOptions()[0]
										.value,
							  })
							: onChange({
									[`display-${breakpoint}`]: getOptions()[1]
										.value,
							  });
					}}
				>
					{getValue() === 'none' ? (
						<Icon
							className='toolbar-item__icon'
							icon={toolbarShow}
						/>
					) : (
						<Icon
							className='toolbar-item__icon'
							icon={toolbarHide}
						/>
					)}
				</Button>
			</Tooltip>
		</Fragment>
	);
};

export default ToggleBlock;
