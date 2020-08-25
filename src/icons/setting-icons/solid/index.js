/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const solid = (
    <SVG viewBox='0 0 62 4'>
        <Path
            fill='none'
            stroke='#173042'
            strokeWidth='2'
            strokeMiterlimit='10'
            d='M1 2h60'
        />
    </SVG>
);

export default solid;
