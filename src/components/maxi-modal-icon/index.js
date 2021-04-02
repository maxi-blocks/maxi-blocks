/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
const { Button, Modal } = wp.components;

/**
 * External dependencies.
 */
import { MaxiContext } from './provider';
import Iframe from 'react-iframe';

const MaxiModalIcon = props => {
	const { clientId } = props;

	const [isOpen, setIsOpen] = useState(false);

	return (
		<Fragment key={`maxi-block-library__fragment--${clientId}`}>
			<Button
				key={`maxi-block-library__modal-button--${clientId}`}
				isPrimary
				isLarge
				className='maxi-block-library__modal-button'
				onClick={() => setIsOpen(!isOpen)}
			>
				{__('Launch the Library', 'maxi-blocks')}
			</Button>
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
							onRequestClose={setIsOpen(!isOpen)}
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
};

export default MaxiModalIcon;
