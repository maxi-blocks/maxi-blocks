/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const slantBottom = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 140'
    >
        <defs>
            <Path id='slant-bottom' d='M0 0v140h1280L0 0z' />
        </defs>
        <use href='#slant-bottom' />
    </SVG>
);

export default slantBottom;
