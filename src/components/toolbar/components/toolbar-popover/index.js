/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { Component, createRef } from '@wordpress/element';
import {
	Icon,
	Button,
	Popover,
	withFocusOutside,
	Tooltip,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
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

	handleFocusOutside() {
		this.setState({
			isOpen: false,
		});
	}

	onToggle() {
		const { isOpen } = this.state;

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
						onFocusOutside={() => this.handleFocusOutside()}
						position='top center'
						isAlternate
						shouldAnchorIncludePadding
					>
						{children}
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
			</ToolbarContext.Provider>
		);
	}
}

export default withFocusOutside(ToolbarPopover);
