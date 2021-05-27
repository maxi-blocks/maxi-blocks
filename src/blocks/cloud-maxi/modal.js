/**
 * Layout modal window with tab panel.
 */

import CloudLibrary from '../../editor/library';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

import { Component, Fragment } from '@wordpress/element';
import { Button } from '@wordpress/components';

class MaxiModal extends Component {
	state = {
		isOpen: false,
		loadGlobalStyles: false,
	};

	render() {
		const { isOpen } = this.state;

		return (
			<Fragment
				key={`maxi-block-library__fragment--${this.props.clientId}`}
			>
				<Fragment
					key={`maxi-block-library__fragment--${this.props.clientId}`}
				>
					{/* Launch the layout modal window */}
					<Button
						key={`maxi-block-library__modal-button--${this.props.clientId}`}
						isPrimary
						isLarge
						className='maxi-block-library__modal-button'
						onClick={() => this.setState({ isOpen: !isOpen })}
					>
						{__('Launch the Library', 'maxi-blocks')}
					</Button>
					{isOpen && (
						<CloudLibrary
							cloudType='patterns'
							onClose={() => this.setState({ isOpen: !isOpen })}
						/>
					)}
				</Fragment>
			</Fragment>
		);
	}
}
export default MaxiModal;
