/**
 * Internal dependencies
 */
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { videoValidation } from '../../extensions/video';

/**
 * Save
 */
const save = props => {
	const { isLightBox, embedUrl } = props.attributes;

	const name = 'maxi-blocks/video-maxi';

	return (
		<MaxiBlock.save {...getMaxiBlockAttributes({ ...props, name })}>
			{embedUrl &&
				videoValidation(embedUrl) &&
				(isLightBox ? (
					<div className='maxi-video-block__popup-wrapper'>
						<span className='maxi-video-block__close-button' />
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
