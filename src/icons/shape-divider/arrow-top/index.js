/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const arrowTop = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 140'
    >
        <defs>
            <Path id='arrow-top' d='M0 0l640 140L1280 0H0z' />
        </defs>
        <use href='#arrow-top' />
    </SVG>
);

export default arrowTop;
