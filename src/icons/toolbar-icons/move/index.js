/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarMove = (
    <SVG x="0px" y="0px" viewBox="0 0 24 24" xmlSpace="preserve">
      <Path
        d="M4.9 9.8L1.4 12h10.7V1.3L9.8 4.9m4.5 0l-2.2-3.6m2.2 17.8l-2.2 3.6-2.3-3.6m-4.9-4.9L1.4 12m10.7 10.7V12h10.7l-3.6-2.2m-.1 4.4l3.6-2.2"
        fill="none"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
  
  export default toolbarMove;