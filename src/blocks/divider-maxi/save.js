/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { attributes, className } = props;
	const {
		uniqueID,
		blockStyle,
		defaultBlockStyle,
		fullWidth,
		extraClassName,
		lineOrientation,
	} = attributes;

	const classes = classnames(
		`maxi-motion-effect`,
		'maxi-block maxi-divider-block',
		blockStyle,
		!!attributes['border-highlight'] && 'maxi-highlight--border',
		extraClassName,
		className,
		fullWidth === 'full' ? 'alignfull' : null,
		lineOrientation === 'vertical'
			? 'maxi-divider-block--vertical'
			: 'maxi-divider-block--horizontal'
	);

	return (
		<div
			className={classes}
			data-maxi_initial_block_class={defaultBlockStyle}
			id={uniqueID}
		>
			{!attributes['background-highlight'] && (
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
			)}
			{attributes['divider-border-style'] !== 'none' && (
				<Fragment>
					<hr className='maxi-divider-block__divider' />
				</Fragment>
			)}
		</div>
	);
};

export default save;
