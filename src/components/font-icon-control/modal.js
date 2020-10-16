/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { Button, Modal } = wp.components;

class MaxiModalIcon extends Component {
	state = {
		isOpen: false,
	};

	render() {
		const { isOpen } = this.state;

		const onClick = () => {
			this.setState({ isOpen: !isOpen });
		};

		const { icon } = this.props;

		return (
			<Fragment>
				{/* Launch the layout modal window */}
				<Button onClick={onClick}>
					{__('Choose an icon', 'maxi-blocks')}
				</Button>
				{isOpen && (
					<Modal
						className='maxi-font-icon-control__modal'
						title={__('Maxi Font Icons', 'maxi-blocks')}
						shouldCloseOnEsc
						shouldCloseOnClickOutside={false}
						onRequestClose={onClick}
					>
						<div className='maxi-font-icon-control__main-content'>
							<div className='maxi-font-icon-control__categories'>
								<ul>
									<li>Font-Awesome - Regular</li>
									<li>Font-Awesome - Solid</li>
									<li>Font-Awesome - Brands</li>
								</ul>
							</div>
							<div className='maxi-font-icon-control__icons' />
						</div>
					</Modal>
				)}
			</Fragment>
		);
	} // render END
} // class MaxiModal END
export default MaxiModalIcon;
