/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { memo } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep } from 'lodash';

const withMaxiInspector = createHigherOrderComponent(
	WrappedComponent =>
		pure(
			memo(
				ownProps => {
					if (ownProps.isSelected)
						return <WrappedComponent {...ownProps} />;

					return null;
				},
				(oldProps, newProps) => {
					const {
						attributes: oldAttr,
						propsToAvoid,
						isSelected: wasSelected,
						deviceType: oldBreakpoint,
						scValues: oldSCValues,
					} = oldProps;

					const {
						attributes: newAttr,
						isSelected,
						deviceType: breakpoint,
						scValues,
					} = newProps;

					// If is not selected, don't render
					if (!isSelected && wasSelected === isSelected) return true;

					if (select('core/block-editor').isDraggingBlocks())
						return true;

					if (
						!wasSelected ||
						wasSelected !== isSelected ||
						oldBreakpoint !== breakpoint ||
						!isEqual(oldSCValues, scValues)
					)
						return false;

					const oldAttributes = cloneDeep(oldAttr);
					const newAttributes = cloneDeep(newAttr);

					if (!isEmpty(propsToAvoid)) {
						propsToAvoid.forEach(prop => {
							delete oldAttributes[prop];
							delete newAttributes[prop];
						});
					}

					return isEqual(oldAttributes, newAttributes);
				}
			)
		),
	'withMaxiInspector'
);

export default withMaxiInspector;
