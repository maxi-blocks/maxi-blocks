/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransformControl from '@components/transform-control';
import { getGroupAttributes } from '@extensions/styles';
import {
	getTransformSelectors,
	getTransformCategories,
	getDisabledTransformCategories,
} from '@components/transform-control/utils';

/**
 * Component
 */
const transform = ({
	props,
	disabledCategories,
	depth = 2,
	categories,
	selectors,
}) => {
	const {
		attributes,
		deviceType,
		uniqueID,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	return {
		label: __('Transform', 'maxi-blocks'),
		content: (
			<TransformControl
				{...getGroupAttributes(attributes, 'transform')}
				onChangeInline={(obj, target, pseudoElement) => {
					insertInlineStyles({
						obj,
						target,
						...(pseudoElement && {
							pseudoElement: `::${pseudoElement}`,
						}),
					});
				}}
				onChange={(obj, inlineStylesTargets, pseudoElement) => {
					maxiSetAttributes(obj);
					cleanInlineStyles(
						inlineStylesTargets,
						pseudoElement && `::${pseudoElement}`
					);
				}}
				uniqueID={uniqueID}
				breakpoint={deviceType}
				depth={depth}
				categories={getTransformCategories(categories, attributes)}
				selectors={getTransformSelectors(selectors, attributes)}
				disabledCategories={getDisabledTransformCategories(
					disabledCategories,
					attributes
				)}
			/>
		),
	};
};

export default transform;
