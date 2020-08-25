/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const slantTopOpacity = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 140'
    >
        <defs>
            <Path
                id='slant-top-opacity-a'
                fillOpacity='.498'
                d='M1280 140V0H0l1280 140z'
            />
            <Path id='slant-top-opacity-b' d='M1280 98V0H0l1280 98z' />
        </defs>
        <use href='#slant-top-opacity-a' />
        <use href='#slant-top-opacity-b' />
    </SVG>
);

export default slantTopOpacity;
