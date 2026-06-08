/**
 * External dependencies
 */
import classnames from 'classnames';

export const getImageResizerClassName = captionType =>
	classnames(
		'maxi-image-block__resizer',
		captionType &&
			captionType !== 'none' &&
			'maxi-image-block__resizer--has-caption'
	);
