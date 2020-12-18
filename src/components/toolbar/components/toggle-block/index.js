/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';

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

	const display = { ...props.display };

	return (
		<Fragment>
			{getLastBreakpointValue(display, 'display', breakpoint) ===
			'none' ? (
				<Tooltip
					text={__('Show', 'maxi-blocks')}
					position='bottom center'
				>
					<Button
						className='toolbar-item toolbar-item__toggle-block'
						onClick={() => {
							display[breakpoint].display = defaultDisplay;
							onChange(display);
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
							display[breakpoint].display = 'none';
							onChange(display);
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
