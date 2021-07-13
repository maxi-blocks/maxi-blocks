/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { link, check, arrowLeft } from '@wordpress/icons';
import { URLInput } from '@wordpress/block-editor';
import { isURL } from '@wordpress/url';

/**
 * Styles and icons
 */
import './editor.scss';

class ImageURL extends Component {
	constructor(...args) {
		super(...args);
		this.toggle = this.toggle.bind(this);
		this.submitLink = this.submitLink.bind(this);
		this.state = {
			expanded: false,
			hideWarning: true,
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
		const { url, onChange, onSubmit } = this.props;
		const { expanded, hideWarning } = this.state;

		const buttonLabel = url
			? __('Change image URL', 'maxi-blocks')
			: __('Insert image from URL', 'maxi-blocks');

		return (
			<div className='maxi-editor-url-input__button'>
				<Button
					icon={link}
					label={buttonLabel}
					onClick={this.toggle}
					className='maxi-editor-components-toolbar__control'
					isPressed={!!url}
				/>
				{expanded && (
					<form
						className='maxi-editor-url-input__button-modal'
						value={url || ''}
						onSubmit={event => {
							if (isURL(url)) {
								this.submitLink(event);
								this.setState({ hideWarning: true });
								onSubmit(url);
							} else {
								event.preventDefault();
								this.setState({ hideWarning: false });
							}
						}}
					>
						<div className='maxi-editor-url-input__button-modal-line'>
							<Button
								className='maxi-editor-url-input__back'
								icon={arrowLeft}
								label={__('Close')}
								onClick={this.toggle}
							/>
							<URLInput
								value={url || ''}
								onChange={onChange}
								placeholder={__(
									'Paste or input a direct URL to the Image',
									'maxi-blocks'
								)}
								type='url'
								disableSuggestions
							/>
							<Button
								icon={check}
								label={__('Submit')}
								type='submit'
							/>
						</div>
					</form>
				)}
				<p
					className='maxi-editor-url-input__warning'
					hidden={hideWarning}
				>
					{__('Please input a valid URL', 'maxi-blocks')}
				</p>
			</div>
		);
	}
}

export default ImageURL;
