/**
 * WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getStyles from './styles';
import Inspector from './inspector';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import { videoValidation } from '../../extensions/video';
import copyPasteMapping from './copy-paste-mapping';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
	} = props;

	return (
		<>
			{videoType === 'direct' ? (
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
			)}
			{!isSelected && (
				<div className='maxi-video-block__select-overlay' />
			)}
		</>
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
		const {
			blockFullWidth,
			fullWidth,
			uniqueID,
			embedUrl,
			playerType,
			'play-icon-content': playIcon,
		} = attributes;

		const classes = classnames(
			'maxi-video-block',
			fullWidth === 'full' && 'alignfull'
		);

		const inlineStylesTargets = {
			playIcon: '.maxi-video-block__play-button svg path',
			overlay: '.maxi-video-block__overlay',
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
			/>,
			<MaxiBlock
				key={`maxi-video--${uniqueID}`}
				blockFullWidth={blockFullWidth}
				className={classes}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
			>
				{embedUrl &&
					videoValidation(embedUrl) &&
					(playerType === 'popup' ? (
						<>
							<div className='maxi-video-block__overlay' />
							<div className='maxi-video-block__play-button'>
								<RawHTML>{playIcon}</RawHTML>
							</div>
						</>
					) : (
						<VideoPlayer {...attributes} isSelected={isSelected} />
					))}
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
