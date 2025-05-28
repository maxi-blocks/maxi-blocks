/**
 * Internal dependencies
 */
import Hit from './Hit';
import masonryGenerator from './masonryGenerator';

/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';

class InfiniteHits extends Component {
	static propTypes = {
		hits: PropTypes.arrayOf(PropTypes.object).isRequired,
		hasMore: PropTypes.bool.isRequired,
		refineNext: PropTypes.func.isRequired,
	};

	sentinel = null;

	onSentinelIntersection = entries => {
		const { hasMore, refineNext } = this.props;

		entries.forEach(entry => {
			if (entry.isIntersecting && hasMore) {
				refineNext();
				masonryGenerator('starter-sites');
			}
		});
	};

	componentDidMount() {
		this.observer = new IntersectionObserver(this.onSentinelIntersection);
		this.observer.observe(this.sentinel);
	}

	componentWillUnmount() {
		this.observer.disconnect();
	}

	render() {
		const { hits, type, isQuickStart } = this.props;

		return (
			<div className='ais-InfiniteHits'>
				<ul className='ais-InfiniteHits-list'>
					{hits.map(hit => (
						<li
							key={hit.objectID}
							className='ais-InfiniteHits-item'
						>
							<Hit
								hit={hit}
								type={type}
								isQuickStart={isQuickStart}
							/>
						</li>
					))}
					<li
						className='ais-InfiniteHits-sentinel'
						ref={c => {
							this.sentinel = c;
							const val = this.sentinel;
							return val;
						}}
					/>
				</ul>
			</div>
		);
	}
}

export default connectInfiniteHits(InfiniteHits);
