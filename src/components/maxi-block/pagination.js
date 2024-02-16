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
		? clPaginationPerPage * 2
		: Math.ceil(paginationTotal / clPaginationPerPage);
	const clPaginationCurrentPage = 1;

	const renderPageLinks = () => {
		const links = [];
		for (let page = 1; page <= totalPages; page += 1) {
			if (page === clPaginationCurrentPage) {
				// When the page is the current page, push a span with the appropriate class
				links.push(
					<span
						key={`page_${page}`}
						className='maxi-pagination__link maxi-pagination__link--current'
					>
						<span className='maxi-pagination__text'>{page}</span>
					</span>
				);
			} else {
				// Otherwise, push an anchor element
				links.push(
					<a key={`page_${page}`} className='maxi-pagination__link'>
						<span className='maxi-pagination__text'>{page}</span>
					</a>
				);
			}
		}
		return links;
	};

	return (
		<div className='maxi-pagination'>
			<div className='maxi-pagination__prev'>
				<a className='maxi-pagination__link'>
					<span className='maxi-pagination__text'>{clPrevText}</span>
				</a>
			</div>
			{clShowPageList && (
				<div className='maxi-pagination__pages'>
					{renderPageLinks()}
				</div>
			)}
			<div className='maxi-pagination__next'>
				<a className='maxi-pagination__link'>
					<span className='maxi-pagination__text'>{clNextText}</span>
				</a>
			</div>
		</div>
	);
};

export default Pagination;
