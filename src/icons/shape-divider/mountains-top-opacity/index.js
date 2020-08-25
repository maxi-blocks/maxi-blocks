/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const mountainsTopOpacity = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1280 134'
    >
        <defs>
            <Path
                id='mountains-top-opacity-a'
                fillOpacity='.498'
                d='M1279.95 35.85L1280 0H0v126.7l60.6 7.4 95.65-3.1 86.35-13.9 78.7 9.75 90.1-17.1 94.45 7.7 76.95-11.85 82.65 13.95 76.95-8.5 73.7-22.1 97.6 7.3 83.65-22.95 66.3 10.95 70.8-18.2h79.85l65.65-30.2z'
            />
            <Path
                id='mountains-top-opacity-b'
                d='M1280 .05V0H0v127.9l60.6 4.85 95.65-31.5 86.35 9.2 78.7-36.1 90.1 24.4 94.45-38.4L583.8 88.7l91.65-25.25L752.4 96.8l63.7-21.4 97.6 7.05 83.65-29.6 66.3 11.7 70.8-23.35 74.85-4.6L1280 .05z'
            />
        </defs>
        <use href='#mountains-top-opacity-a' />
        <use href='#mountains-top-opacity-b' />
    </SVG>
);

export default mountainsTopOpacity;
