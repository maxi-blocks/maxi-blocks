/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { Component, createRef } from '@wordpress/element';
import { Icon, Popover, Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import openSidebar from '../../../../extensions/dom';
import { toolbarAdvancedSettings } from '../../../../icons';
import ToolbarContext from './toolbarContext';

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
		onClose: () => {
			this.setState({ isOpen: false });
		},
	};

	constructor(...args) {
		super(...args);

		this.ref = createRef();
	}

	/**
	 * Ensures the popover closes when clicking outside
	 */
	onClickOutside() {
		if (
			this.ref.current.ownerDocument.querySelectorAll(
				'.toolbar-item__popover'
			).length >= 2
		)
			this.state.onClose();
	}

	onToggle() {
		const { isOpen } = this.state;
		const { defaultView: win } = this.ref.current.ownerDocument;

		if (!isOpen)
			win.addEventListener(
				'click',
				this.onClickOutside.bind(this),
				false
			);
		else
			win.removeEventListener(
				'click',
				this.onClickOutside.bind(this),
				false
			);

		this.setState({
			isOpen: !isOpen,
		});
	}

	render() {
		const {
			className,
			tooltip,
			icon,
			children,
			advancedOptions = false,
		} = this.props;

		const { isOpen, onClose } = this.state;

		const { openGeneralSidebar } = dispatch('core/edit-post');

		const classes = classnames(
			'toolbar-item',
			'toolbar-item__button',
			className
		);

		return (
			<div ref={this.ref}>
				<ToolbarContext.Provider value={{ isOpen, onClose }}>
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
					{isOpen && children && (
						<Popover
							className='toolbar-item__popover'
							noArrow={false}
							anchorRef={this.ref.current}
							onClose={onClose}
							position='top center'
							isAlternate
							shouldAnchorIncludePadding
						>
							<div>{children}</div>
							{!!advancedOptions && (
								<Button
									className='toolbar-item__popover__advanced-button'
									icon={toolbarAdvancedSettings}
									onClick={() =>
										openGeneralSidebar(
											'edit-post/block'
										).then(() =>
											openSidebar(advancedOptions)
										)
									}
								/>
							)}
						</Popover>
					)}
				</ToolbarContext.Provider>
			</div>
		);
	}
}

export default ToolbarPopover;
