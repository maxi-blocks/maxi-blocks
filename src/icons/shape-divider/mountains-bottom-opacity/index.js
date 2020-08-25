/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const mountainsBottomOpacity = (
    <SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 140'>
        <Path
            fillOpacity='.498'
            d='M1209.3 36.6l-74.9 4.6-70.8 23.4-66.3-11.7-83.6 29.6-97.6-7-63.7 21.4-77 12.6-91.7-20.8-77.9 17.7-94.5-7.6-90.1 21.6-78.7-9.9-86.4 16.1-95.7 6.2-60.4-5V140h1280V0l-70.7 36.6z'
        />
        <Path d='M1214.3 76l-79.9-10-70.8 28.3-66.3-20.9-83.6 32.9L816.1 89l-73.7 32.1-77-1.5-82.7-14-76.9 21.8-94.5-17.7-90.1 27.1-78.7-19.8-86.2 14-95.7 3.1L0 126.7V140h1280V35.8L1214.3 76z' />
    </SVG>
);

export default mountainsBottomOpacity;
