/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;

/**
 * External dependencies
 */
import { isObject, isEmpty } from 'lodash';

/**
 * Icons & Styles
 */
import './editor.scss';
import { ToolbarHide, ToolbarShow } from '../../../../icons';

/**
 * Toggle Block
 */
const ToggleBlock = props => {
	const { display, breakpoint, onChange } = props;

	const displayValue = !isObject(display) ? JSON.parse(display) : display;

	return (
		<Tooltip
			text={__(
				isEmpty(displayValue[breakpoint].display) ? 'Hide' : 'Show',
				'maxi-blocks'
			)}
			position='bottom center'
		>
			<Button
				className='toolbar-item toolbar-item__toggle-block'
				onClick={() => {
					displayValue[breakpoint].display = isEmpty(
						displayValue[breakpoint].display
					)
						? 'none'
						: '';
					onChange(JSON.stringify(displayValue));
				}}
			>
				<Icon
					className='toolbar-item__icon'
					icon={
						isEmpty(displayValue[breakpoint].display)
							? ToolbarHide
							: ToolbarShow
					}
				/>
			</Button>
		</Tooltip>
	);
};

export default ToggleBlock;
