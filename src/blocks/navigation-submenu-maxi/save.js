/**
 * Internal dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

/**
 * Save
 */
const save = props => {
	const { label } = props.attributes;

	const name = 'maxi-blocks/navigation-submenu-maxi';

	return (
		<MaxiBlock.save {...getMaxiBlockAttributes({ ...props, name })}>
			<RichText.Content value={label} tagName='a' />
			<ul
				{...useInnerBlocksProps.save({
					className: 'maxi-navigation-submenu-block__dropdown',
				})}
			/>
		</MaxiBlock.save>
	);
};

export default save;
