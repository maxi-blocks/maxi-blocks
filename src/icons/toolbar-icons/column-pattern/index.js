/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarColumnPattern = (
    <SVG x="0px" y="0px" viewBox="0 0 24 24" xmlSpace="preserve">
        <Path
            d="M16.6 1.3H23v21.5h-6.4V1.3zM1 1.3h6.4v21.5H1V1.3zm7.9 0h6.4v21.5H8.9V1.3z"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </SVG>
);

export default toolbarColumnPattern;
