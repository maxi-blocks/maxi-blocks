/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const curveTopOpacity = (
    <SVG
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        preserveAspectRatio='none'
        viewBox='0 0 1281 140'
    >
        <defs>
            <Path
                id='curve-top-opacity-a'
                fillOpacity='.298'
                d='M1229.65 21.9Q1262.1 8.75 1280 0H0v.5q23.35 11.15 59.7 25.55Q125.85 52.2 198.6 73.6 424.5 140 639.5 140q121.6 0 249.3-21.85 102.15-17.5 203.6-48.15 72.45-21.85 137.25-48.1z'
            />
            <Path
                id='curve-top-opacity-b'
                fillOpacity='.498'
                d='M1222.6 21.55Q1259.55 8.75 1280 0H0v.65Q14.55 9.25 39.4 20q44.4 19.3 101.45 36.05 175.65 51.5 414.6 63.65 136.45 7 280.65-10.15 115.4-13.7 230.5-42.1 82.2-20.25 156-45.9z'
            />
            <Path
                id='curve-top-opacity-c'
                d='M1250.6 12.8Q1271.35 5 1281 0H1q20.35 7.65 57.05 18.8 73.5 22.3 155.6 39.75 262.6 55.9 512.6 42.6 250.05-13.3 427.4-58.55 55.4-14.15 96.95-29.8z'
            />
        </defs>
        <use href='#curve-top-opacity-a' />
        <use href='#curve-top-opacity-b' />
        <use href='#curve-top-opacity-c' />
    </SVG>
);

export default curveTopOpacity;
