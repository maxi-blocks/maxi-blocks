/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { link, keyboardReturn, arrowLeft } from '@wordpress/icons';
import { URLInput } from '@wordpress/block-editor';

class ImageURL extends Component {
	constructor() {
		// eslint-disable-next-line prefer-rest-params
		super(...arguments);
		this.toggle = this.toggle.bind(this);
		this.submitLink = this.submitLink.bind(this);
		this.state = {
			expanded: false,
		};
	}

	toggle() {
		this.setState(prevState => ({ expanded: !prevState.expanded }));
	}

	submitLink(event) {
		event.preventDefault();
		this.toggle();
	}

	render() {
		const { url, onChange } = this.props;
		const { expanded } = this.state;
		const buttonLabel = url
			? __('Change image URL', 'maxi-blocks')
			: __('Insert image from URL', 'maxi-blocks');

		return (
			<div className='block-editor-url-input__button maxi-blocks-url__button'>
				<Button
					icon={link}
					label={buttonLabel}
					onClick={this.toggle}
					className='components-toolbar__control'
					isPressed={!!url}
				/>
				{expanded && (
					<form
						className='block-editor-url-input__button-modal'
						onSubmit={this.submitLink}
					>
						<div className='block-editor-url-input__button-modal-line'>
							<Button
								className='block-editor-url-input__back'
								icon={arrowLeft}
								label={__('Close')}
								onClick={this.toggle}
							/>
							<URLInput
								value={url || ''}
								onChange={onChange}
								placeholder={__(
									'Paste a direct URL to the Image',
									'maxi-blocks'
								)}
								disableSuggestions
							/>
							<Button
								icon={keyboardReturn}
								label={__('Submit')}
								type='submit'
							/>
						</div>
					</form>
				)}
			</div>
		);
	}
}

export default ImageURL;
