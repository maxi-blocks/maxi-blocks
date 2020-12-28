/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Icon, Button, Tooltip } = wp.components;

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

		if (isPrevHide) return { show: defaultDisplay, hide: 'none' };
		return { show: '', hide: 'none' };
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
							? (display[breakpoint].display = getOptions().show)
							: (display[breakpoint].display = getOptions().hide);
						onChange(display);
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
