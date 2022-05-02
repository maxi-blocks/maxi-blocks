/**
 * WordPress dependencies
 */
import { useState, Children, cloneElement } from '@wordpress/element';

/**
 * External dependencies
 */
import ReactDragListView from 'react-drag-listview';

/**
 * Styles
 */
import './editor.scss';

const ListControl = ({ children, onListItemsDrag }) => {
	const [selector, changeSelector] = useState(null);

	const childrenWithProps = Children.map(children, child => {
		return cloneElement(child, {
			selector,
			isOpen: selector === child.props.id,
			onOpen: isOpen => {
				if (isOpen) changeSelector(null);
				else
					selector !== child.props.id
						? changeSelector(child.props.id)
						: changeSelector(null);
			},
			onRemove: () => {
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
