/**
 * WordPress dependencies
 */
import { path, SVG } from '@wordpress/components';

/**
 * Custom icons
 */
const iconsBlocks = {};

iconsBlocks.library = <svg preserveAspectRatio="none" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24">
<defs>
<path id="Layer0_0_1_STROKES" stroke="#00CCFF" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" fill="none" d="
M 12.65 7.35
L 12.65 7.4 12.7 7.4 12.65 7.35 5.55 1.8 5.65 11.4 12.65 7.4 12.65 7.5 12.75 7.45 12.85 7.5 19.55 11.5 19.65 11.55 19.55 11.65 12.75 15.55 12.75 23.6 19.55 19.35
M 12.65 7.35
L 19.8 1.8 19.8 11.35
M 12.45 15.55
L 5.7 11.45 5.65 11.4 5.75 19.3 10.7 22.35 10.65 17.45 7.9 15.75
M 16.7 17.35
L 13.25 19.45"/>
</defs>
<g transform="matrix( 1, 0, 0, 1, -0.65,-0.7) ">
<use href="#Layer0_0_1_STROKES"/>
</g>
</svg>;

iconsBlocks.accordion = <svg version="1.1" id="ga_layer_accordion" x="0px" y="0px"
   viewBox="0 0 24 24" space="preserve">
<style>
  {`.st0{fill:none;stroke:#00CCFF;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}`}
  {`.ga_layer_accordion {enable-background:new 0 0 24 24;}`}
</style>
<g transform="matrix( 1, 0, 0, 1, -0.05,-1.9) ">
  <g>
    <path id="gx_accordion_STROKES" class="st0" d="M20.3,5.1v1h1 M20.3,6.1v1 M21.3,21.7h-1v1 M21.3,17.5h-1v1 M20.3,16.5v1h-1
       M20.3,20.7v1h-1 M2.5,9.4h19.1v5.2H2.5V9.4z M2.7,21.7h14.5 M2.7,17.5h14.5 M2.7,6.1h14.5 M19.3,6.1h1"/>
  </g>
</g>
</svg>;

iconsBlocks.backToTop = <svg viewBox="0 0 24 24">
<path
d="M7.6 11.1L12 6.6l4.5 4.4m5.6 1c0 2.8-1 5.2-3 7.1s-4.3 3-7.1 3-5.2-1-7.2-3-2.9-4.3-2.9-7.1 1-5.2 2.9-7.2S9.2 1.9 12 1.9s5.2 1 7.1 2.9 3 4.4 3 7.2zM12 6.6l.1 10.9"
fill="none"
stroke="#0cf"
strokeWidth={1.5}
strokeLinecap="round"
strokeLinejoin="round"
/>
</svg>;

iconsBlocks.basicGallery = <svg viewBox="0 0 24 24">
  <path
   d="M16.45 16.4h5.5v5.4h-5.5v-5.4zm0-7.1h5.5v5.4h-5.5V9.3zm0-7.1h5.5v5.4h-5.5V2.2zm-7.2 0h5.5v5.4h-5.5V2.2zm-7.1 7.1h5.4v5.4h-5.4V9.3zm0-7.1h5.4v5.4h-5.4V2.2zm7.1 14.2h5.5v5.4h-5.5v-5.4zm-7.1 0h5.4v5.4h-5.4v-5.4zm7.1-7.1h5.5v5.4h-5.5V9.3z"
   fill="none"
   stroke="#0cf"
   strokeWidth={1.5}
   strokeLinecap="round"
   strokeLinejoin="round"
  />
    </svg>;

iconsBlocks.blog = <svg viewBox="0 0 24 24">
  <path
   d="M12.5 6.8h6.3m-6.3-3.3h4.9m-4.9 1.7h2.7m-2.7 5.6h4.9M2.6 9.4h7.5v5.4H2.6V9.4zm0-7.2h7.5v5.3H2.6V2.2zm0 14.6h7.5V22H2.6v-5.2zm9.9-2.7h6.3m-6.3 7.3h6.3m-6.3-8.9h2.7M12.5 18h4.9m-4.9 1.8h2.7m2.2 0H22m-4.6-7.3H22m-4.6-7.3H22"
   fill="none"
   stroke="#0cf"
   strokeWidth={1.5}
   strokeLinecap="round"
   strokeLinejoin="round"
  />
    </svg>;

iconsBlocks.button = <svg viewBox="0 0 24 24">
  <path
   d="M2.5 12.5v-10h19.1v10.1m-6.1.8c-.2 0-.3 0-.5.1-.1-.2-.2-.4-.4-.6-.2-.1-.4-.2-.7-.2-.2 0-.4.1-.6.1-.1-.2-.2-.4-.4-.5-.2-.1-.4-.1-.6-.1-.1 0-.3 0-.4.1v-1.4c0-.3-.1-.6-.3-.8-.2-.3-.5-.4-.9-.4-.3 0-.6.1-.8.4-.2.2-.4.5-.4.8v4.9l-.9-1c-.1-.1-.3-.2-.4-.3s-.3-.1-.4-.1c-.2 0-.3 0-.5.1-.1.1-.3.2-.3.3-.2.2-.3.4-.3.8 0 .3 0 .6.3.9.2.4.5.8.8 1.2.1.2.3.6.6 1.1.4.7.7 1.1.9 1.3.1.2.4.7.8 1.5 0 .1.1.1.1.1.1.1.2.1.3.1h5.2c.1 0 .2 0 .3-.1.1 0 .1-.1.2-.2.2-.6.4-1.1.5-1.7.3-1.1.4-1.9.4-2.3v-2.8c0-.3-.1-.6-.4-.8-.6-.3-.8-.5-1.2-.5zm-13-.5l4.1-.1M18 13l3.6-.1"
   fill="none"
   stroke="#0cf"
   strokeWidth={1.5}
   strokeLinecap="round"
   strokeLinejoin="round"
  />
    </svg>;

iconsBlocks.callToAction = <svg viewBox="0 0 24 24">
  <path
   d="M16.9 5.7c-.1.1-.1.1-.1.2s.1.3.2.4c.3.3.6.4 1 .4s.7-.1 1-.4c.1-.1.1-.1.1-.2-.1-.1-.2-.3-.3-.4-.3-.3-.6-.4-.9-.4-.4 0-.7.1-1 .4m-.1.1s.1-.1.1-.2c.3-.3.6-.4 1-.4s.7.1.9.4c.1.2.2.4.3.5.2-.2.3-.5.3-.8 0-.4-.1-.7-.4-.9-.3-.3-.6-.4-1-.4s-.7.1-1 .4c-.3.3-.4.6-.4.9 0 .2.1.4.2.5z"
   fill="#fffffe"
  />
  <path
   d="M2.5 14.5v-12h19.1v12.1m-4.8-8.7c0-.1.1-.1.1-.2.3-.3.6-.4 1-.4s.7.1.9.4c.1.1.2.3.3.4.1.2.1.3.1.5 0 .4-.1.7-.4.9-.3.4-.6.5-.9.5-.4 0-.7-.1-1-.4-.3-.3-.4-.6-.4-.9 0-.3.1-.6.3-.8zm-9.7 6.4L10.7 9l3.8 2.8 3.5-1.6M4.8 8.7h.5m8.7 7.5c-.1 0-.2 0-.3.1 0-.2-.1-.3-.3-.4-.1-.1-.3-.1-.4-.1s-.3 0-.4.1c0-.1-.1-.2-.3-.3-.1-.1-.3-.1-.4-.1-.1 0-.2 0-.3.1v-.9c0-.2-.1-.4-.2-.5-.2-.2-.4-.2-.6-.3-.2 0-.4.1-.6.3-.1.2-.2.3-.2.5v3.1l-.4-.8c-.1-.1-.1-.1-.3-.1-.1-.1-.1-.1-.3-.1-.1 0-.2 0-.3.1-.1 0-.1.1-.2.1-.1.1-.2.3-.2.5s0 .4.2.6.3.5.4.8c.1.1.2.4.4.7.3.4.5.7.6.9.1.1.2.4.4.9l.1.1c.1 0 .1.1.2.1h3.3s.1 0 .2-.1l.1-.1c.1-.3.2-.7.3-1 .2-.7.3-1.2.3-1.5V17c0-.2-.1-.4-.2-.5-.2-.2-.4-.3-.6-.3zM2.5 14.9h5.7M5.8 6.6h6m4.1 8.3h5.7"
   fill="none"
   stroke="#0cf"
   strokeWidth={1.5}
   strokeLinecap="round"
   strokeLinejoin="round"
  />
    </svg>;

iconsBlocks.divider = <svg version="1.1" id="gx-divider_1"  x="0px" y="0px"
   viewBox="0 0 24 24" style={{enableBackground:'new 0 0 24 24'}} space="preserve">
<style type="text/css">
  {`.st0{fill:none;stroke:#00CCFF;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}`}
</style>
<g transform="matrix( 1, 0, 0, 1, 0,0) ">
  <g>
    <path id="gx-divider0_0_1_STROKES" class="st0" d="M12.1,15.1L12,22.4 M12.1,9.1L12,1.9"/>
  </g>
</g>
<g transform="matrix( 1, 0, 0, 1, 0.75,-0.8) ">
  <g>
    <path id="gx-divider0_1_1_STROKES" class="st0" d="M1.3,14.1h19.9 M1.3,11.6h19.9"/>
  </g>
</g>
<g transform="matrix( 1, 0, 0, 1, 0,1.5) ">
  <g>
    <path id="gx-divider0_2_1_STROKES" class="st0" d="M11.8,7.6l-1.4-1.7 M13.6,5.9l-1.5,1.7"/>
  </g>
</g>
<g transform="matrix( 1, 0, 0, -1, 0,22.7) ">
  <g>
    <path id="gx-divider0_3_1_STROKES" class="st0" d="M11.8,7.6l-1.4-1.7 M13.6,5.9l-1.5,1.7"/>
  </g>
</g>
</svg>;

iconsBlocks.form = <svg viewBox="0 0 24 24">
      <path
        d="M12.8 16.1h9v5.5h-9v-5.5zm-10.5-7h19.5v5.5H2.3V9.1zm0-7.1h19.5v5.4H2.3V2z"
        fill="none"
        stroke="#0cf"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>;

iconsBlocks.footer = <svg id="gx-footer_1" x="0px" y="0px"
   viewBox="0 0 24 24" style={{enableBackground: 'new 0 0 24 24'}} space="preserve">
<style type="text/css">
  {`.st0{fill:none;stroke:#00CCFF;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}`}
</style>
<g transform="matrix( 1, 0, 0, 1, 0,0) ">
  <g>
    <path id="gx-footer_0_1_STROKES" class="st0" d="M22.6,20.4L1.5,20.3V3.6h21.1V20.4z"/>
  </g>
</g>
<g transform="matrix( 1, 0, 0, 1, -0.45,-1.05) ">
  <g>
    <path id="gx-footer_1_1_STROKES" class="st0" d="M10.4,11.6h1.3 M10.4,10.1h1.3 M10.4,7.9h4.5 M16.7,10.1H18 M16.7,11.6H18 M3.8,7.9
      h4.5 M3.8,10.1h1.3 M3.8,11.6h1.3 M3.8,18.1h4.5 M3.8,14.9h1.1 M3.8,13.4h1.1 M10.4,13.4h1.1 M10.4,14.9h1.1 M16.6,14.9h1.1
       M16.8,13.4h1.1 M15.9,18.1h4.5 M16.7,7.9h4.5"/>
  </g>
</g>
</svg>;

iconsBlocks.imageBox = <svg viewBox="0 0 24 24">
<path
    d="M21.6 20.9v.8H2.5V2.6h19.1v18.3l-6.9-6.6-4.2 3-2.2-8.2-5.8 12.4M18 8.4c0 .7-.3 1.3-.8 1.8s-1.1.7-1.8.8c-.6 0-1.2-.3-1.7-.8-.4-.6-.7-1.1-.7-1.8s.3-1.2.8-1.7 1.1-.7 1.7-.7c.7 0 1.3.2 1.8.7.5.5.7 1 .7 1.7z"
    fill="none"
    stroke="#0cf"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>;

iconsBlocks.googleMap = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="google_map__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M7.2 6.35q.4-.95 1.1-1.7.75-.7 1.65-1.1.95-.4 2.05-.4 1.05 0 2.05.4.9.4 1.65 1.1.7.75 1.1 1.7.45.95.45 2 0 1.65-2.15 5.6Q13.75 16.4 12 19q-1.75-2.6-3.1-5.05Q6.8 10 6.75 8.35q0-1.05.45-2zm7.45 2q0-1.1-.8-1.85-.75-.8-1.85-.8t-1.9.8q-.75.75-.75 1.85t.75 1.85q.8.8 1.9.8 1.1 0 1.85-.8.8-.75.8-1.85zm-4.5 8.6q-2.8.15-4.45.6-2.4.65-2.4 1.85 0 .6.75 1.1.7.45 2 .8 2.45.6 5.95.6t5.95-.6q1.3-.35 2-.8.75-.5.75-1.1 0-1.2-2.45-1.85-1.6-.45-4.65-.55"
        />
      </defs>
      <use xlinkHref="#google_map__a" transform="translate(0 -.5)" />
    </svg>;

iconsBlocks.headings = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="headers__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M1.75 2.4v5.4h3.2V6.4q0-.4.3-.65.25-.3.65-.3h4.15V17.2q0 .55-.4.95-.4.4-.95.4H7.35v3.05h9.25v-3.05h-1.3q-.55 0-.95-.4-.4-.4-.4-.95V5.45h4.15q.35 0 .65.3.25.25.25.65v1.4h3.2V2.4H1.75z"
        />
      </defs>
      <use xlinkHref="#headers__a" />
    </svg>;

iconsBlocks.hero = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="hero__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M22.55 20.25l-21.05-.1V3.45h21.05v16.1M13.3 10.4h1.25m1.5 0h1.1m-6.6 0h1.1m-3.85 0h1.25m-.15 2.65h6.4v2.5H8.9v-2.5zm-3.1-5.3h12.5"
        />
      </defs>
      <use xlinkHref="#hero__a" transform="translate(0 .15)" />
    </svg>;

iconsBlocks.iconBox = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="icon_box__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M22.6 20.4l-21.05-.1V3.6H22.6l.05 16.5M12.25 7.2l.85 2.7h2.85q.15 0 .2.1.05.05.05.15 0 .15-.1.2L13.75 12l.9 2.7q.05.15 0 .2-.05.1-.15.1-.1.1-.2-.05L12 13.3l-2.3 1.65q-.1.05-.15.05-.15 0-.2-.05-.05-.1 0-.25l.9-2.7-2.35-1.65q-.05-.05-.1-.15 0-.1.05-.15.05-.15.25-.15l2.8.1.9-2.8q0-.05.1-.1t.15 0q.15 0 .2.1zm-4.6 10.25h9.6"
        />
      </defs>
      <use xlinkHref="#icon_box__a" />
    </svg>;

iconsBlocks.iconsList = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="icons_list__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M10.75 5.7h9.4M5.85 3.2L6.4 5h2.05q.05.05.05.15 0 .05-.1.1L6.85 6.4l.6 1.8q.05.05 0 .1l-.05.1q-.1 0-.2-.05L5.7 7.2 4.2 8.35q-.1.05-.15.05-.05 0-.1-.05-.05-.1 0-.15l.6-1.8L3 5.25q-.05-.05-.1-.05 0-.1.05-.15Q3 5 3.1 5H5l.6-1.8v-.1q.1-.05.15 0 .05 0 .1.1zm0 6.75l.55 1.8h2.05q.05.05.05.15 0 .05-.1.1l-1.55 1.15.6 1.8q.05.05 0 .1l-.05.1q-.1 0-.2-.05l-1.5-1.15-1.5 1.15q-.1.05-.15.05-.05 0-.1-.05-.05-.1 0-.15l.6-1.8L3 12q-.05-.05-.1-.05 0-.1.05-.15.05-.05.15-.05H5l.6-1.8v-.1q.1-.05.15 0 .05 0 .1.1zm0 6.65l.55 1.8h2.05q.05.05.05.15 0 .05-.1.1L6.85 19.8l.6 1.8q.05.05 0 .1l-.05.1q-.1 0-.2-.05L5.7 20.6l-1.5 1.15q-.1.05-.15.05-.05 0-.1-.05-.05-.1 0-.15l.6-1.8L3 18.65q-.05-.05-.1-.05 0-.1.05-.15.05-.05.15-.05H5l.6-1.8v-.1q.1-.05.15 0 .05 0 .1.1zm4.9 2.5h9.4m-9.4-6.65h9.4"
        />
      </defs>
      <use xlinkHref="#icons_list__a" transform="translate(.5 -.4)" />
    </svg>;

iconsBlocks.orderedList = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="orderred_list__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M2.75 3.1h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 5.1h1.1m-1.1-2.6h1.1m-1.1 5.1h1.1m2.5-5.1h14.9m-14.9-5h14.9M6.35 3.1h14.9M6.35 5.6h14.9M6.35 8.1h14.9m-14.9 5h14.9m-14.9 5.1h14.9m-14.9 2.5h14.9"
        />
      </defs>
      <use xlinkHref="#ordered_list__a" />
    </svg>;

iconsBlocks.priceList =  <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="price_list__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M2.7 18.65h3.5v3.5H2.7v-3.5zm5.65 1.6h7m3-.15h3.05"
        />
        <path
          id="price_list__b"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M2.7 13.25h3.5v3.5H2.7v-3.5zm5.65 1.6h7m3-.15h3.05"
        />
        <path
          id="price_list__c"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M2.7 8h3.5v3.5H2.7V8zm5.65 1.6h7m3-.15h3.05"
        />
        <path
          id="price_list__d"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M2.7 2.6h3.5v3.5H2.7V2.6zm5.65 1.6h7m3-.15h3.05"
        />
      </defs>
      <use xlinkHref="#price_list__a" />
      <use xlinkHref="#price_list__b" transform="translate(0 .05)" />
      <use xlinkHref="#price_list__c" transform="translate(0 -.05)" />
      <use xlinkHref="#price_list__d" />
    </svg>;

iconsBlocks.pricingTablets = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="pricing_tables__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M16.7 21.1h5.75V2.4H16.7M10.6 4h3M7.25 21.1h-5.8V2.4h5.8m-3.6 16.75h1.9m5 .75h3M7.75 1.5h8.45v20.6H7.75V1.5zM18.6 19.15h1.9"
        />
      </defs>
      <use xlinkHref="#pricing_tables__a" transform="translate(.05)" />
    </svg>;

iconsBlocks.tabs = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="tabs__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M2.35 6h19.8v15.15H2.35V6zm.5-.3V2.95h4.7V5.7l.1-2.75h4.75V5.7l.15-2.75h4.7V5.7"
        />
      </defs>
      <use xlinkHref="#tabs__a" transform="translate(-.25 -.05)" />
    </svg>;


iconsBlocks.textBox = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="text_box__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M2.95 20.8h2.5m-2.5-2.4h6m-6-5.45h18.5m-18.5-5h18.5m-18.5 2.5h18.5m-18.5-5h18.5m-18.5-2.5h18.5m-18.5 12.5h18.5"
        />
      </defs>
      <use xlinkHref="#text_box__a" transform="translate(-.2 .15)" />
    </svg>;

iconsBlocks.toggle =  <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="toggle__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M4.75 4.2h-1v1m0-2v1h-1m18.65 0H6.9"
        />
        <path
          id="toggle__b"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M3.75 10.45v-1h-1m1-1v1h1m16.65 0H6.9"
        />
        <path
          id="toggle__c"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M4.75 15.65h-1v1m-1-1h1v-1m17.65 1H6.9"
        />
        <path
          id="toggle__d"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M3.75 20.8v-1h-1m2 0h-1v-1m17.65 1H6.9"
        />
      </defs>
      <use xlinkHref="#toggle__a" />
      <use xlinkHref="#toggle__b" transform="translate(0 -.05)" />
      <use xlinkHref="#toggle__c" transform="translate(0 -1.05)" />
      <use xlinkHref="#toggle__d" />
    </svg>;

iconsBlocks.container = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="container__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M17.35 22.4h4.8V2H2.25v20.4h14.8M18.6 9.15V5.7h-3.1M5.85 9.15V5.7H8.9m-3.05 9.55v3.5H8.9m9.7-3.5v3.5h-3.1"
        />
      </defs>
      <use xlinkHref="#container__a" />
    </svg>;

iconsBlocks.testimonials = <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
      <defs>
        <path
          id="testimonials__a"
          stroke="#0CF"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M22.25 10.45q0 3.35-2.75 5.75l-2.3 5.85-2.15-3.5q-1.45.35-3.05.35-4.25 0-7.25-2.5-3-2.45-3-5.95t3-6Q7.75 2 12 2t7.25 2.45q3 2.5 3 6z"
        />
      </defs>
      <use xlinkHref="#testimonials__a" />
    </svg>;



export default iconsBlocks;