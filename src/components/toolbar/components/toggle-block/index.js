/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Icons & Styles
 */
import './editor.scss';
import { toolbarHide, toolbarShow } from '../../../../icons';
import { Fragment } from 'react';

/**
 * Toggle Block
 */
const ToggleBlock = props => {
	const { display, breakpoint, onChange, defaultDisplay = 'inherit' } = props;

	const displayValue = !isObject(display) ? JSON.parse(display) : display;

	const isHide = () => {
		const objectKeys = Object.keys(displayValue);
		const breakpointIndex = objectKeys.indexOf(breakpoint) - 1;

		if (breakpointIndex === 0) return false;

		let i = breakpointIndex;

		do {
			if (displayValue[objectKeys[i]].display === 'none') return true;
			if (displayValue[objectKeys[i]].display === defaultDisplay)
				return false;
			i -= 1;
		} while (i > 0);

		return false;
	};

	const getValue = () => {
		const isPrevHide = isHide();

		return isPrevHide && displayValue[breakpoint].display === ''
			? 'none'
			: displayValue[breakpoint].display;
	};

	const getOptions = () => {
		const isPrevHide = isHide();

		if (isPrevHide) {
			return {
				show: defaultDisplay,
				hiude: 'none',
			};
		} else {
			return {
				show: '',
				hide: 'none',
			};
		}
	};

	return (
		<Fragment>
			{getValue() === 'none' ? (
				<Tooltip
					text={__('Show', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
						className='toolbar-item toolbar-item__toggle-block'
						onClick={() => {
							displayValue[
								breakpoint
							].display = getOptions().show;
							onChange(JSON.stringify(displayValue));
						}}
					>
						<Icon
							className='toolbar-item__icon'
							icon={toolbarShow}
						/>
					</Button>
				</Tooltip>
			) : (
				<Tooltip
					text={__('Hide', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
						className='toolbar-item toolbar-item__toggle-block'
						onClick={() => {
							displayValue[
								breakpoint
							].display = getOptions().hide;
							onChange(JSON.stringify(displayValue));
						}}
					>
						<Icon
							className='toolbar-item__icon'
							icon={toolbarHide}
						/>
					</Button>
				</Tooltip>
			)}
		</Fragment>
	);
};

export default ToggleBlock;
