/**
 * Internal dependencies
 */
import { ArrowDisplayer, ShapeDivider } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Save
 */
const save = (props, extendedAttributes = {}) => {
	const { attributes } = props;
	const { uniqueID } = attributes;

	const name = 'maxi-blocks/container-maxi';

	return (
		<MaxiBlock.save
			tagName='section'
			{...getMaxiBlockAttributes({ ...props, name })}
			{...extendedAttributes}
			useInnerBlocks
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
		</MaxiBlock.save>
	);
};

export default save;
