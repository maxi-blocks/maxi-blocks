/**
 * Layout modal window with tab panel.
 */

import CloudLibrary from '.';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Icons.
 */
import { SCaddMore } from '../../icons';

/**
 * Internal dependencies
 */

import { Icon } from '../../components';

class MaxiModal extends Component {
	state = {
		isOpen: false,
	};

	render() {
		const { isOpen } = this.state;

		return (
			<>
				{/* Launch the layout modal window */}
				{this.props.type === 'patterns' && (
					<Button
						key={`maxi-block-library__modal-button--${this.props.clientId}`}
						isPrimary
						className='maxi-block-library__modal-button'
						onClick={() => this.setState({ isOpen: !isOpen })}
					>
						{__('Launch the Library', 'maxi-blocks')}
					</Button>
				)}
				{this.props.type === 'sc' && (
					<Button
						className='maxi-style-cards__sc__more-sc--add-more'
						onClick={() => this.setState({ isOpen: !isOpen })}
					>
						<Icon icon={SCaddMore} />
					</Button>
				)}
				{isOpen && (
					<CloudLibrary
						cloudType={this.props.type}
						onClose={() => this.setState({ isOpen: !isOpen })}
					/>
				)}
			</>
		);
	}
}
export default MaxiModal;
