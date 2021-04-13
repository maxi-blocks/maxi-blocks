/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes, className, clientId } = props;
	const {
		uniqueID,
		blockStyle,
		fullWidth,
		extraClassName,
		lineOrientation,
	} = attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-divider-block',
		blockStyle,
		getPaletteClasses(
			attributes,
			blockStyle,
			[
				'background',
				'background-hover',
				'divider',
				'divider-hover',
				'box-shadow',
				'box-shadow-hover',
			],
			'',
			clientId
		),
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null,
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal'
	);

	return (
		<div className={classes} id={uniqueID}>
			<BackgroundDisplayer
				{...getGroupAttributes(attributes, [
					'background',
					'backgroundColor',
					'backgroundGradient',
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
				])}
				blockClassName={uniqueID}
			/>
			{attributes['divider-border-style'] !== 'none' && (
				<Fragment>
					<hr className='maxi-divider-block__divider' />
				</Fragment>
			)}
		</div>
	);
};

export default save;
