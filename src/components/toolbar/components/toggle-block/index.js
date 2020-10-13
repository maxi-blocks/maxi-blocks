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

	return (
		<Fragment>
			{getLastBreakpointValue(displayValue, 'display', breakpoint) ===
			'none' ? (
				<Tooltip
					text={__('Show', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
						className='toolbar-item toolbar-item__toggle-block'
						onClick={() => {
							displayValue[breakpoint].display = defaultDisplay;
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
							displayValue[breakpoint].display = 'none';
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
