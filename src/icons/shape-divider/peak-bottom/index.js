/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const peakBottom = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 95'
    >
        <defs>
            <Path
                id='peak-bottom'
                d='M1280 95.8V26.15L960-.05 320 75.4 0 26.15V95.8h1280z'
            />
        </defs>
        <use href='#peak-bottom' />
    </SVG>
);

export default peakBottom;
