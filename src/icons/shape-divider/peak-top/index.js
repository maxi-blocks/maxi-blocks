/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const peakTop = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 95'
    >
        <defs>
            <Path
                id='peak-top'
                d='M1280 69.65V0H0v69.65L320 20.4l640 75.45 320-26.2z'
            />
        </defs>
        <use href='#peak-top' />
    </SVG>
);

export default peakTop;
