/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const asymmetricBottomOpacity = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 140'
    >
        <defs>
            <Path
                id='asymmetric-bottom-opacity-a'
                fillOpacity='.498'
                d='M1280 140V0l-266 91.5q-15 5.2-30.8 3.7L0 0v140h1280z'
            />
            <Path
                id='asymmetric-bottom-opacity-b'
                d='M1280 140V0l-262.1 116.25q-18.65 8.45-39.1 6L0 0v140h1280z'
            />
        </defs>
        <use href='#asymmetric-bottom-opacity-a' />
        <use href='#asymmetric-bottom-opacity-b' />
    </SVG>
);

export default asymmetricBottomOpacity;
