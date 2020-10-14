/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty, isObject } from 'lodash';

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
			mediaAlt,
			mediaAltWp,
			mediaAltTitle,
			altSelector,
			motion,
			hover,
		},
	} = props;

	const hoverValue = !isObject(hover) ? JSON.parse(hover) : hover;

	const hoverClasses = classnames(
		'maxi-block-hover-wrapper',
		hoverValue.type === 'basic'
			? `maxi-hover-effect__${hoverValue.type}__${hoverValue.basicEffectType}`
			: `maxi-hover-effect__${hoverValue.type}__${hoverValue.textEffectType}`,
		`maxi-hover-effect__${hoverValue.type === 'basic' ? 'basic' : 'text'}`
	);

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

	const imageAlt = () => {
		switch (altSelector) {
			case 'wordpress':
				return mediaAltWp;
			case 'title':
				return mediaAltTitle;
			case 'custom':
				return mediaAlt;
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
		>
			<__experimentalBackgroundDisplayer background={background} />

			<div className={hoverClasses}>
				<img
					className={`wp-image-${mediaID}`}
					src={mediaURL}
					width={mediaWidth}
					height={mediaHeight}
					alt={imageAlt()}
				/>
				{captionType !== 'none' && (
					<figcaption className='maxi-image-block__caption'>
						{captionContent}
					</figcaption>
				)}
				{hoverValue.type !== 'none' &&
					hoverValue.type !== 'basic' &&
					hoverValue.textEffectType !== 'none' && (
						<div className='maxi-hover-details'>
							<div
								className={`maxi-hover-details__content maxi-hover-details__content--${hoverValue.textPreset}`}
							>
								{!isEmpty(hoverValue.titleText) && (
									<h3>{hoverValue.titleText}</h3>
								)}
								{!isEmpty(hoverValue.contentText) && (
									<p>{hoverValue.contentText}</p>
								)}
							</div>
						</div>
					)}
			</div>
		</figure>
	);
};

export default save;
