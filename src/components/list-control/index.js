/**
 * WordPress dependencies
 */
import {
	Children,
	cloneElement,
	useCallback,
	useEffect,
	useState,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { debugPreview as debugRelationPreview } from '@extensions/relations/debugPreview';

/**
 * External dependencies
 */
import ReactDragListView from 'react-drag-listview';

/**
 * Styles
 */
import './editor.scss';

export const getNextListChildrenState = ({
	selector,
	childrenIds,
	currentChildrenIds,
}) => {
	const childrenIdsKey = childrenIds.join('|');
	const currentChildrenIdsKey = currentChildrenIds.join('|');

	if (childrenIdsKey === currentChildrenIdsKey) {
		return {
			hasChanged: false,
			nextSelector: selector,
		};
	}

	const addedIds = currentChildrenIds.filter(
		id => !childrenIds.includes(id)
	);
	const removedIds = childrenIds.filter(
		id => !currentChildrenIds.includes(id)
	);
	let nextSelector = selector;

	if (selector && !currentChildrenIds.includes(selector)) {
		const previousSelectorIndex = childrenIds.indexOf(selector);
		nextSelector =
			previousSelectorIndex >= 0
				? currentChildrenIds[previousSelectorIndex] || null
				: null;
	}

	if (
		addedIds.length === 1 &&
		currentChildrenIds.length > childrenIds.length
	) {
		nextSelector = addedIds[0];
	}

	return {
		hasChanged: true,
		addedIds,
		removedIds,
		nextSelector,
	};
};

const ListControl = ({ children, debugName, onListItemsDrag }) => {
	const [selector, changeSelector] = useState(null);
	const [childrenIds, changeChildrenIds] = useState([]);

	const currentChildrenIds = children.map(child => child.props.id);
	const currentChildrenIdsKey = currentChildrenIds.join('|');
	const debugList = useCallback(
		(event, details = {}) => {
			if (!debugName) return;

			debugRelationPreview(
				`${debugName}:${event}`,
				{
					selector,
					childrenIds,
					currentChildrenIds,
					...details,
				}
			);
		},
		[
			childrenIds,
			currentChildrenIdsKey,
			debugName,
			selector,
		]
	);

	useEffect(() => {
		debugList('mount');

		return () => {
			debugList('unmount');
		};
	}, []);

	const nextChildrenState = getNextListChildrenState({
		selector,
		childrenIds,
		currentChildrenIds,
	});

	if (nextChildrenState.hasChanged) {
		if (
			nextChildrenState.addedIds.length === 1 &&
			currentChildrenIds.length > childrenIds.length
		) {
			debugList('auto-open-added-child', {
				addedId: nextChildrenState.addedIds[0],
			});
		}

		if (nextChildrenState.nextSelector !== selector) {
			debugList('sync-open-child', {
				previousSelector: selector,
				nextSelector: nextChildrenState.nextSelector,
			});
			changeSelector(nextChildrenState.nextSelector);
		}

		debugList('children-change', {
			previousChildrenIds: childrenIds,
			nextChildrenIds: currentChildrenIds,
			addedIds: nextChildrenState.addedIds,
			removedIds: nextChildrenState.removedIds,
		});
		changeChildrenIds(currentChildrenIds);
	}

	useEffect(() => {
		debugList('state');
	}, [debugList, selector, currentChildrenIdsKey]);

	const childrenWithProps = Children.map(children, child => {
		return cloneElement(child, {
			selector,
			isOpen: selector === child.props.id,
			onOpen: isOpen => {
				const nextSelector = isOpen
					? null
					: selector !== child.props.id
					? child.props.id
					: null;

				debugList('toggle-child', {
					childId: child.props.id,
					wasOpen: isOpen,
					nextSelector,
				});
				changeSelector(nextSelector);
			},
			onRemove: () => {
				debugList('remove-child', {
					childId: child.props.id,
				});
				changeSelector(null);
				child.props.onRemove();
			},
		});
	});

	return (
		<div className='maxi-list-control'>
			<ReactDragListView
				onDragEnd={(fromIndex, toIndex) =>
					onListItemsDrag(fromIndex, toIndex)
				}
				nodeSelector='div.maxi-list-item-control'
				handleSelector='span.maxi-list-item-control__title__mover'
				ignoreSelector='.maxi-list-item-control__ignore-move'
			>
				<div className='maxi-list-control__options'>
					{childrenWithProps}
				</div>
			</ReactDragListView>
		</div>
	);
};

export default ListControl;
