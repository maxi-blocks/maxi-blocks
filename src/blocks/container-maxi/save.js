/**
 * Internal dependencies
 */
import { ArrowDisplayer, ShapeDivider } from '../../components';
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID, shapeDividerTopStatus, shapeDividerBottomStatus } =
		getAttributesValue({
			target: [
				'_uid',
				'_ioh',
				'shape-divider-top-status',
				'shape-divider-bottom-status',
			],
			props: attributes,
		});

	const name = 'maxi-blocks/container-maxi';

	return (
		<MaxiBlock.save
			tagName='section'
			{...getMaxiBlockAttributes({ ...props, name })}
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
			{shapeDividerTopStatus && (
				<ShapeDivider
					key={`maxi-shape-divider-top__${uniqueID}`}
					{...getGroupAttributes(attributes, 'shapeDivider')}
					location='top'
				/>
			)}
			{shapeDividerBottomStatus && (
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
