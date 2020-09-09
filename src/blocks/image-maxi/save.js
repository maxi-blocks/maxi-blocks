/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

/**
 * Save
 */
const save = props => {
	const {
		className,
		attributes: {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			fullWidth,
			background,
			extraClassName,
			captionType,
			captionContent,
			mediaID,
			mediaURL,
			mediaWidth,
			mediaHeight,
			mediaALT,
			mediaALTwp,
			mediaALTtitle,
			altSelector,
			motion,
			hover,
		},
	} = props;

	const {
		settings: hoverSettings,
		titleText: hoverTitleText,
		contentText: hoverContentText,
		textPreset: hoverTextPreset,
	} = JSON.parse(hover);

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-image-block',
		blockStyle,
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null,
		!isNil(uniqueID) ? uniqueID : null
	);

	const imageALT = () => {
		switch (altSelector) {
			case 'wordpress':
				return mediaALTwp;
			case 'title':
				return mediaALTtitle;
			case 'custom':
				return mediaALT;
			default:
				return '';
		}
	};

	return (
		<figure
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			data-motion={motion}
			data-motion-id={uniqueID}
			data-hover={JSON.stringify(hoverSettings)}
		>
			<__experimentalBackgroundDisplayer background={background} />

			<div className='maxi-block-hover-element'>
				<div className='maxi-image-block__image-container'>
					<img
						className={`wp-image-${mediaID}`}
						src={mediaURL}
						width={mediaWidth}
						height={mediaHeight}
						alt={imageALT()}
					/>
					{captionType !== 'none' && (
						<figcaption>{captionContent}</figcaption>
					)}
				</div>
			</div>
			{hoverSettings.type !== 'none' && (
				<div className='maxi-hover-details'>
					<div
						className={`maxi-hover-details__content maxi-hover-details__content--${hoverTextPreset}`}
					>
						{!isEmpty(hoverTitleText) && <h3>{hoverTitleText}</h3>}
						{!isEmpty(hoverContentText) && (
							<p>{hoverContentText}</p>
						)}
					</div>
				</div>
			)}
		</figure>
	);
};

export default save;
