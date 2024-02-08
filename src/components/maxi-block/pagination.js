const Pagination = props => {
	const {
		'cl-pagination-per-page': clPaginationPerPage,
		'cl-pagination-total': paginationTotal,
		'cl-pagination-total-all': clPaginationTotalAll,
		'cl-pagination-show-page-list': clShowPageList,
		'cl-pagination-previous-text': clPrevText,
		'cl-pagination-next-text': clNextText,
	} = props;

	const totalPages = clPaginationTotalAll
		? clPaginationPerPage
		: Math.ceil(paginationTotal / clPaginationPerPage);
	const clPaginationCurrentPage = 1;

	const renderPageLinks = () => {
		const links = [];
		for (let page = 1; page <= totalPages; page += 1) {
			links.push(
				<a
					href='#'
					key={`page_${page}`}
					className={`maxi-pagination__link${
						page === clPaginationCurrentPage
							? ' maxi-pagination__link--current'
							: ''
					}`}
					disabled
				>
					<span className='maxi-pagination__text'>{page}</span>
				</a>
			);
		}
		return links;
	};

	return (
		<div className='maxi-pagination'>
			<div className='maxi-pagination__prev'>
				<a href='#' className='maxi-pagination__link' disabled>
					<span className='maxi-pagination__text'>{clPrevText}</span>
				</a>
			</div>
			{clShowPageList && (
				<div className='maxi-pagination__pages'>
					{renderPageLinks()}
				</div>
			)}
			<div className='maxi-pagination__next'>
				<a href='#' className='maxi-pagination__link' disabled>
					<span className='maxi-pagination__text'>{clNextText}</span>
				</a>
			</div>
		</div>
	);
};

export default Pagination;
