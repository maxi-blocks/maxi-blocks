/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarList = (
    <SVG
        preserveAspectRatio='none'
        x='0px'
        y='0px'
        width='24px'
        height='24px'
        viewBox='0 0 24 24'
    >
        <defs>
            <Path
                id='a'
                stroke='#FFF'
                strokeWidth={2}
                strokeLinejoin='round'
                strokeLinecap='round'
                fill='none'
                d='M2.75 3.1h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 5.1h1.1m-1.1-2.6h1.1m-1.1 5.1h1.1m2.5 0h14.9m-14.9-2.5h14.9m-14.9-5.1h14.9m-14.9-5h14.9M6.35 5.6h14.9M6.35 3.1h14.9m-14.9 7.5h14.9m-14.9 5h14.9'
            />
        </defs>
        <use xlinkHref='#a' />
    </SVG>
);

export default toolbarList;
