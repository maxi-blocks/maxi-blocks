/**
 * Internal dependencies
 */
import { __experimentalBackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

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
			hover,
		},
	} = props;

	const hoverClasses = classnames(
		'maxi-block-hover-wrapper',
		hover.type === 'basic'
			? `maxi-hover-effect__${hover.type}__${hover.basicEffectType}`
			: `maxi-hover-effect__${hover.type}__${hover.textEffectType}`,
		`maxi-hover-effect__${hover.type === 'basic' ? 'basic' : 'text'}`
	);

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-image-block',
		fullWidth === 'full' ? 'alignfull' : null,
		uniqueID,
		blockStyle,
		extraClassName,
		className
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
				{hover.type === 'text' && hover.textEffectType !== 'none' && (
					<div className='maxi-hover-details'>
						<div
							className={`maxi-hover-details__content maxi-hover-details__content--${hover.textPreset}`}
						>
							{!isEmpty(hover.titleText) && (
								<h3>{hover.titleText}</h3>
							)}
							{!isEmpty(hover.contentText) && (
								<p>{hover.contentText}</p>
							)}
						</div>
					</div>
				)}
			</div>
		</figure>
	);
};

export default save;
