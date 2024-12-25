/**
 * Internal dependencies
 */
import { ArrowDisplayer, ShapeDivider } from '@components';
import { getGroupAttributes } from '@extensions/styles';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { uniqueID, ariaLabels = {} } = attributes;

	const name = 'maxi-blocks/container-maxi';

	return (
		<MaxiBlock.save
			tagName='section'
			{...getMaxiBlockAttributes({ ...props, name })}
			useInnerBlocks
			aria-label={ariaLabels?.container}
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
					aria-label={ariaLabels?.['top shape divider']}
				/>
			)}
			{attributes['shape-divider-bottom-status'] && (
				<ShapeDivider
					key={`maxi-shape-divider-bottom__${uniqueID}`}
					{...getGroupAttributes(attributes, 'shapeDivider')}
					location='bottom'
					aria-label={ariaLabels?.['bottom shape divider']}
					afterInnerProps
				/>
			)}
		</MaxiBlock.save>
	);
};

export default save;
