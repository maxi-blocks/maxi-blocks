/**
 * Layout modal window with tab panel.
 */

import { MaxiContext } from './provider';
import Iframe from 'react-iframe';

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

		const { clientId } = this.props;

		const onClick = () => {
			this.setState({ isOpen: !isOpen });
		};

		return (
			<Fragment key={`maxi-block-library__fragment--${clientId}`}>
				<div className='maxi-svg-icon-block__placeholder'>
					<Button
						key={`maxi-block-library__modal-button--${clientId}`}
						className='maxi-block-library__modal-button'
						onClick={onClick}
					>
						{__('Select SVG Icon', 'maxi-blocks')}
					</Button>
				</div>
				{isOpen ? (
					<MaxiContext.Consumer
						key={`maxi-block-library__context-provider--${clientId}`}
					>
						{() => (
							<Modal
								key={`maxi-block-library__modal--${clientId}`}
								className='maxi-block-library__modal'
								title={__(
									'Maxi Cloud Icons Library',
									'maxi-blocks'
								)}
								shouldCloseOnEsc
								shouldCloseOnClickOutside={false}
								onRequestClose={onClick}
							>
								<Iframe
									url='https://ge-library.dev700.com/svg-search/'
									width='100%'
									height='90%'
									id='maxi-block-library__modal-iframe'
									className='maxi-block-library__modal-iframe'
									display='initial'
									position='relative'
								/>
								<Fragment>
									<div className='maxi-block-library__modal__loading_message maxi-block__item--hidden'>
										<p>{__('Saving...', 'maxi-blocks')}</p>
									</div>
								</Fragment>
							</Modal>
						)}
					</MaxiContext.Consumer>
				) : null}
			</Fragment>
		);
	}
}
export default MaxiModalIcon;
