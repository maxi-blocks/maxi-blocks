/**
 * WordPress dependencies
 */
import { select, subscribe } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { memo, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep } from 'lodash';

const withMaxiInspector = createHigherOrderComponent(
	WrappedComponent =>
		pure(
			memo(
				ownProps => {
					if(!ownProps) return null;
					// Adds correct class to the wrapper
					useEffect(() => {
						if (ownProps.isSelected) {
							const editPostSidebarNode = document.querySelector(
								'.interface-complementary-area'
							);

							if (editPostSidebarNode)
								editPostSidebarNode.classList.add(
									'maxi-sidebar'
								);
							else {
								const sidebarIntervalUnsubscribe = subscribe(
									() => {
										const editPostSidebarNode =
											document.querySelector(
												'.interface-complementary-area'
											);

										if (editPostSidebarNode) {
											editPostSidebarNode.classList.add(
												'maxi-sidebar'
											);

											sidebarIntervalUnsubscribe();
										}
									}
								);
							}

							const blockEditorBlockInspectorNode =
								document.querySelector(
									'.block-editor-block-inspector'
								);

							if (blockEditorBlockInspectorNode)
								blockEditorBlockInspectorNode.classList.add(
									'maxi-controls'
								);
							else {
								const controlsIntervalUnsubscribe = subscribe(
									() => {
										const blockEditorBlockInspectorNode =
											document.querySelector(
												'.block-editor-block-inspector'
											);

										if (blockEditorBlockInspectorNode) {
											blockEditorBlockInspectorNode.classList.add(
												'maxi-controls'
											);

											controlsIntervalUnsubscribe();
										}
									}
								);
							}

							return () => {
								if (editPostSidebarNode)
									editPostSidebarNode.classList.remove(
										'maxi-sidebar'
									);

								if (blockEditorBlockInspectorNode)
									blockEditorBlockInspectorNode.classList.remove(
										'maxi-controls'
									);
							};
						}

						return () => {};
					});

					if (ownProps.isSelected) {
						return <WrappedComponent {...ownProps} />;
					}

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
