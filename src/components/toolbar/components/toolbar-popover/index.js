/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, createRef } from '@wordpress/element';
import { Popover, Tooltip } from '@wordpress/components';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import { openSidebarAccordion } from '../../../../extensions/inspector';
import { toolbarAdvancedSettings } from '../../../../icons';
import ToolbarContext from './toolbarContext';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNaN } from 'lodash';

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

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	/**
	 * Ensures the popover closes when clicking outside
	 */
	onClickOutside(event) {
		const path = event.path || (event.composedPath && event.composedPath());
		if (
			this.mounted &&
			(this.ref.current?.ownerDocument.querySelectorAll(
				'.toolbar-item__popover'
			).length >= 2 ||
				// If the click isn't inside the popover and isn't inside the button
				(path &&
					!path.includes(
						this.ref.current?.ownerDocument.querySelector(
							'.toolbar-item__popover'
						)
					) &&
					!path.includes(this.ref.current)))
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
			text,
			className,
			tooltip,
			icon,
			children,
			advancedOptions = false,
			tab = 0,
			position = 'top center',
			disabled = false,
		} = this.props;

		const { isOpen, onClose } = this.state;

		const classes = classnames(
			'toolbar-item',
			'toolbar-item__button',
			className
		);

		const { receiveMaxiSettings } = select('maxiBlocks');

		const { hide_tooltips: hideTooltips, editor } = receiveMaxiSettings();
		const tooltipsHide = !isEmpty(hideTooltips) ? hideTooltips : false;

		const buttonContent = () => {
			return (
				<Button
					className={classes}
					onClick={() => this.onToggle()}
					aria-expanded={isOpen}
					action='popup'
					disabled={disabled}
				>
					<Icon className='toolbar-item__icon' icon={icon} />
					{__(text, 'maxi-blocks')}
				</Button>
			);
		};

		const popoverProps = {
			...((parseFloat(editor?.version) <= 13.0 && {
				noArrow: false,
				anchorRef: this.ref?.current?.closest('.toolbar-wrapper'),
				shouldAnchorIncludePadding: true,
			}) ||
				(!isNaN(parseFloat(editor?.version)) && {
					noArrow: false,
					anchor: this.ref?.current?.closest('.toolbar-wrapper'),
					flip: false,
					resize: false,
					variant: 'unstyled',
				})),
		};

		return (
			<div ref={this.ref}>
				<ToolbarContext.Provider value={{ isOpen, onClose }}>
					{!tooltipsHide && (
						<Tooltip text={tooltip} position='top center'>
							{buttonContent()}
						</Tooltip>
					)}
					{tooltipsHide && buttonContent()}
					{isOpen && children && (
						<Popover
							className='toolbar-item__popover'
							onClose={onClose}
							position={position}
							isAlternate
							{...popoverProps}
						>
							<div>{children}</div>
							{!!advancedOptions && (
								<Button
									className='toolbar-item__popover__advanced-button'
									icon={toolbarAdvancedSettings}
									onClick={() => {
										openSidebarAccordion(
											tab,
											advancedOptions
										);
									}}
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
