/**
 * WordPress dependencies
 */
import { RawHTML, useEffect, lazy, Suspense } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import MaxiBlock from '@components/maxi-block/maxiBlock';
import Toolbar from '@components/toolbar';
import Placeholder from '@components/placeholder';
import MaxiPopoverButton from '@components/maxi-popover-button';
import Button from '@components/button';
import ContentLoader from '@components/content-loader';
import getStyles from './styles';
import { getMaxiBlockAttributes } from '@components/maxi-block';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { getGroupAttributes } from '@extensions/styles';
import { videoValidation } from '@extensions/video';
import { copyPasteMapping } from './data';
import { placeholderImage, toolbarReplaceImage } from '@maxi-icons';
import withMaxiDC from '@extensions/DC/withMaxiDC';

/**
 * Video player
 */

const VideoPlayer = lazy(() => import('./video-player'));

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.state = {
			isUploaderOpen: false,
		};
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const response = {
			[uniqueID]: {
				...getGroupAttributes(attributes, 'video'),
			},
		};

		return response;
	}

	render() {
		const { attributes, isSelected, maxiSetAttributes } = this.props;
		const {
			uniqueID,
			embedUrl,
			playerType,
			'play-icon-content': playIcon,
			'overlay-mediaID': overlayMediaId,
			'overlay-mediaURL': overlayMediaUrl,
			'overlay-isImageUrl': overlayIsImageUrl,
			'overlay-isImageUrlInvalid': overlayIsImageUrlInvalid,
			'overlay-mediaAlt': overlayMediaAlt,
			'overlay-altSelector': altSelector,
			hideImage,
		} = attributes;

		const { isUploaderOpen } = this.state;

		const classes = classnames('maxi-video-block');

		const inlineStylesTargets = {
			playIcon: '.maxi-video-block__play-button svg path',
			overlay: '.maxi-video-block__overlay-background',
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				inlineStylesTargets={inlineStylesTargets}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
				backgroundAdvancedOptions='video overlay'
				backgroundPrefix='overlay-'
				mediaPrefix='overlay-'
			/>,
			playerType === 'popup' && (
				<MaxiPopoverButton
					key={`popover-${uniqueID}`}
					ref={this.blockRef}
					isOpen={isUploaderOpen}
					prefix='video-'
					isEmptyContent={!overlayMediaId}
					{...this.props}
				>
					<MediaUpload
						onSelect={val => {
							const alt =
								(altSelector === 'wordpress' && val?.alt) ||
								(altSelector === 'title' && val?.title) ||
								null;

							maxiSetAttributes({
								'overlay-mediaID': val.id,
								'overlay-mediaURL': val.url,
								'overlay-mediaAlt':
									altSelector === 'wordpress' && !alt
										? val.title
										: alt,
							});
						}}
						allowedTypes='image'
						render={({ open }) =>
							!hideImage && (
								<div className='maxi-video-block__settings maxi-settings-media-upload'>
									<Button
										className='maxi-video-block__settings__upload-button maxi-settings-media-upload__button'
										label={__(
											'Insert from Media Library',
											'maxi-blocks'
										)}
										showTooltip='true'
										onClick={() => {
											open();
											this.setState({
												isUploaderOpen: true,
											});
										}}
										icon={toolbarReplaceImage}
									/>
								</div>
							)
						}
						onClose={() => this.setState({ isUploaderOpen: false })}
					/>
				</MaxiPopoverButton>
			),
			<MaxiBlock
				key={`maxi-video--${uniqueID}`}
				className={classes}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
			>
				{embedUrl &&
					videoValidation(embedUrl) &&
					(playerType === 'popup' ? (
						<div className='maxi-video-block__overlay'>
							{!hideImage &&
								(overlayMediaUrl &&
								((overlayIsImageUrl &&
									!overlayIsImageUrlInvalid) ||
									!isNil(overlayMediaId)) ? (
									<img
										className={`maxi-video-block__overlay-image wp-image-${overlayMediaId}`}
										src={overlayMediaUrl}
										alt={overlayMediaAlt}
									/>
								) : (
									<div className='maxi-video-block__placeholder'>
										<Placeholder
											icon={placeholderImage}
											label=''
										/>
									</div>
								))}
							<div className='maxi-video-block__overlay-background' />
							<div className='maxi-video-block__play-button'>
								<RawHTML>{playIcon}</RawHTML>
							</div>
						</div>
					) : isSelected ? (
						<Suspense fallback={<ContentLoader />}>
							<VideoPlayer
								{...attributes}
								isSelected={isSelected}
							/>
						</Suspense>
					) : (
						<div className='maxi-video-block__placeholder'>
							<ContentLoader />
							<div className='maxi-video-block__placeholder-text'>
								Select block to load video
							</div>
						</div>
					))}
			</MaxiBlock>,
		];
	}
}

export default withMaxiDC(withMaxiProps(edit));
