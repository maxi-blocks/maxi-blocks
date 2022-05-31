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
 * Video popup
 */

const VideoPopup = props => {
	const { attributes, onClose } = props;
	const { embedUrl, 'close-icon-content': closeIcon } = attributes;

	return (
		<div className='maxi-video-block__popup-wrapper'>
			{/* <span
				className='maxi-video-block__close-button'
				onClick={onClose}
			/> */}
			<div className='maxi-video-block__close-button' onClick={onClose}>
				<RawHTML>{closeIcon}</RawHTML>
			</div>
			<div className='maxi-video-block__iframe-container'>
				<iframe
					className='maxi-video-block__video-player'
					title='video player'
					allowFullScreen
					allow='autoplay'
					src={embedUrl}
				/>
			</div>
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
			showPopup: false,
		};
	}

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
			isLightbox,
			thumbnailId,
			thumbnailUrl,
		} = attributes;

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
						<>
							<div className='maxi-video-block__thumbnail'>
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
									onClick={() =>
										this.setState({ showPopup: true })
									}
								/>
							</div>
							{this.state.showPopup && (
								<VideoPopup
									{...this.props}
									onClose={() =>
										this.setState({ showPopup: false })
									}
								/>
							)}
						</>
					) : (
						<>
							<iframe
								className='maxi-video-block__video-player'
								title='video player'
								allowFullScreen
								allow='autoplay'
								src={embedUrl}
							/>
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
