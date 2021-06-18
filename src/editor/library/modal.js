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
		isOpen: this.props.openFirstTime,
	};

	render() {
		const { isOpen } = this.state;

		const { type, clientId, empty } = this.props;

		const onClick = () => {
			this.setState({
				isOpen: !isOpen,
			});
			wp.data
				.dispatch('core/block-editor')
				.updateBlockAttributes(clientId, {
					openFirstTime: !isOpen,
				});
		};

		return (
			<>
				{/* Launch the layout modal window */}
				{type === 'patterns' && (
					<Button
						key={`maxi-block-library__modal-button--${clientId}`}
						isPrimary
						className='maxi-block-library__modal-button'
						onClick={onClick}
					>
						{__('Launch the Library', 'maxi-blocks')}
					</Button>
				)}
				{type === 'sc' && (
					<Button
						className='maxi-style-cards__sc__more-sc--add-more'
						onClick={onClick}
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
								onClick={onClick}
							>
								{__('Select SVG Icon', 'maxi-blocks')}
							</Button>
						</div>
					</>
				)}
				{type === 'svg' && !empty && (
					<Button
						className='maxi-svg-icon-block__replace-icon'
						onClick={onClick}
						icon={toolbarReplaceImage}
					/>
				)}
				{type === 'shape' && (
					<Button
						className='maxi-svg-defaults__load-library'
						onClick={onClick}
					>
						{__('Load Shape Library', 'maxi-blocks')}
					</Button>
				)}
				{isOpen && <CloudLibrary cloudType={type} onClose={onClick} />}
			</>
		);
	}
}
export default MaxiModal;
