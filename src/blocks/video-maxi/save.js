/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { videoValidation } from '../../extensions/video';

/**
 * Save
 */
const save = props => {
	const {
		isLightbox,
		embedUrl,
		'close-icon-content': closeIcon,
	} = props.attributes;

	const name = 'maxi-blocks/video-maxi';

	return (
		<MaxiBlock.save {...getMaxiBlockAttributes({ ...props, name })}>
			{embedUrl &&
				videoValidation(embedUrl) &&
				(isLightbox ? (
					<div
						className='maxi-video-block__popup-wrapper'
						style={{ display: 'none' }}
					>
						<div className='maxi-video-block__close-button'>
							<RawHTML>{closeIcon}</RawHTML>
						</div>
						<div className='maxi-video-block__iframe-container'>
							<iframe
								className='maxi-video-block__video-player'
								title='video player'
								allowFullScreen
								allow='autoplay'
							/>
						</div>
					</div>
				) : (
					<iframe
						className='maxi-video-block__video-player'
						title='video player'
						allowFullScreen
						allow='autoplay'
					/>
				))}
		</MaxiBlock.save>
	);
};

export default save;
