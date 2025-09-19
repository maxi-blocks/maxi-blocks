/**
 * Block Suspense Wrapper for MaxiBlocks
 *
 * Provides progressive loading and lazy rendering capabilities
 * for MaxiBlocks to improve performance with many blocks on a page.
 *
 * Uses React Suspense-like patterns without requiring React 18.
 */

/**
 * WordPress dependencies
 */
import { Component, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { scheduleLowPriorityUpdate, PRIORITY_LEVELS } from './reactOptimizationManager';

/**
 * Simple loading skeleton component
 */
const BlockLoadingSkeleton = ({ blockName, height = 100 }) => (
	<div
		className="maxi-block-loading-skeleton"
		style={{
			width: '100%',
			height: `${height}px`,
			backgroundColor: '#f0f0f0',
			borderRadius: '4px',
			position: 'relative',
			overflow: 'hidden',
			border: '1px dashed #d0d0d0',
		}}
	>
		<div
			className="maxi-block-loading-animation"
			style={{
				position: 'absolute',
				top: 0,
				left: '-100%',
				width: '100%',
				height: '100%',
				background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
				animation: 'maxi-shimmer 1.5s infinite',
			}}
		/>
		<div
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				color: '#999',
				fontSize: '12px',
				fontFamily: 'system-ui, sans-serif',
			}}
		>
			Loading {blockName}...
		</div>
		<style>
			{`
				@keyframes maxi-shimmer {
					0% { left: -100%; }
					100% { left: 100%; }
				}
			`}
		</style>
	</div>
);

/**
 * Error boundary component for block loading errors
 */
class BlockErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error('MaxiBlocks: Block loading error:', error, errorInfo);

		// Schedule low priority error reporting
		scheduleLowPriorityUpdate(() => {
			// Could integrate with error reporting service here
			if (typeof window !== 'undefined' && window.wp?.data) {
				// Log to WordPress console
				console.warn('Block failed to load:', {
					blockName: this.props.blockName,
					error: error.message,
					stack: error.stack,
				});
			}
		}, { blockName: this.props.blockName, type: 'errorReporting' });
	}

	render() {
		if (this.state.hasError) {
			return (
				<div
					className="maxi-block-error-fallback"
					style={{
						padding: '20px',
						border: '2px dashed #dc3545',
						borderRadius: '4px',
						backgroundColor: '#fff5f5',
						color: '#dc3545',
						textAlign: 'center',
					}}
				>
					<div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
						Block Loading Error
					</div>
					<div style={{ fontSize: '14px', marginBottom: '8px' }}>
						{this.props.blockName} failed to load
					</div>
					<details style={{ textAlign: 'left', fontSize: '12px' }}>
						<summary style={{ cursor: 'pointer', marginBottom: '4px' }}>
							Error Details
						</summary>
						<pre style={{
							background: '#f8f9fa',
							padding: '8px',
							borderRadius: '2px',
							overflow: 'auto',
							maxHeight: '100px'
						}}>
							{this.state.error?.message || 'Unknown error'}
						</pre>
					</details>
				</div>
			);
		}

		return this.props.children;
	}
}

/**
 * Progressive block loader with intersection observer
 */
class ProgressiveBlockLoader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			shouldLoad: false,
			isLoaded: false,
		};
		this.elementRef = null;
		this.observer = null;
		this.loadTimeout = null;
	}

	componentDidMount() {
		// Create intersection observer for viewport detection
		if (typeof IntersectionObserver !== 'undefined') {
			this.observer = new IntersectionObserver(
				this.handleIntersection.bind(this),
				{
					// Load blocks that are within 200px of the viewport
					rootMargin: '200px',
					threshold: 0.01,
				}
			);

			if (this.elementRef) {
				this.observer.observe(this.elementRef);
			}
		} else {
			// Fallback for browsers without IntersectionObserver
			this.setState({ shouldLoad: true });
		}

		// Fallback timeout to ensure all blocks eventually load
		this.loadTimeout = setTimeout(() => {
			if (!this.state.shouldLoad) {
				this.setState({ shouldLoad: true });
			}
		}, this.props.maxWaitTime || 5000);
	}

	componentWillUnmount() {
		if (this.observer) {
			this.observer.disconnect();
		}
		if (this.loadTimeout) {
			clearTimeout(this.loadTimeout);
		}
	}

	handleIntersection(entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				this.setState({
					isVisible: true,
					shouldLoad: true
				});

				// Stop observing once we start loading
				if (this.observer) {
					this.observer.unobserve(entry.target);
				}
			}
		});
	}

	handleLoad = () => {
		this.setState({ isLoaded: true });
	};

	render() {
		const { children, fallback, blockName, estimatedHeight } = this.props;
		const { shouldLoad, isLoaded } = this.state;

		return (
			<div
				ref={ref => { this.elementRef = ref; }}
				className="maxi-progressive-block-loader"
				data-block-name={blockName}
			>
				{shouldLoad ? (
					<BlockErrorBoundary blockName={blockName}>
						{children}
					</BlockErrorBoundary>
				) : (
					fallback || (
						<BlockLoadingSkeleton
							blockName={blockName}
							height={estimatedHeight}
						/>
					)
				)}
			</div>
		);
	}
}

/**
 * Block Suspense Wrapper component
 * Provides progressive loading with fallbacks
 */
const BlockSuspenseWrapper = ({
	children,
	blockName = 'Block',
	fallback = null,
	estimatedHeight = 100,
	priority = PRIORITY_LEVELS.NORMAL,
	enableProgressiveLoading = true,
	maxWaitTime = 5000
}) => {
	// Skip progressive loading for high priority blocks
	if (!enableProgressiveLoading || priority <= PRIORITY_LEVELS.HIGH) {
		return (
			<BlockErrorBoundary blockName={blockName}>
				{children}
			</BlockErrorBoundary>
		);
	}

	// Use progressive loading for normal and low priority blocks
	return (
		<ProgressiveBlockLoader
			blockName={blockName}
			fallback={fallback}
			estimatedHeight={estimatedHeight}
			maxWaitTime={maxWaitTime}
		>
			{children}
		</ProgressiveBlockLoader>
	);
};

/**
 * Higher-order component to wrap blocks with suspense
 * @param {Component} WrappedComponent - Component to wrap
 * @param {Object} options - Configuration options
 * @returns {Component} - Wrapped component
 */
export const withBlockSuspense = (WrappedComponent, options = {}) => {
	const {
		blockName = WrappedComponent.displayName || WrappedComponent.name || 'Block',
		estimatedHeight = 100,
		priority = PRIORITY_LEVELS.NORMAL,
		enableProgressiveLoading = true,
		maxWaitTime = 5000,
	} = options;

	const SuspenseWrappedComponent = (props) => (
		<BlockSuspenseWrapper
			blockName={blockName}
			estimatedHeight={estimatedHeight}
			priority={priority}
			enableProgressiveLoading={enableProgressiveLoading}
			maxWaitTime={maxWaitTime}
		>
			<WrappedComponent {...props} />
		</BlockSuspenseWrapper>
	);

	SuspenseWrappedComponent.displayName = `withBlockSuspense(${blockName})`;
	return SuspenseWrappedComponent;
};

/**
 * Utility to get estimated height for different block types
 * @param {string} blockType - Type of block
 * @returns {number} - Estimated height in pixels
 */
export const getEstimatedBlockHeight = (blockType) => {
	const heights = {
		'text-maxi': 80,
		'button-maxi': 60,
		'image-maxi': 200,
		'video-maxi': 300,
		'container-maxi': 150,
		'row-maxi': 100,
		'column-maxi': 100,
		'divider-maxi': 40,
		'slider-maxi': 400,
		'map-maxi': 300,
		'default': 100,
	};

	return heights[blockType] || heights.default;
};

/**
 * Configuration for different block types
 */
export const BLOCK_LOADING_CONFIG = {
	// High priority blocks (visible immediately)
	immediate: {
		priority: PRIORITY_LEVELS.IMMEDIATE,
		enableProgressiveLoading: false,
	},

	// Normal priority blocks (load when near viewport)
	normal: {
		priority: PRIORITY_LEVELS.NORMAL,
		enableProgressiveLoading: true,
		maxWaitTime: 3000,
	},

	// Low priority blocks (load when needed)
	deferred: {
		priority: PRIORITY_LEVELS.LOW,
		enableProgressiveLoading: true,
		maxWaitTime: 5000,
	},

	// Heavy blocks (load lazily)
	heavy: {
		priority: PRIORITY_LEVELS.LOW,
		enableProgressiveLoading: true,
		maxWaitTime: 10000,
	},
};

export default BlockSuspenseWrapper;