/**
 * WordPress dependencies
 */
const { dispatch } = wp.data;
const { Fragment, Component } = wp.element;
const { Icon, Button, Popover, withFocusOutside, Tooltip } = wp.components;

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
class ToolbarPopover extends Component {
	state = {
		isOpen: false,
	};

	onToggle() {
		const { isOpen } = this.state;

		this.setState({
			isOpen: !isOpen,
		});
	}

	handleFocusOutside() {
		this.setState({
			isOpen: false,
		});
	}

	render() {
		const {
			className,
			tooltip,
			icon,
			content,
			advancedOptions = false,
		} = this.props;

		const { isOpen } = this.state;

		const { openGeneralSidebar } = dispatch('core/edit-post');

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
						onClick={() => this.onToggle()}
						aria-expanded={isOpen}
						action='popup'
					>
						<Icon className='toolbar-item__icon' icon={icon} />
					</Button>
				</Tooltip>
				{isOpen && content && (
					<Popover
						className='toolbar-item__popover'
						noArrow={false}
						onFocusOutside={() => this.handleFocusOutside()}
						position='top center'
						isAlternate
						shouldAnchorIncludePadding
					>
						{content}
						{!!advancedOptions && (
							<Button
								className='toolbar-item__popover__advanced-button'
								icon={toolbarAdvancedSettings}
								onClick={() =>
									openGeneralSidebar(
										'edit-post/block'
									).then(() => openSidebar(advancedOptions))
								}
							/>
						)}
					</Popover>
				)}
			</Fragment>
		);
	}
}

export default withFocusOutside(ToolbarPopover);
