/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarType = (
    <SVG
        preserveAspectRatio="none"
        x="0px"
        y="0px"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
       
    >
        <defs>
            <Path
                id="a"
                stroke="#FFF"
                strokeWidth={1}
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                d="M1.75 2.4v5.4h3.2V6.4q0-.4.3-.65.25-.3.65-.3h4.15V17.2q0 .55-.4.95-.4.4-.95.4H7.35v3.05h9.25v-3.05h-1.3q-.55 0-.95-.4-.4-.4-.4-.95V5.45h4.15q.35 0 .65.3.25.25.25.65v1.4h3.2V2.4H1.75z"
            />
        </defs>
        <use xlinkHref="#a" />
    </SVG>
);

export default toolbarType;