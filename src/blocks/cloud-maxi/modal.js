/**
 * Layout modal window with tab panel.
 */

import { MaxiContext } from './provider';
import Iframe from 'react-iframe';

import CloudLibrary from '../../editor/library';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
const { Component, Fragment } = wp.element;
const { Button, Modal } = wp.components;

class MaxiModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			isOpen2: false,
			loadGlobalStyles: false,
		};
	}

	render() {
		const { className = '' } = this.props;

		const { isOpen, isOpen2 } = this.state;

		const onClick = () => {
			this.setState({ isOpen: !this.state.isOpen });
		};

		return (
			<Fragment
				key={`maxi-block-library__fragment--${this.props.clientId}`}
			>
				{/* Launch the layout modal window */}
				{/* <Button
					key={`maxi-block-library__modal-button--${this.props.clientId}`}
					isPrimary
					isLarge
					className='maxi-block-library__modal-button'
					onClick={onClick}
				>
					{__('Launch the Library', 'maxi-blocks')}
				</Button>
				{isOpen ? (
					<MaxiContext.Consumer
						key={`maxi-block-library__context-provider--${this.props.clientId}`}
					>
						{context => (
							<Modal
								key={`maxi-block-library__modal--${this.props.clientId}`}
								className='maxi-block-library__modal'
								title={__('Maxi Cloud Library', 'maxi-blocks')}
								shouldCloseOnEsc
								shouldCloseOnClickOutside={false}
								onRequestClose={onClick}
							>
								<Iframe
									url='https://ge-library.dev700.com/?_sft_gutenberg_type=block-patterns&_sft_light_or_dark=light'
									width='100%'
									height='90%'
									id='maxi-block-library__modal-iframe'
									className='maxi-block-library__modal-iframe'
									display='initial'
									position='relative'
								/>
								<Fragment>
									<div className='maxi-block-library__modal__loading_message maxi-block__item--hidden'>
										<p>Saving...</p>
									</div>
								</Fragment>
							</Modal>
						)}
					</MaxiContext.Consumer>
				) : null} */}
				<Fragment
					key={`maxi-block-library__fragment--${this.props.clientId}`}
				>
					{/* Launch the layout modal window */}
					<Button
						key={`maxi-block-library__modal-button--${this.props.clientId}`}
						isPrimary
						isLarge
						className='maxi-block-library__modal-button'
						onClick={() =>
							this.setState({ isOpen2: !this.state.isOpen2 })
						}
					>
						{__('Launch the Library', 'maxi-blocks')}
					</Button>
					{isOpen2 && (
						<CloudLibrary
							onClose={() => this.setState({ isOpen2: !isOpen2 })}
						/>
					)}
				</Fragment>
			</Fragment>
		);
	}
}
export default MaxiModal;
