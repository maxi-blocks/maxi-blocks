/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const threeColumns = (
  <SVG
    width="24"
    height="7"
    id="Layer_1"
    x="0px"
    y="0px"
    viewBox="0 0 112 36"
    xmlSpace="preserve"
  >
    <style>
      {
        ".st0{fill:none;stroke:#464a53;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"
      }
    </style>
    <Path className="st0" d="M79 1H112V35H79z" />
    <Path className="st0" d="M39.5 1H72.5V35H39.5z" />
    <Path className="st0" d="M0 1H33V35H0z" />
  </SVG>
);

export default threeColumns;
