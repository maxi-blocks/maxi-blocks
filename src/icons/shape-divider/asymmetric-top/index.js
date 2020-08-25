/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const asymmetricTop = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 122'
    >
        <defs>
            <Path
                id='asymmetric-top'
                d='M978.8 122.25q20.45 2.45 39.1-6L1280 0H0l978.8 122.25z'
            />
        </defs>
        <use href='#asymmetric-top' />
    </SVG>
);

export default asymmetricTop;
