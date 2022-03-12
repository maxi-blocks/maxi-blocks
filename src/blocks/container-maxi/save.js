/**
 * Internal dependencies
 */
import { ArrowDisplayer, ShapeDivider } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock from '../../components/maxi-block';
import { getMaxiBlockAttributes } from '../../extensions/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { fullWidth, uniqueID } = attributes;

	const name = 'maxi-blocks/container-maxi';

	const classes = classnames(fullWidth === 'full' ? 'alignfull' : null);

	return (
		<MaxiBlock
			tagName='section'
			classes={classes}
			{...getMaxiBlockAttributes({ ...props, name })}
			isSave
			hasInnerBlocks
		>
			<ArrowDisplayer
				key={`maxi-arrow-displayer__${uniqueID}`}
				{...getGroupAttributes(
					attributes,
					['blockBackground', 'arrow', 'border'],
					true
				)}
			/>
			{attributes['shape-divider-top-status'] && (
				<ShapeDivider
					key={`maxi-shape-divider-top__${uniqueID}`}
					{...getGroupAttributes(attributes, 'shapeDivider')}
					location='top'
				/>
			)}
			{attributes['shape-divider-bottom-status'] && (
				<ShapeDivider
					key={`maxi-shape-divider-bottom__${uniqueID}`}
					{...getGroupAttributes(attributes, 'shapeDivider')}
					location='bottom'
					afterInnerProps
				/>
			)}
		</MaxiBlock>
	);
};

export default save;
