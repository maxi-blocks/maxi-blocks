/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const alignLeft = (
    <SVG viewBox='0 0 62 4'>
        <Path d='M1 2h1' />
        <Path
            fill='none'
            stroke='#173042'
            strokeWidth='2'
            strokeMiterlimit='10'
            strokeDasharray='2,2'
            d='M4 2h55'
        />
        <Path d='M60 2h1' />
    </SVG>
);

export default alignLeft;
