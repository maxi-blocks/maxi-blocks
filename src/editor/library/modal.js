/**
 * Layout modal window with tab panel.
 */

import CloudLibrary from '.';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Icons.
 */
import { SCaddMore, toolbarReplaceImage } from '../../icons';

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

		const { type, clientId, empty } = this.props;

		return (
			<>
				{/* Launch the layout modal window */}
				{type === 'patterns' && (
					<Button
						key={`maxi-block-library__modal-button--${clientId}`}
						isPrimary
						className='maxi-block-library__modal-button'
						onClick={() => this.setState({ isOpen: !isOpen })}
					>
						{__('Launch the Library', 'maxi-blocks')}
					</Button>
				)}
				{type === 'sc' && (
					<Button
						className='maxi-style-cards__sc__more-sc--add-more'
						onClick={() => this.setState({ isOpen: !isOpen })}
					>
						<Icon icon={SCaddMore} />
					</Button>
				)}
				{type === 'svg' && empty && (
					<>
						<div className='maxi-svg-icon-block__placeholder'>
							<Button
								isPrimary
								key={`maxi-block-library__modal-button--${clientId}`}
								className='maxi-block-library__modal-button'
								onClick={() =>
									this.setState({ isOpen: !isOpen })
								}
							>
								{__('Select SVG Icon', 'maxi-blocks')}
							</Button>
						</div>
					</>
				)}
				{type === 'svg' && !empty && (
					<Button
						className='maxi-svg-icon-block__replace-icon'
						onClick={() => this.setState({ isOpen: !isOpen })}
						icon={toolbarReplaceImage}
					/>
				)}
				{isOpen && (
					<CloudLibrary
						cloudType={type}
						onClose={() => this.setState({ isOpen: !isOpen })}
					/>
				)}
			</>
		);
	}
}
export default MaxiModal;
