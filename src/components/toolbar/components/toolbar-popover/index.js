/**
 * WordPress dependencies
 */
const { useDispatch } = wp.data;
const { Fragment, useState } = wp.element;
const {
	Button,
	Icon,
	IconButton,
	Popover,
	withFocusOutside,
	Tooltip,
} = wp.components;

/**
 * Internal dependencies
 */
import openSidebar from '../../../../extensions/dom';
import { toolbarAdvancedSettings } from '../../../../icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */

const ToolbarPopover = props => {
	const {
		className,
		tooltip,
		icon,
		content,
		advancedOptions = false,
	} = props;

	const [isOpen, setIsOpen] = useState(false);

	const { openGeneralSidebar } = useDispatch('core/edit-post');

	const classes = classnames(
		'toolbar-item',
		'toolbar-item__button',
		className
	);

	return (
		<Fragment>
			<Tooltip text={tooltip} position='bottom center'>
				<Button
					className={classes}
					onClick={() => setIsOpen(!isOpen)}
					aria-expanded={false}
					action='popup'
				>
					<Icon className='toolbar-item__icon' icon={icon} />
				</Button>
			</Tooltip>
			{isOpen && content && (
				<Popover
					className='toolbar-item__popover'
					noArrow={false}
					position='top center'
					focusOnMount
					isAlternate
					shouldAnchorIncludePadding
				>
					{content}
					{!!advancedOptions && (
						<IconButton
							className='toolbar-item__popover__advanced-button'
							icon={toolbarAdvancedSettings}
							onClick={() =>
								openGeneralSidebar('edit-post/block').then(() =>
									openSidebar(advancedOptions)
								)
							}
						/>
					)}
				</Popover>
			)}
		</Fragment>
	);
};

export default withFocusOutside(ToolbarPopover);
