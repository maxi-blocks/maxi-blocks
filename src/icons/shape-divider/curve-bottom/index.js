/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const curveBottom = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 140'
    >
        <defs>
            <Path
                id='curve-bottom'
                d='M609.5 139.8q-106.956-2.531-218.65-21.65Q288.75 100.6 187.45 70 115.05 48.15 50.3 21.9 17.9 8.75 0 0v140l609.5-.2M1280 0q-17.9 8.75-50.3 21.9-64.8 26.25-137.15 48.1-101.35 30.65-203.45 48.15-111.65 19.119-218.65 21.65l609.55.2V0z'
            />
        </defs>
        <use href='#curve-bottom' />
    </SVG>
);

export default curveBottom;
