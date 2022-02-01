export const WithRatioResized = ({ isResized, children }) =>
	isResized ? (
		<div className='maxi-image-ratio-resized'>{children}</div>
	) : (
		children
	);
