/**
 * WordPress dependencies
 */
const { SVG } = wp.primitives;

const getUniqueID = () => {
    const d = new Date();
    const a = d.getMinutes();
    const b = d.getSeconds();
    const c = d.getMilliseconds();

    return `${a}${b}${c}`;
}

const uniqueID = 'gradient_' + getUniqueID();

const gradient = (
    <SVG x="24px" y="24px" viewBox="0 0 24 24" xmlSpace="preserve">
        <linearGradient
            id={uniqueID}
            gradientUnits="userSpaceOnUse"
            x1={0.3129}
            y1={12}
            x2={23.687}
            y2={12}
        >
            <stop offset={0} stopColor="#fff" />
            <stop offset={1} />
        </linearGradient>
        <circle cx={12} cy={12} r={11.7} fill={`url(#${uniqueID})`} />
    </SVG>
)

export default gradient;