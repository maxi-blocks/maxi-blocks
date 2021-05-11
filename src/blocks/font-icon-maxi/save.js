/**
 * Internal dependencies
 */
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import { getPaletteClasses } from '../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Save
 */
const save = props => {
	const { attributes } = props;
	const { parentBlockStyle } = attributes;

	const name = 'maxi-blocks/font-icon-maxi';

	const paletteClasses = getPaletteClasses(
		attributes,
		[
			'background',
			'background-hover',
			'border',
			'border-hover',
			'box-shadow',
			'box-shadow-hover',
			'icon',
			'icon-hover',
		],
		name,
		parentBlockStyle
	);

	return (
		<MaxiBlock
			paletteClasses={paletteClasses}
			{...getMaxiBlockBlockAttributes({ ...props, name })}
			isSave
		>
			{!isEmpty(attributes['icon-name']) && (
				<span className='maxi-font-icon-block__icon'>
					<i className={attributes['icon-name']} />
				</span>
			)}
		</MaxiBlock>
	);
};

export default save;
