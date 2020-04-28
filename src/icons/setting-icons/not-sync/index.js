/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const notSync = (
    <SVG preserveAspectRatio="none" width={24} height={24} viewBox="0 0 24 24">
        <defs>
            <Path
                fill="#464A53"
                d="M35.5 8.9q0-3.4-2.45-5.85Q30.55.6 27.1.6 23.7.6 21.2 3l-6.5 6.5 1.5-.1q2.1 0 4 .8l4-4Q25.55 5 27.1 5q1.65 0 2.85 1.2Q31.1 7.35 31.1 9q0 1.75-1.25 2.8L22.7 19q-1.1 1.15-2.8 1.15-1.65 0-2.8-1.15L14 22.1q2.4 2.4 5.85 2.4 3.4 0 5.9-2.4l7.3-7.3q2.45-2.45 2.45-5.9z"
                id="notsync__c"
            />
            <Path
                fill="#464A53"
                d="M10.4 13.9l-7.3 7.3Q.7 23.6.7 27.1q0 3.45 2.45 5.9 2.4 2.4 5.85 2.4 3.35 0 5.85-2.4l6.4-6.4-1.4.1q-2.45 0-4.05-.8l-4 4q-1.2 1.2-2.8 1.2-1.65 0-2.8-1.15Q5 28.75 5 27.1q0-1.75 1.15-2.8L13.5 17q1.15-1.1 2.8-1.1 1.7 0 2.8 1.1l3.1-3.1q-2.3-2.3-5.85-2.3t-5.95 2.3z"
                id="notsync__b"
            />
        </defs>
        <use xlinkHref="#notsync__c" transform="matrix(.66379 0 0 .66379 0 .05)" />
        <use xlinkHref="#notsync__b" transform="matrix(.66379 0 0 .66379 0 .05)" />
    </SVG>
)

export default notSync;