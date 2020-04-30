/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const twoColumns = (
  <SVG
    width="24"
    height="7"
    id="Layer_1"
    x="0px"
    y="0px"
    viewBox="0 0 111 36"
    xmlSpace="preserve"
  >
    <style>
      {
        ".st0{fill:none;stroke:#464a53;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"
      }
    </style>
    <Path className="st0" d="M59 1.1H111V35.1H59z" />
    <Path className="st0" d="M0 1.1H52V35.1H0z" />
  </SVG>
);

export default twoColumns;
