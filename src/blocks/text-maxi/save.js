/**
 * WordPress dependencies
 */
const { RichText } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { BackgroundDisplayer } from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

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
			textLevel,
			isList,
			typeOfList,
			content,
		},
	} = props;

	const highlight = { ...props.attributes.highlight };
	const { textHighlight, backgroundHighlight, borderHighlight } = highlight;

	const classes = classnames(
		`maxi-motion-effect maxi-motion-effect-${uniqueID}`,
		'maxi-block maxi-text-block',
		'maxi-text-block-wrap',
		blockStyle,
		!!textHighlight && 'maxi-highlight--text',
		!!backgroundHighlight && 'maxi-highlight--background',
		!!borderHighlight && 'maxi-highlight--border',
		extraClassName,
		uniqueID,
		className,
		fullWidth === 'full' ? 'alignfull' : null,
		!isNil(uniqueID) ? uniqueID : null
	);

	return (
		<Fragment>
			<div className={classes} data-motion-id={uniqueID}>
				<BackgroundDisplayer background={background} />
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
