/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { className, attributes } = props;
	const { uniqueID, blockStyle, extraClassName } = attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-font-icon-block',
		blockStyle,
		getPaletteClasses(attributes, blockStyle, [
			'background',
			'background-hover',
			'border',
			'border-hover',
			'box-shadow',
			'box-shadow-hover',
			'icon',
		]),
		extraClassName,
		uniqueID,
		className
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
			{!isEmpty(attributes['icon-name']) && (
				<span className='maxi-font-icon-block__icon'>
					<i className={attributes['icon-name']} />
				</span>
			)}
		</div>
	);
};

export default save;
