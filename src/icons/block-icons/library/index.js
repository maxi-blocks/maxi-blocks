/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const library = (
    <SVG preserveAspectRatio="none" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24">
        <defs>
            <Path id="Layer0_0_1_STROKES" stroke="#00CCFF" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" fill="none" d="M 12.65 7.35L 12.65 7.4 12.7 7.4 12.65 7.35 5.55 1.8 5.65 11.4 12.65 7.4 12.65 7.5 12.75 7.45 12.85 7.5 19.55 11.5 19.65 11.55 19.55 11.65 12.75 15.55 12.75 23.6 19.55 19.35M 12.65 7.35L 19.8 1.8 19.8 11.35M 12.45 15.55L 5.7 11.45 5.65 11.4 5.75 19.3 10.7 22.35 10.65 17.45 7.9 15.75M 16.7 17.35L 13.25 19.45" />
        </defs>
        <g transform="matrix( 1, 0, 0, 1, -0.65,-0.7) ">
            <use href="#Layer0_0_1_STROKES" />
        </g>
    </SVG>
)

export default library;