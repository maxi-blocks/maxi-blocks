/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import masonryGenerator from './masonryGenerator';

/**
 * External dependencies
 */
import { connectInfiniteHits } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';

class InfiniteHits extends Component {
	sentinel = null;

	componentDidMount() {
		this.observer = new IntersectionObserver(this.onSentinelIntersection);
		this.observer.observe(this.sentinel);
		this.scheduleLayout();
	}

	componentWillUnmount() {
		this.observer.disconnect();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.hits.length !== this.props.hits.length) {
			this.scheduleLayout();
		}
	}

	scheduleLayout = () => {
		window.requestAnimationFrame(() => masonryGenerator('patterns'));
	};

	onSentinelIntersection = entries => {
		const { hasMore, refineNext } = this.props;

		entries.forEach(entry => {
			if (entry.isIntersecting && hasMore) {
				refineNext();
				masonryGenerator('patterns');
			}
		});
	};

	render() {
		const { hits, hitComponent } = this.props;

		return (
			<div className='ais-InfiniteHits'>
				<ul className='ais-InfiniteHits-list'>
					{hits.map(hit => (
						<li
							key={hit.objectID}
							className='ais-InfiniteHits-item'
						>
							{hitComponent(hit)}
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

InfiniteHits.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	hits: PropTypes.arrayOf(PropTypes.object).isRequired,
	hasMore: PropTypes.bool.isRequired,
	refineNext: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);
