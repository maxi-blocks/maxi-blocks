/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { check, close } from '@wordpress/icons';
import { URLInput } from '@wordpress/block-editor';
import { isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Button from '@components/button';

/**
 * Styles and icons
 */
import { toolbarImageUrl } from '@maxi-icons';
import './editor.scss';

const ImageURL = props => {
	const { url, onChange, onSubmit } = props;
	const [expanded, setExpanded] = useState(false);
	const [hideWarning, setHideWarning] = useState(true);

	const buttonLabel = url
		? __('Change image URL', 'maxi-blocks')
		: __('Insert image from URL', 'maxi-blocks');

	const checkImageUrl = url => {
		const urlPromise = new Promise((resolve, reject) => {
			const img = new Image();
			img.src = url;

			img.addEventListener('load', function onLoad() {
				resolve(this);
			});

			img.addEventListener('error', function onError() {
				reject();
			});
		});
		return urlPromise;
	};

	const checkProtocol = url => {
		let newUrl = url;

		if (!url.startsWith('https://') && !url.startsWith('http://'))
			newUrl = `https://${url}`;

		return newUrl;
	};

	return (
		<div className='maxi-editor-url-input__button'>
			<Button
				icon={toolbarImageUrl}
				label={buttonLabel}
				onClick={event => {
					event.preventDefault();
					setExpanded(!expanded);
				}}
				className='maxi-editor-components-toolbar__control'
				isPressed={!!url}
			/>
			{expanded && (
				<form
					className='maxi-editor-url-input__button-modal'
					value={url || ''}
					onSubmit={event => {
						event.preventDefault();
						const checkedUrl = checkProtocol(url);
						if (isURL(checkedUrl)) {
							checkImageUrl(checkedUrl)
								.then(response => {
									setExpanded(!expanded);
									setHideWarning(true);
									onSubmit(checkedUrl);
								})
								.catch(err => setHideWarning(false));
						} else {
							setHideWarning(false);
						}
					}}
				>
					<div className='maxi-editor-url-input__button-modal-line'>
						<Button
							icon={check}
							label={__('Submit', 'maxi-blocks')}
							type='submit'
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
							className='maxi-editor-url-input__back'
							icon={close}
							label={__('Close', 'maxi-blocks')}
							onClick={event => {
								event.preventDefault();
								setHideWarning(true);
								setExpanded(!expanded);
							}}
						/>
					</div>
				</form>
			)}
			<p className='maxi-editor-url-input__warning' hidden={hideWarning}>
				{__(
					'Please input a valid URL to an image that exists',
					'maxi-blocks'
				)}
			</p>
		</div>
	);
};

export default ImageURL;
