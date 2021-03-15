/**
 * WordPress dependencies
 */
const { Button } = wp.components;
const { useEffect, useState } = wp.element;

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import { times } from 'lodash';

/**
 * Component
 */
const PageButton = props => {
	const { content, onClick, isSelected } = props;

	return (
		<Button
			className='maxi-cloud-pagination__item'
			onClick={() => onClick(content - 1)}
			style={{ ...(isSelected && { backgroundColor: 'orange' }) }}
		>
			{content}
		</Button>
	);
};

const Pagination = props => {
	const { page, itemsPage, onPageChange, totalItems } = props;

	const getTotalPages = () => {
		return totalItems < itemsPage ? 1 : Math.ceil(totalItems / itemsPage);
	};

	const [totalPages, setTotalPages] = useState(getTotalPages());

	useEffect(() => {
		setTotalPages(getTotalPages());
	}, [itemsPage, totalItems]);

	if (totalItems <= 0) return null;
	return (
		<div className='maxi-cloud-pagination'>
			{times(totalPages, i => {
				return (
					<PageButton
						key={`maxi-cloud-pagination__item__${i}`}
						content={i + 1}
						onClick={onPageChange}
						isSelected={i === page}
					/>
				);
			})}
		</div>
	);
};

export default Pagination;
