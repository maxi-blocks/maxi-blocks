/**
 * WordPress dependencies
 */
import { path, SVG } from "@wordpress/components";

/**
 * Custom icons
 */
const iconsSettings = {};

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

iconsSettings.brokenLink = (
  <svg height={512} viewBox="0 0 515.556 515.556" width={512}>
    <path d="M392.189 0c-32.946 0-63.926 12.839-87.227 36.14l-96.067 96.067c7.342-1.025 14.677-2.138 22.182-2.138 20.693 0 40.97 4.02 59.611 11.474l59.839-59.839c11.139-11.124 25.929-17.26 41.662-17.26 32.49 0 58.922 26.432 58.922 58.922 0 15.734-6.136 30.523-17.26 41.662L326.141 272.74c-22.279 22.247-61.046 22.263-83.325.016l-45.533 45.596c23.286 23.27 54.265 36.093 87.195 36.093 32.946 0 63.925-12.839 87.227-36.14l107.712-107.712c23.301-23.301 36.14-54.281 36.14-87.227C515.556 55.335 460.221 0 392.189 0z" />
    <path d="M224.303 374.578l-59.274 59.274c-11.139 11.124-25.929 17.26-41.662 17.26-32.49 0-58.922-26.432-58.922-58.922 0-15.733 6.136-30.523 17.26-41.662l107.712-107.712c22.279-22.247 61.046-22.263 83.325-.016l45.533-45.596c-46.587-46.54-127.819-46.555-174.422.047L36.14 304.963C12.838 328.264 0 359.243 0 392.189c0 68.032 55.335 123.366 123.366 123.366 32.946 0 63.925-12.839 87.227-36.14l94.792-94.792c-6.921.93-13.806 2.043-20.908 2.043-21.012.001-41.363-4.2-60.174-12.088z" />
  </svg>
);

iconsSettings.cursor = (
  <svg viewBox="0 0 297 297">
    <path d="M244.279 91.662a29.65 29.65 0 00-11.825 2.45c-4.413-11.152-15.238-19.058-27.869-19.058a29.646 29.646 0 00-13.094 3.034c-5.009-9.657-15.048-16.27-26.598-16.27-3.395 0-6.655.579-9.701 1.632V30.201C155.193 13.549 141.738 0 125.198 0 108.66 0 95.206 13.549 95.206 30.201v119.643L73.604 125.13a11.445 11.445 0 00-.465-.494c-5.672-5.676-13.221-8.823-21.256-8.862h-.153c-8.016 0-15.521 3.095-21.146 8.724-9.918 9.921-10.467 24.647-1.502 40.408 11.605 20.39 24.22 39.616 35.351 56.581 8.134 12.398 15.818 24.108 21.435 33.79 4.871 8.402 17.801 35.651 17.933 35.926a10.142 10.142 0 009.163 5.798h128.27c4.407 0 8.308-2.843 9.659-7.035 2.392-7.439 23.379-73.398 23.379-98.871v-69.229c-.002-16.656-13.455-30.204-29.993-30.204zm-9.7 30.203c0-5.468 4.352-9.916 9.7-9.916 5.351 0 9.703 4.448 9.703 9.916v69.229c0 16.928-13.01 62.437-20.189 85.618H119.361c-4.206-8.752-12.089-24.964-15.944-31.613-5.897-10.168-13.73-22.105-22.022-34.744-10.966-16.71-23.393-35.652-34.681-55.482-2.946-5.181-5.646-12.166-1.78-16.032 1.803-1.807 4.231-2.751 6.851-2.779a9.913 9.913 0 016.805 2.721l39.124 44.755a10.144 10.144 0 0017.781-6.676V30.201c0-5.467 4.353-9.913 9.704-9.913 5.352 0 9.706 4.446 9.706 9.913v94.711c0 5.602 4.543 10.144 10.144 10.144s10.144-4.542 10.144-10.144V92.016c0-5.464 4.352-9.909 9.701-9.909 5.351 0 9.703 4.445 9.703 9.909v46.127c0 5.605 4.542 10.145 10.143 10.145 5.602 0 10.145-4.539 10.145-10.145v-32.888c0-5.467 4.352-9.914 9.701-9.914 5.352 0 9.706 4.447 9.706 9.914v46.13c0 5.601 4.542 10.145 10.144 10.145 5.603 0 10.145-4.544 10.145-10.145v-29.52z" />
  </svg>
);

iconsSettings.editTool = (
  <svg height={512} viewBox="0 0 467.765 467.765" width={512}>
    <path d="M175.412 175.412h29.235v116.941h-29.235v58.471h116.941v-58.471h-29.235V175.412h29.235v29.235h58.471v-87.706H116.941v87.706h58.471z" />
    <path d="M467.765 87.706V0h-87.706v29.235H87.706V0H0v87.706h29.235v292.353H0v87.706h87.706V438.53h292.353v29.235h87.706v-87.706H438.53V87.706zm-87.706 292.353H87.706V87.706h292.353z" />
  </svg>
);

iconsSettings.fill = (
  <svg height={512} viewBox="0 0 467.766 467.766" width={512}>
    <path d="M169.359 371.494c5.71 5.71 13.19 8.565 20.67 8.565s14.96-2.855 20.67-8.565L392.163 190.03 202.135 0l-41.34 41.34 31.748 31.748L52.418 213.212c-11.42 11.42-11.42 29.921 0 41.34l116.941 116.942zm64.524-257.065l75.601 75.601-43.853 43.853H114.429l119.454-119.454zM394.677 380.06c24.219 0 43.853-19.634 43.853-43.853s-43.853-73.088-43.853-73.088-43.853 48.869-43.853 73.088 19.634 43.853 43.853 43.853zM29.236 409.295H438.53v58.471H29.236z" />
  </svg>
);

iconsSettings.gear = (
  <svg viewBox="0 0 24 24">
    <path
      d="M22.9 13.6c0 .1 0 .2-.1.3-.1.1-.2.1-.3.1h-2c-.3 0-.5.1-.7.3-.2.1-.3.3-.4.6-.1.2-.1.4-.3.6 0 .1-.1.3-.1.5s.1.4.4.6l1.4 1.4c.1.1.2.2.2.3 0 .1-.1.2-.2.3l-2.2 2.2c-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1l-1.4-1.4c-.2-.2-.4-.3-.6-.4-.3 0-.5 0-.7.1l-.6.3c-.2.1-.4.2-.6.4-.2.2-.3.4-.3.7v2c0 .1 0 .2-.1.3-.1.1-.2.1-.3.1h-3.1c-.1 0-.2 0-.3-.1-.1-.1-.1-.2-.1-.3v-2c0-.3-.1-.5-.2-.7-.1-.2-.3-.3-.5-.4l-.6-.3s-.2-.1-.3-.1-.3 0-.4.1c-.1 0-.3.1-.4.3L6 20.8c-.1.1-.2.1-.3.1-.1 0-.2 0-.3-.1l-2.2-2.2c-.1-.1-.1-.2-.1-.3 0-.1 0-.2.1-.3l1.4-1.4c.3-.1.4-.3.4-.6s0-.5-.1-.7l-.3-.6c-.1-.2-.2-.4-.4-.6-.2-.1-.4-.2-.6-.2h-2c-.1 0-.2 0-.3-.1-.1-.1-.1-.2-.1-.3v-3.1c0-.1 0-.2.1-.3.1-.1.1-.1.3-.1h2c.2 0 .4-.1.7-.2.2-.1.3-.3.4-.5l.3-.6v-.6c0-.2-.1-.4-.3-.6L3.3 6c-.1-.1-.1-.2-.1-.3 0-.1 0-.2.1-.3l2.2-2.2c.1-.1.2-.1.3-.1.1 0 .2 0 .3.1l1.4 1.4c.1.3.3.4.6.4.2 0 .5 0 .7-.1l.6-.3c.2-.1.4-.2.5-.4.1-.2.2-.4.2-.6v-2c0-.1 0-.2.1-.3.1-.1.2-.1.3-.1h3.1c.1 0 .2 0 .3.1.1.1.1.1.1.3v2c0 .2.1.4.3.7.1.2.3.3.6.4l.6.3h.5c.3 0 .5-.1.6-.3L18 3.3c.1-.1.2-.1.3-.1.1 0 .2 0 .3.1l2.2 2.2c.1.1.1.2.1.3 0 .1 0 .2-.1.3l-1.4 1.4c-.2.2-.3.4-.4.6 0 .2 0 .5.1.7l.3.6c.1.2.2.4.4.5.2.1.4.2.7.2h2c.1 0 .2 0 .3.1.1.1.1.2.1.3v3.1zM12 7.3c-.6 0-1.3.1-1.9.3-.5.2-1 .6-1.4 1-.4.4-.8.9-1 1.4-.2.6-.3 1.2-.3 1.9s.1 1.2.3 1.8c.2.6.6 1 1 1.4.4.4.9.8 1.4 1 .6.3 1.2.4 1.9.4s1.2-.1 1.8-.4c.6-.2 1-.6 1.4-1 .4-.4.8-.9 1-1.4.3-.6.4-1.2.4-1.8s-.1-1.3-.4-1.9c-.2-.5-.6-1-1-1.4-.4-.4-.9-.8-1.4-1-.6-.1-1.2-.3-1.8-.3zm.1 2.8c-.5 0-1 .2-1.4.5-.4.4-.5.9-.5 1.4 0 .5.2 1 .5 1.3.4.4.9.6 1.4.6.5 0 1-.2 1.3-.6s.6-.8.6-1.3-.2-1-.6-1.4c-.4-.3-.8-.5-1.3-.5z"
      fill="none"
      stroke="#0cf"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

iconsSettings.infoButton = (
  <svg viewBox="0 0 202.978 202.978">
    <path
      d="M100.942.001C44.9.304-.297 45.98.006 102.031c.293 56.051 45.998 101.238 102.02 100.945 56.081-.303 101.248-45.978 100.945-102.02C202.659 44.886 157.013-.292 100.942.001zm1.006 186.435c-46.916.234-85.108-37.576-85.372-84.492-.244-46.907 37.537-85.157 84.453-85.411 46.926-.254 85.167 37.596 85.421 84.483.245 46.935-37.595 85.166-84.502 85.42zm15.036-40.537l-.42-75.865-39.149.254.078 16.6 10.63-.059.313 59.237-11.275.039.088 15.857 49.134-.264-.098-15.847-9.301.048zm-14.919-87.062c9.575-.039 15.349-6.448 15.3-14.323-.254-8.07-5.882-14.225-15.095-14.186-9.184.059-15.173 6.292-15.134 14.362.049 7.865 5.892 14.216 14.929 14.147z"
      fill="#010002"
    />
  </svg>
);

iconsSettings.paintbrush = (
  <svg viewBox="0 0 24 24">
    <path
      d="M15.9 1.5l-.1-.1c-.5-.5-1-.8-1.4-.8-.4 0-.7.2-1 .5L5.7 8.8c-.3.3-.4.6-.4 1s.1.8.4 1.1l1.7 1.6c.1.1.1.2.1.3.1.1.1.2.1.3 0 .1 0 .2-.1.3-.1.1-.1.2-.2.2l-4.5 3c-.5.3-.8.6-1 .8-.7.7-1 1.5-1 2.4 0 1 .3 1.8 1 2.5s1.5 1 2.4 1c1 0 1.8-.4 2.5-1 .2-.2.4-.5.8-1l3-4.5c.1-.1.1-.2.3-.3.1 0 .2-.1.3-.1.1 0 .2 0 .3.1.1 0 .2.1.3.1l1.7 1.6c.3.3.6.5 1.1.5.4 0 .8-.1 1-.5l7.7-7.6c.3-.3.4-.7.4-1.1 0-.3-.1-.5-.2-.7 0-.1-.1-.2-.1-.2l-.1-.1-1.2-.8-4.9 3.3H17s-.1 0-.1-.1l-.1-.1s0-.1.1-.1l3.3-4.8-2.5-2.4-1.9.9h-.1s-.1 0-.1-.1l-.1-.1v-.1l.9-1.9-.5-.7zM4.3 18.7c.2 0 .4.1.6.3s.3.4.3.6c0 .2-.1.4-.3.6s-.4.3-.6.3c-.3 0-.5-.1-.6-.3-.2-.2-.3-.4-.3-.6 0-.3.1-.5.3-.6.2-.2.4-.3.6-.3zm12.1-3.8L9 7.6"
      fill="none"
      stroke="#0cf"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

iconsSettings.permanent = (
  <svg viewBox="0 0 469.333 469.333">
    <path d="M99.76 253.6c-2.688-2.697-6.573-3.717-10.292-2.77a10.66 10.66 0 00-7.542 7.518c-6.792 25.042-23.854 52.561-46.802 75.5a10.652 10.652 0 00-.01 15.067l85.333 85.454a10.664 10.664 0 0015.094.01c22.99-22.98 50.563-40.035 75.656-46.793a10.654 10.654 0 007.521-7.549 10.62 10.62 0 00-2.76-10.287L99.76 253.6zM464.063 57.911a10.926 10.926 0 00-1.469-1.833L413.615 6.953a10.781 10.781 0 00-1.865-1.489c-11.271-7.112-21.854-7.643-34.646.552l-270.51 207.205a10.695 10.695 0 00-4.156 7.768 10.663 10.663 0 003.104 8.236l134.74 134.684a10.652 10.652 0 008.24 3.103 10.706 10.706 0 007.771-4.154l207.77-271.107c3.542-5.612 5.271-11.152 5.271-16.92s-1.73-11.308-5.271-16.92zM41.365 385.358c-2-2.01-4.719-3.134-7.542-3.134h-.01a10.664 10.664 0 00-7.542 3.124l-14.313 14.307C4.25 407.359 0 417.605 0 428.496c-.01 10.912 4.24 21.168 11.948 28.873 7.708 7.716 17.969 11.964 28.875 11.964h.021c10.906 0 21.156-4.248 28.865-11.953l14.271-14.265a10.652 10.652 0 00.01-15.067l-42.625-42.69z" />
  </svg>
);

iconsSettings.scale = (
  <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
    <defs>
      <path
        id="scale__a"
        stroke="#0CF"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        d="M18.7 5.7l-5.15 5.05m8.6-3.3V2h-4.8m4.8 14.95v5.45h-4.8M2.25 7.45V2h4.8m-4.8 14.95v5.45h4.8m-1-4.25l4.8-4.7"
      />
      <path
        id="scale__b"
        stroke="#0CF"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        d="M18.531 5.456l-2.192.142m2.299 2.298l.106-2.228"
      />
      <path
        id="scale__c"
        stroke="#0CF"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        d="M5.762 16.306l-.106 2.227m.212.212l2.192-.141"
      />
    </defs>
    <use xlinkHref="#scale__a" />
    <use xlinkHref="#scale__b" transform="translate(.04 -.023) scale(.99998)" />
    <use xlinkHref="#scale__c" transform="translate(0 .009) scale(.99998)" />
  </svg>
);

iconsSettings.search = (
  <svg
    className="search__icon"
    style={{
      width: "1em",
      height: "1em",
      verticalAlign: "middle",
    }}
    viewBox="0 0 1024 1024"
    fill="currentColor"
    overflow="hidden"
  >
    <path d="M959.744 870.592L759.936 670.784a382.08 382.08 0 0071.552-222.72c0-212.032-171.968-384-384-384S64 235.968 64 448s171.456 384 383.488 384a381.952 381.952 0 00222.72-71.552l199.808 199.808 89.728-89.664zM447.488 704a256 256 0 110-512 256 256 0 010 512z" />
  </svg>
);

iconsSettings.ui = (
  <svg height={512} viewBox="0 0 441.618 441.618" width={512}>
    <path d="M110.809 339.868h53.529v53.529h-53.529zM0 354.632c0 14.781 11.984 26.765 26.765 26.765H53.53v-53.529H0zM-.25 228.809h53.529v53.529H-.25zM-.25 117.75h53.529v53.529H-.25zM0 33.456v26.765h53.529V6.691H26.765C11.984 6.691 0 18.675 0 33.456zM110.809 6.691h53.529V60.22h-53.529zM221.868 6.691h53.529V60.22h-53.529zM374.706 33.456c0-14.781-11.984-26.765-26.765-26.765h-26.765V60.22h53.529V33.456zM332.926 117.75h53.529v53.529h-53.529zM254.265 194.044v240.882l80.294-66.912h107.059z" />
  </svg>
);

iconsSettings.advanced = (
  <svg width={36.07} height={36.063} viewBox="0 0 36.07 36.063">
    <path
      d="M18.03 24.798a6.76 6.76 0 116.76-6.76 6.766 6.766 0 01-6.76 6.76zm0-11.266a4.506 4.506 0 104.51 4.506 4.509 4.509 0 00-4.51-4.506zm1.13 22.531h-2.25a3.379 3.379 0 01-3.38-3.379v-1.908q-.675-.238-1.32-.541l-1.35 1.346a3.462 3.462 0 01-4.78 0l-1.59-1.593a3.381 3.381 0 010-4.781l1.35-1.347a12 12 0 01-.55-1.316h-1.9a3.379 3.379 0 01-3.38-3.379v-2.253a3.379 3.379 0 013.38-3.379h1.9a12.085 12.085 0 01.55-1.316L4.49 10.87a3.381 3.381 0 010-4.781l1.59-1.593a3.467 3.467 0 014.78 0l1.35 1.347a14.062 14.062 0 011.32-.542V3.393a3.38 3.38 0 013.38-3.38h2.25a3.386 3.386 0 013.38 3.38V5.3a12.862 12.862 0 011.31.542l1.35-1.347a3.463 3.463 0 014.78 0l1.6 1.593a3.4 3.4 0 010 4.781l-1.35 1.347c.2.425.38.865.54 1.316h1.91a3.386 3.386 0 013.38 3.379v2.254a3.386 3.386 0 01-3.38 3.379h-1.91c-.16.451-.34.892-.54 1.316l1.35 1.347a3.4 3.4 0 010 4.781l-1.6 1.593a3.46 3.46 0 01-4.78 0l-1.35-1.346a13.088 13.088 0 01-1.31.541v1.908a3.386 3.386 0 01-3.38 3.379zm-7.36-8.607l.74.416a11.188 11.188 0 002.42.994l.82.233v3.585a1.132 1.132 0 001.13 1.126h2.25a1.132 1.132 0 001.13-1.126v-3.585l.82-.233a11.317 11.317 0 002.41-.994l.74-.416 2.53 2.532a1.163 1.163 0 001.6 0l1.59-1.593a1.129 1.129 0 000-1.595l-2.53-2.531.42-.743a11.437 11.437 0 00.99-2.414l.23-.821h3.59a1.123 1.123 0 001.12-1.126v-2.253a1.123 1.123 0 00-1.12-1.126h-3.59l-.23-.821a11.407 11.407 0 00-.99-2.413l-.42-.744 2.53-2.531a1.129 1.129 0 000-1.595l-1.59-1.593a1.159 1.159 0 00-1.6 0l-2.53 2.533-.74-.416a11.32 11.32 0 00-2.41-1l-.82-.233v-3.58a1.132 1.132 0 00-1.13-1.127h-2.25a1.132 1.132 0 00-1.13 1.127v3.584l-.82.233a11.191 11.191 0 00-2.42 1l-.74.416-2.53-2.533a1.147 1.147 0 00-1.59 0l-1.6 1.593a1.129 1.129 0 000 1.595l2.53 2.531-.41.744a11.433 11.433 0 00-1 2.413l-.23.821H3.39a1.132 1.132 0 00-1.13 1.126v2.254a1.132 1.132 0 001.13 1.126h3.58l.23.821a11.463 11.463 0 001 2.414l.41.743-2.53 2.531a1.129 1.129 0 000 1.595l1.6 1.593a1.151 1.151 0 001.59 0z"
      fill="#464a53"
      fillRule="evenodd"
    />
  </svg>
);

iconsSettings.box = (
  <svg width={33} height={33} viewBox="0 0 33 33">
    <image
      data-name="Vector Smart Object"
      width={33}
      height={33}
      xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAADUElEQVRYhcWXXYiWRRTHf2659mEtGJimCCJkUKhXIW6lgk40KagDQRd5KQkJWyjdWXtpH7gIdRERhB8X6hRojTp+UAgLehEZEUUfiglbFFQXamntxsHzLMfxed53XXfd/9WcM2ee858z58ycZ5Lz4W2gB+jg9mMQ6OuYQAKo356OCSQwTOTOQvEkcOE2OJ4NnKyEksSFnOK58WbgfLhOLknc6senAmuBRzXpzgAHcoqXW60bMxLOh3XAe8ADxdQvzof1OcWjTWvHJCmdDxLf/TUEBDOAT50PS8eNhPOhSyMwSVVXxSkgO/9PdZPFxvlQ628sIiHHME3HV4BlOcVVOUWn+VHhYWDxqEk4H1Y6Hw44HzbWTD9ixgdziv2VkFM8CHzfYDtyEs6H+4B9wGrgXefD/MLkHzN+sFgrid9lVH/X+RhJdbxYfOhZ4Dsj95vxE86HXqBXN7gdmG7mT9U5aBkJ50Mn8HKpLuQMfGHkrcAfwJ/AS0Yv98WPN00CWA/MLHRPOR/uGmaQolxKzwEDxuZ+4F4ji/MNTU4aSWg5ba6ZulvCbhW6w8VamhZDwEdAd07x1yZfrXJiDWCTcMBE5WngWEHkPLDK+TAHeEwJfJlTHKANWpF41Yw/Az4HXlNZ8mJL3SIlc76dY4va43A+LAceN6ptmoAVFjgfZtSsW+h82OF8eP6WSRRR+Ao4ouX1l/VpnEubKPlzGtgE7NFSHR0J2Y2eeYVtOcWhnKK8AyeMfqXaP6RRehPoNPNbnQ9vCMGbJlFEQRqcvUY+bPk6H9ZopFY0fH+L3rItiZQk5mrNV3grp/ivkW1PIDfhx8Xz3a+EfjI6uXE/dD7cMVIScq6V8e/AB3Yyp3gW+KHmO3JUr8tFllM8Diwt7F7QPOmsWXsDCW/GOxrassOFfFad92reCFlplpcAXxs7ifB+58OUdiQqXATeaZjbqY2LYBewyD7fFXKKvwHLtWIqyEt8CLjH2kppyc1WYntO8ZUGElIRs+RlzSl+02RjbLv0Ou826m9tb1FHQnY5L6f4czsHI4XzQXb+iUbmBtQdx+6xJMC1o7kEPCOdV918XSSkaWkb5lFCquN9/dMbRt0DVj7H444O/VOaSAwKib4JJDII9P0PxVnxHMN8V0YAAAAASUVORK5CYII="
    />
  </svg>
);

iconsSettings.button = (
  <svg width={33} height={33} viewBox="0 0 33 33">
    <image
      data-name="Vector Smart Object"
      width={33}
      height={33}
      xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAACkUlEQVRYhe2WOWhWQRDHf/k88AAhfoJ4FEYQElCxEMWrUhZZLIQVREQkWIiImkIEKxMvRPECC49CS0EWUoQVtxBBEEVIo8RUoiEiguCFKDFGWd0vbDbv+I74xSL/5s3Om535vze7M9MgpDoPtAEF6o8h4FJhHAng47YVxpHAMJHJkWID0F+HwAuBh6VFTKLfGv3qXzMQUo1Yj3cq/mCCRAkTJEr4L0jEVzQXQqoVwBFgEdADnLZGv6yFREV/Qki1HngE7ADWAHuAJ0KqJXUjAVwEpke6OcCJepJYGcg2kFfVk0SIu4E8T0jVLqSaXY0jN0/8CtYvgEFgll9PA94CO63RPZHtIeBygs83wHFr9HX+nqMW4Gjg0z1nAKtLG+Lb0ZLgdC6wDzgQ6buBAWBqpF8AXBNSnQE6gWVRGkfBpeN5loHHUiHVwUjnWv5yYBfwNGFPI9CaR8DFd+lwp3uz/ytu3PrsX34HzvovSUJTqe0LqWYC6wD3vANMiuxv+poyGOh+Ah+Aew1p9IRU24HbGV/QlDR7CKmagfnADWCxV7dao2+lOcq6HZsC+TXwI8N2GNboXmv0feBLOfZ5JL4G8idgb/T+W7lBaiHRGcjuABb9QXvseoc1+t1YkUhtYNboB0KqLmCLV3UAzVm5rRZ5FXN/kBZXYC5UEKcYyB+zDDNJWKP7gJOBapuQamtedCFVox/rS+irmoSH+/reYH1VSFXM3DGyobl686wmEtboAX8gh7zKlfFjOds2BnK3NTrzeqcWqxhCqnPAYa92TtcC71PMTdCH2q3RHVm+KxnvTvlJyuV7Skq/SEJXnkHZ84Q12p1w10sqgau0rtuODQmPK75BhY0oDW743W2NDmeQ0QB+A04+mdrY1A9ZAAAAAElFTkSuQmCC"
    />
  </svg>
);

iconsSettings.content = (
  <svg width={27.07} height={36.063} viewBox="0 0 27.07 36.063">
    <path
      d="M22.55 9.025H4.52V6.772h18.03v2.253zm-4.51 4.507H4.52v-2.253h13.52v2.253zm-2.25 4.506H4.52v-2.253h11.27v2.253zm2.25 18.025H.01V.012h27.05V27.05h-9.02v9.012zM2.26 33.81h13.53v-9.012h9.01V2.266H2.26v31.546zm16.24 2.253H.01v-2.251h17.57l7.22-7.047v-24.5h2.26v25.447z"
      fill="#464a53"
      fillRule="evenodd"
    />
  </svg>
);

iconsSettings.padding = (
  <svg width={34} height={35} viewBox="0 0 34 35">
    <image
      data-name="Vector Smart Object"
      width={34}
      height={35}
      xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAYAAADxG9hnAAACtUlEQVRYhe2Yv2sWMRjHP71WBAetoChScPMHiIqg1IK/OgSJQ6HpUB3UzbWz/4PQ1a04OTQFl1AyWKRSEUG0HawORaSI4tAqIhT6Q2LTEu9N7u493mqHfuCFS57nyfO995Lck2sTUj0AhoCMNF+AG9bo1wU+DQipzgEGOFTgtgoMZxVEOA4Dg82I8AyWiMDnHsoqiHAsAeM1hIz72DIy92jWAqdLwHwkaMEa/b2GEPd4OoHOiKkLmNxodOSM89boj3USprBGLwKLEYF/tfNCQscjwLGI6YM1+nNR8oLYOWv0p1hMVIiQ6gzwEtgdMS8JqXpSK8ivlKlE7LKQqtcaPZk3pCbqlcRA+P4LCRvelop1N96bMsQIBa4AP4P2NKALhDjbLeB00LcH2OWv25oREvLcGn21gt8frNHfgMthn5BqBLhTFJcFM3rZLdOqCVvAgs/pWHRC+oFHwEDdvaIOPteAz93fYY2eACZyY4Wb3MoWinkCuF9y1UwFAp62IOeL3NgNRGcw6xPsJHDQbcPW6LWUX1WEVN3AL2v0dAtubIcd/h/bZtVE9xEh1XlgBngG3G+BiHt+L3krpBKVhQA9QLu/jr62m+RibuwGOoRU14C7wJjfcsk9svY6masgpOrz77oR94+MAbeBUSHVvq1KmsfnGvW5x7Kgwna1yf5/JYT1XBv1UGeVwqhbSBVW9m/cXVijf8SchVR7/av9bNB9oCxJSki4XF39eTRou+ubwMNErLP1lSXOU6UMyLPql3aKGe+TIloGRP8Ra/QrIdUp4ETE/N4a/S6VxRo95WOPR8xzqQ0tOUes0bPAbPK+CvBCk2KrCOnKHwU9W3X23SR/CE/hTvTSGt1U2ehOdf77SOrAtUlWMrE2cANdb0aEx8WUinAanJDhCmLcF6PHNYS4mK9lIoDh3xVfyh3Dee4dAAAAAElFTkSuQmCC"
    />
  </svg>
);

iconsSettings.style = (
  <svg width={22.57} height={36.063} viewBox="0 0 22.57 36.063">
    <path
      d="M.02.012v15.772a4.508 4.508 0 004.51 4.506h2.25v11.266a4.51 4.51 0 009.02 0V20.291h2.26a4.508 4.508 0 004.51-4.506V.012H.02zm20.29 15.772a2.255 2.255 0 01-2.25 2.253h-4.51v13.519a2.255 2.255 0 01-4.51 0V18.038H4.53a2.257 2.257 0 01-2.26-2.253v-2.253h18.04v2.253zM2.27 11.278V2.266h4.51v6.759h2.26V2.266h4.51v6.759h2.25V2.266h4.51v9.013H2.27z"
      fill="#464a53"
      fillRule="evenodd"
    />
  </svg>
);

iconsSettings.colors = (
  <svg width={31} height={29} viewBox="0 0 31 29">
    <image
      data-name="Vector Smart Object"
      width={31}
      height={29}
      xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAdCAYAAABSZrcyAAABrklEQVRIie2Xv0sDMRTHP9VaoSiKODmIgiAioq5uRemmtU5OCqKTDi5O4uAi6OYgCoII4uqf0EUQFzu42EH8NUsRNwWtPHiBGO96V1tuui+ES5OXfPKSd827xPTcwgRwAKSITp/AahLIAWMRgo1yAm/SHxXgJQJoL5AQbtJqfAf6IoC/AR1SSfoYjABbwIC1M0ayQ9fAGvClXuwCUz62D8AOcONCvOA9wKVZnY8kRs6AK2AI2AiwzQLD7rG6KxXlA8BGKedZTW3AjNtvw9PAKbDiLCRhle0AyL5jn7f6lnX+tGmwt70FWAzhxX81quWX5yWfyST6i3UCizqPl0ri+YkGTqtjIMFRrhMuc/Tru23rw8DldbirE1JNZT8nvKI9MsXwGB7DY7iroKu2s5FwuasL+hcsZd3qe9Tnk2Y06K1obAtBGXEQfBDIeLQfAc9al5xsz8Mmo+N95ZfDGTVb9VfgFrgADh27TeAemAfGgW6P8X9Uy5mfA5P6gfHt9FX0as6qXSgFeW5rCZgNYdfVKLgJJFG7llpkj68ZLknGMSDfc5IQhpUcg2RH/kkK8AM7ikeScb6UCQAAAABJRU5ErkJggg=="
    />
  </svg>
);

iconsSettings.width = (
  <svg width={34} height={35} viewBox="0 0 34 35">
    <image
      data-name="Vector Smart Object"
      width={34}
      height={35}
      xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAYAAADxG9hnAAACuElEQVRYhcWYPWgUQRTHfzkDigrJFYpKQLFSDPjRKxhwlAmIZFKkELETsUgEQQsrGwsRrgpWothYOBELxzCg2AjaiCgKqTRg/CKQxEIU1MjTCSyT3du7ZS7+m7udfW/eb3fmvXl3XUqbq8AYUKNYn4BB7+zzJjbLpLTZB9wHNjUx+w00ai1AECYaaQciaKQEghB7rNYChOgHMFkBZDL4lqkmS7OYMRoEPuQ4TXtn5yqAyPLUga05t7aEZfur7ujmG+/suyoBixQeYNlDKG3ms9cxSDIpbbYBx4ANQC+wGZgBznpnf8ZxOgKitJF5n4TXH2sHcCgebGWjVpGAbCzw25s32BEQ7+x34DjwEliMbk+vGEjQWqAf6IrGZ4pAlnavbKBKKRpLaXMauJ550Gwt+RY+50JM0bwYDgG3gGHv7EIiiPHM0FfgQub6If+WT2INh9hD8WvrBITyzj5T2uwB1nhnn+b5JgNpBtGKfxIQpc3A0isPmpVa4Z190eocqQpafwQx4J191c4EqUBuAvsBOeBGvbOvE81bLjlVlTbrUs1XqaApbU4BX6Q4KW12/ReQkB3XwrL2AIdXHERpcy5KUdmYd1cURGkj1fFKBCHZ8TYFSG4dUdqsBy4Cq4BLwBngcg5EWynaTN1Km4PASWDCO3sv2I4C58P33VEjkwxCaXMUMMANWZoJ4ARwR2nTE2y2Z+yzEB8TQkgsG2JP1EI/SciCevieVx+kuz+QcDnqmYLaW7RZ6zlj0n82lDZJT+wltVtHBgsa4o6BNIBfOeOPwz5JrtxDzzv7IJTuncBCaOtmvbPvOwFBs9PXOzsFTHUqcBlIn9Imz26uaj8b0jRv8/dlL+If4UWSLlx7Zx+1CSGdmwNWl9nWwh8lZZKJjrQDESQ+pRDCICCSIWUwn4HbFUDER3ybQgCNP6+jw3mkd8G5AAAAAElFTkSuQmCC"
    />
  </svg>
);

iconsSettings.reset = (
  <svg viewBox="0 0 17 16">
      <path d="M16.55.91v5c0 .27-.1.5-.3.7s-.43.3-.7.3h-5.09c-.27 0-.51-.1-.7-.3-.2-.2-.3-.44-.3-.72s.1-.52.3-.72c.2-.2.43-.3.7-.3h2.56c-.63-.9-1.29-1.6-1.98-2.13-.7-.52-1.56-.78-2.58-.78-1.63 0-3.01.57-4.14 1.7-1.14 1.14-1.7 2.51-1.7 4.12 0 1.62.57 2.99 1.7 4.13 1.13 1.14 2.52 1.7 4.14 1.7 1.25 0 2.39-.37 3.41-1.11 1.02-.74 1.73-1.7 2.12-2.89.08-.27.25-.47.52-.61.26-.13.53-.16.8-.06s.47.27.59.52.15.51.06.78a7.759 7.759 0 01-2.88 3.94c-1.37 1-2.92 1.5-4.62 1.5-2.19 0-4.05-.77-5.59-2.31S.56 9.97.56 7.79s.77-4.04 2.31-5.58C4.4.68 6.27-.09 8.46-.09c.35 0 .69.02 1.02.06.32.04.61.09.88.14.26.05.53.14.8.27s.49.23.67.31c.18.08.38.21.61.39.23.18.4.31.52.41s.27.25.47.47.33.36.39.44.19.23.38.47.3.38.34.42V.91c0-.27.1-.5.3-.7s.44-.3.72-.3.52.1.72.3.27.43.27.7z" />
    </svg>
);

iconsSettings.placeholderImage = (
  <svg
    preserveAspectRatio="none"
    x="0px"
    y="0px"
    width="600px"
    height="400px"
    viewBox="0 0 600 400"
  >
    <defs>
      <g id="Layer0_0_FILL">
        <path
          fill="#F2F2F2"
          stroke="none"
          d="M 50.75 50.95L 48.3 51.8 46.05 399.5 553.15 399.5 553.15 47.95 297.4 250.7 50.75 50.95M 320.25 118.7Q 311.7 110.1 299.6 110.1 292.1 110.1 286 113.35 282.2 115.4 278.9 118.7 270.35 127.25 270.35 139.35 270.35 151.45 278.9 160.05 282.2 163.35 286 165.35 292.1 168.6 299.6 168.6 311.7 168.6 320.25 160.05 328.85 151.45 328.85 139.35 328.85 127.25 320.25 118.7 Z"
        />
        <path
          fill="#FFFFFF"
          stroke="none"
          d="M -0.45 0.05L -0.45 399.5 46.05 399.5 48.3 51.8 50.75 50.95 297.4 250.7 553.15 47.95 553.15 399.5 600.5 399.5 600.5 0.05 -0.45 0.05M 299.6 110.1Q 311.7 110.1 320.25 118.7 328.85 127.25 328.85 139.35 328.85 151.45 320.25 160.05 311.7 168.6 299.6 168.6 292.1 168.6 286 165.35 282.2 163.35 278.9 160.05 270.35 151.45 270.35 139.35 270.35 127.25 278.9 118.7 282.2 115.4 286 113.35 292.1 110.1 299.6 110.1 Z"
        />
      </g>
    </defs>
    <g transform="matrix( 1, 0, 0, 1, 0,0) ">
      <use href="#Layer0_0_FILL" />
    </g>
  </svg>
);

iconsSettings.typography = (
  <svg preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
    <defs>
      <path
        id="headers__a"
        stroke="#464a53"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        d="M1.75 2.4v5.4h3.2V6.4q0-.4.3-.65.25-.3.65-.3h4.15V17.2q0 .55-.4.95-.4.4-.95.4H7.35v3.05h9.25v-3.05h-1.3q-.55 0-.95-.4-.4-.4-.4-.95V5.45h4.15q.35 0 .65.3.25.25.25.65v1.4h3.2V2.4H1.75z"
      />
    </defs>
    <use xlinkHref="#headers__a" />
  </svg>
);

iconsSettings.colorWheel = (
  <svg x="0px" y="0px" viewBox="0 0 24 24" xmlSpace="preserve">
    <path d="M20.2 3.7C18.8 2.3 17 1.2 15 .7L12 12l8.2-8.3z" fill="#fac712" />
    <path
      d="M15 .7c-1-.3-2-.4-3-.4S9.9.4 9 .7l.1.3c0 .1.1.2.1.4l.1.2c0 .1.1.2.1.3V2c0 .1 0 .2.1.3l.2.7.1.5v.1L12 12l1.9-7.1L15 .7z"
      fill="#feef00"
    />
    <path d="M23.3 9c-.5-2-1.6-3.8-3-5.2L18 6l-6 6 11.3-3z" fill="#f69f23" />
    <path
      d="M15 23.3l-1.1-4.2L12 12 9 23.3c1 .3 2 .4 3 .4s2.1-.2 3-.4z"
      fill="#7421b0"
    />
    <path
      d="M12 12l-8.3 8.3c1.4 1.4 3.2 2.5 5.2 3l1.1-4.2 2-7.1z"
      fill="#3a48ba"
    />
    <path
      d="M20.2 20.3c.1 0 .1 0 0 0l-3.1-3.1L12 12l3 11.3c2-.6 3.8-1.6 5.2-3z"
      fill="#d2298e"
    />
    <path d="M12 12L.7 15c.5 2 1.6 3.8 3 5.2l3.1-3.1L12 12z" fill="#006fc4" />
    <path
      d="M23.3 15l-4.2-1.1L12 12l8.3 8.3c1.4-1.5 2.4-3.3 3-5.3z"
      fill="#ff2600"
    />
    <path
      d="M23.7 12c0-1-.1-2.1-.4-3l-4.2 1.1L12 12l11.3 3c.2-.9.4-2 .4-3z"
      fill="#fb6312"
    />
    <path
      d="M12 12L.7 9c-.3 1-.4 2-.4 3s.1 2.1.4 3l4.2-1.1L12 12z"
      fill="#00c2af"
    />
    <path
      d="M12 12l-1.9-7.1v-.2l-.1-.3c-.1-.2-.1-.4-.2-.6l-.1-.5v-.2l-.2-.4-.5-2c-2 .5-3.8 1.6-5.2 3L12 12z"
      fill="#7fd200"
    />
    <path
      d="M12 12L3.7 3.7C2.3 5.2 1.3 7 .7 9c1 .3 2.1.6 4.2 1.1L12 12z"
      fill="#00b500"
    />
  </svg>
);

iconsSettings.gradient = () => {
  let gradient_id = makeid(5);
  return(
    <svg data-name="Layer 1" viewBox="0 0 23.4 23.4">
        <defs>
          <linearGradient
            id={gradient_id}
            x1={0.3}
            y1={14}
            x2={23.67}
            y2={14}
            gradientTransform="matrix(1 0 0 -1 -.3 25.7)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#fff" />
            <stop offset={1} />
          </linearGradient>
        </defs>
        <title>{"gradient"}</title>
        <circle cx={11.7} cy={11.7} r={11.7} fill={'url(#'+gradient_id+')'} />
      </svg>
    );
} 

export default iconsSettings;