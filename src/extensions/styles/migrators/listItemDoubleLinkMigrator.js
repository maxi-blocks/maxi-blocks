/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	getMaxiBlockAttributes,
	MaxiBlock,
} from '@components/maxi-block';
import { WithLink } from '@extensions/save/utils';

const name = 'List item double link';

const maxiVersions = [
	'0.1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
	'0.0.1-SC5',
	'0.0.1-SC6',
	'1.0.0-RC1',
	'1.0.0-RC2',
	'1.0.0-beta',
	'1.0.0-beta-2',
	'wp-directory-beta-1',
	'1.0.0',
	'1.0.1',
	'1.1.0',
	'1.1.1',
	'1.2.0',
	'1.2.1',
	'1.3',
	'1.3.1',
	'1.4.1',
	'1.4.2',
	'1.5.0',
	'1.5.1',
	'1.5.2',
	'1.5.3',
	'1.5.4',
	'1.5.5',
	'1.5.6',
	'1.5.7',
	'1.5.8',
	'1.6.0',
	'1.6.1',
	'1.7.0',
	'1.7.1',
	'1.7.2',
	'1.7.3',
	'1.8.0',
	'1.8.1',
	'1.8.2',
	'1.8.3',
	'1.8.4',
];

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return maxiVersions.includes(maxiVersionCurrent) || !maxiVersionOrigin;
};

// 1.8.4 List-item-maxi version https://github.com/maxi-blocks/maxi-blocks/blob/afb972544e9ab29a2f74aab6a42f256ae07cb081/src/blocks/list-item-maxi/save.js
const save = props => {
	const {
		content,
		listReversed,
		listStart,
		'dc-status': dcStatus,
		ariaLabels = {},
		linkSettings,
	} = props.attributes;

	const name = 'maxi-blocks/list-item-maxi';
	const className = 'maxi-list-item-block__content';

	return (
		<WithLink linkSettings={linkSettings}>
			<MaxiBlock.save
				tagName='li'
				{...getMaxiBlockAttributes({ ...props, name })}
				aria-label={ariaLabels['list item wrapper']}
			>
				<RichText.Content
					className={className}
					value={content}
					tagName='div'
					aria-label={ariaLabels['list item']}
					{...(!dcStatus && {
						reversed: !!listReversed,
						start: listStart,
					})}
				/>
			</MaxiBlock.save>
		</WithLink>
	);
};

export default { name, isEligible, save };
