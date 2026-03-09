/**
 * WordPress dependencies
 */
import { RawHTML, useEffect, useRef } from '@wordpress/element';
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

const VideoPlayer = props => {
	const {
		videoType,
		embedUrl,
		isLoop,
		isAutoplay,
		isMuted,
		showPlayerControls,
		isSelected,
		uniqueID,
		startTime,
		endTime,
	} = props;

	const playerID = `${uniqueID}-player`;
	const playerRef = useRef(null);
	const startTimeRef = useRef(startTime);
	const endTimeRef = useRef(endTime);
	const isLoopRef = useRef(isLoop);

	useEffect(() => {
		startTimeRef.current = startTime;
		endTimeRef.current = endTime;
		isLoopRef.current = isLoop;
	}, [startTime, endTime, isLoop]);

	const handleStateChange = state => {
		if (state.data === 0 && isLoopRef.current && playerRef.current) {
			playerRef.current.seekTo(startTimeRef.current || 0);
		}
	};

	const handleYoutubeVideo = () => {
		playerRef.current = new window.YT.Player(playerID, {
			events: {
				onStateChange: handleStateChange,
			},
		});
	};

	const handleVimeoVideo = () => {
		const playerElement = document.getElementById(playerID);
		playerRef.current = new window.Vimeo.Player(playerElement);
		playerRef.current.on('timeupdate', data => {
			if (data.seconds > +endTimeRef.current) {
				if (isLoopRef.current)
					playerRef.current.setCurrentTime(
						startTimeRef.current || '0'
					);
				else playerRef.current.pause();
			}
		});
	};

	useEffect(() => {
		if (videoType === 'youtube') {
			if (!window.YT) {
				const script = document.createElement('script');
				script.src = 'https://www.youtube.com/iframe_api';
				script.id = 'maxi-youtube-sdk';
				window.onYouTubeIframeAPIReady = handleYoutubeVideo; // This function will be called once the API is ready
				document.body.appendChild(script);
			} else if (window.YT && window.YT.Player) {
				// Make sure YT.Player is defined
				handleYoutubeVideo();
			}
		} else if (videoType === 'vimeo') {
			if (!window.Vimeo) {
				const script = document.createElement('script');
				script.src = 'https://player.vimeo.com/api/player.js';
				script.id = 'maxi-vimeo-sdk';
				script.async = true;
				script.onload = () => {
					script.onload = null;
					handleVimeoVideo();
				};
				document.body.appendChild(script);
			} else {
				handleVimeoVideo();
			}
		}
	}, [videoType, playerID]);

	return (
		<div className='maxi-video-block__video-container'>
			{videoType === 'direct' ? (
				<video
					src={embedUrl}
					className='maxi-video-block__video-player'
					id={playerID}
					loop={isLoop}
					muted={isMuted}
					autoPlay={isAutoplay}
					controls={showPlayerControls}
				>
					<track kind='captions' />
				</video>
			) : (
				<iframe
					className='maxi-video-block__video-player'
					id={playerID}
					title='video player'
					allowFullScreen
					allow='autoplay'
					src={embedUrl}
				/>
			)}
			{!isSelected && (
				<div className='maxi-video-block__select-overlay' />
			)}
		</div>
	);
};

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
					) : (
						<VideoPlayer {...attributes} isSelected={isSelected} />
					))}
			</MaxiBlock>,
		];
	}
}

export default withMaxiDC(withMaxiProps(edit));
