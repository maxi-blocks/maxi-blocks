/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, flattenDeep, findIndex } from 'lodash';

/**
 * Component
 */
const MotionPreview = props => {
	const { className, motion, children } = props;

	const motionValue = !isObject(motion) ? JSON.parse(motion) : motion;

	const res = flattenDeep(Object.entries(motionValue.interaction.timeline));

	let transformStyle = '';

	if (
		findIndex(res, { type: 'move' }) !== -1 ||
		findIndex(res, { type: 'scale' }) !== -1 ||
		findIndex(res, { type: 'rotate' }) !== -1
	) {
		transformStyle += 'perspective(1000px)';
	}
	if (findIndex(res, { type: 'move' }) !== -1) {
		transformStyle += ` translate3d(${
			res[findIndex(res, { type: 'move' })].settings.x
		}px, ${res[findIndex(res, { type: 'move' })].settings.y}px, ${
			res[findIndex(res, { type: 'move' })].settings.z
		}px)`;
	}
	if (findIndex(res, { type: 'scale' }) !== -1) {
		transformStyle += ` scale3d(${
			res[findIndex(res, { type: 'scale' })].settings.x
		}, ${res[findIndex(res, { type: 'scale' })].settings.y}, ${
			res[findIndex(res, { type: 'scale' })].settings.z
		})`;
	}
	if (findIndex(res, { type: 'rotate' }) !== -1) {
		transformStyle += ` rotateX(${
			res[findIndex(res, { type: 'rotate' })].settings.x
		}deg)
			rotateY(${res[findIndex(res, { type: 'rotate' })].settings.y}deg)
			rotateZ(${res[findIndex(res, { type: 'rotate' })].settings.z}deg) `;
	}
	if (findIndex(res, { type: 'skew' }) !== -1) {
		transformStyle += ` skewX(${
			res[findIndex(res, { type: 'skew' })].settings.x
		}deg)
			skewY(${res[findIndex(res, { type: 'skew' })].settings.y}deg)
			 `;
	}

	let motionPreview = {
		transformOrigin: `${motionValue.interaction.transformOrigin.xAxis} ${motionValue.interaction.transformOrigin.yAxis}`,
		transformStyle: 'preserve-3d',
		transform: transformStyle,
		opacity:
			findIndex(res, { type: 'opacity' }) !== -1 &&
			res[findIndex(res, { type: 'opacity' })].settings.opacity,
		filter:
			findIndex(res, { type: 'blur' }) !== -1 &&
			`blur(${res[findIndex(res, { type: 'blur' })].settings.blur}px)`,
	};

	const classes = classnames('maxi-motion-preview', className);

	return (
		<div
			className={classes}
			style={
				!!motionValue.interaction.previewStatus ? motionPreview : null
			}
		>
			{children}
		</div>
	);
};

export default MotionPreview;
