/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const tirangleBottom = (
    <SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 140'>
        <Path
            fill='#000'
            fillRule='nonzero'
            d='M560 0l80 140H0V0h560m720 0v140H640L720 0h560z'
        />
    </SVG>
);

export default tirangleBottom;
