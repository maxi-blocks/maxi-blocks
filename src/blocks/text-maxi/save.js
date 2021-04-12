/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';
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
	const { className, attributes, clientId } = props;
	const {
		uniqueID,
		blockStyle,
		defaultBlockStyle,
		fullWidth,
		extraClassName,
		textLevel,
		isList,
		typeOfList,
		content,
	} = attributes;

	const classes = classnames(
		'maxi-motion-effect',
		'maxi-block maxi-text-block',
		'maxi-text-block-wrap',
		blockStyle,
		getPaletteClasses(
			attributes,
			blockStyle,
			[
				'background',
				'background-hover',
				'border',
				'border-hover',
				'box-shadow',
				'box-shadow-hover',
				'typography',
				'typography-hover',
			],
			'maxi-blocks/text-maxi',
			clientId,
			textLevel
		),
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null
	);

	return (
		<Fragment>
			<div className={classes} id={uniqueID}>
				<BackgroundDisplayer
					{...getGroupAttributes(attributes, [
						'background',
						'backgroundColor',
						'backgroundImage',
						'backgroundVideo',
						'backgroundGradient',
						'backgroundSVG',
						'backgroundHover',
						'backgroundColorHover',
						'backgroundImageHover',
						'backgroundVideoHover',
						'backgroundGradientHover',
						'backgroundSVGHover',
					])}
					blockClassName={uniqueID}
				/>
				<RichText.Content
					className='maxi-text-block__content'
					value={content}
					tagName={isList ? typeOfList : textLevel}
					data-gx_initial_block_class={defaultBlockStyle}
				/>
			</div>
		</Fragment>
	);
};

export default save;
