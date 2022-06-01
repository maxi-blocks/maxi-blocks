/**
 * WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { RawHTML, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getStyles from './styles';
import Inspector from './inspector';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar, Placeholder } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import { videoValidation } from '../../extensions/video';
// import copyPasteMapping from './copy-paste-mapping';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Icons
 */
import { placeholderImage } from '../../icons';

/**
 * Popup
 */

const VideoPopup = props => {
	const { 'close-icon-content': closeIcon, onClose } = props;

	return (
		<div className='maxi-video-block__popup-wrapper'>
			<div className='maxi-video-block__close-button' onClick={onClose}>
				<RawHTML>{closeIcon}</RawHTML>
			</div>
			<div className='maxi-video-block__iframe-container'>
				<VideoPlayer {...props} />
			</div>
		</div>
	);
};

/**
 * LightBox
 */

const VideoLightBox = props => {
	const { thumbnailId, thumbnailUrl, 'play-icon-content': playIcon } = props;

	const [showPopup, setShowPopup] = useState(false);

	return (
		<>
			{!isNil(thumbnailId) || thumbnailUrl ? (
				<img
					className={`maxi-video-block__thumbnail-image wp-image-${thumbnailId}`}
					src={thumbnailUrl}
					alt=''
				/>
			) : (
				<Placeholder icon={placeholderImage} />
			)}
			<div
				className='maxi-video-block__play-button'
				onClick={() => setShowPopup(true)}
			>
				<RawHTML>{playIcon}</RawHTML>
			</div>
			{showPopup && (
				<VideoPopup {...props} onClose={() => setShowPopup(false)} />
			)}
		</>
	);
};

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
	} = props;

	return videoType === 'direct' ? (
		<video
			src={embedUrl}
			className='maxi-video-block__video-player'
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
			title='video player'
			allowFullScreen
			allow='autoplay'
			src={embedUrl}
		/>
	);
};

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const response = {
			video: {
				[uniqueID]: {
					...getGroupAttributes(attributes, 'video'),
				},
			},
		};

		return response;
	}

	render() {
		const { attributes, isSelected } = this.props;
		const { blockFullWidth, fullWidth, uniqueID, embedUrl, isLightbox } =
			attributes;

		const classes = classnames(
			'maxi-video-block',
			fullWidth === 'full' && 'alignfull'
		);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				// copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-video--${uniqueID}`}
				blockFullWidth={blockFullWidth}
				className={classes}
				{...getMaxiBlockAttributes(this.props)}
			>
				{embedUrl && videoValidation(embedUrl) ? (
					isLightbox ? (
						<VideoLightBox {...attributes} />
					) : (
						<>
							<VideoPlayer {...attributes} />
							{!isSelected && (
								<div className='maxi-video-block__overlay' />
							)}
						</>
					)
				) : (
					<div className='maxi-video-block__placeholder'>
						<Placeholder icon={placeholderImage} />
					</div>
				)}
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
