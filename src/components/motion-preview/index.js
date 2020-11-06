/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isEmpty, isNull } from 'lodash';

/**
 * Component
 */
const MotionPreview = props => {
	const { className, motion, children } = props;

	const motionValue = !isObject(motion) ? JSON.parse(motion) : motion;

	let motionPreview = {};

	if (!isEmpty(motionValue.interaction.timeline)) {
		const currentTime = motionValue.interaction.activeTimeline.time;
		const currentIndex = motionValue.interaction.activeTimeline.index;

		if (!isNull(currentTime)) {
			const currentItem =
				motionValue.interaction.timeline[currentTime][currentIndex];

			let transformStyle = '';

			if (
				currentItem.type === 'move' ||
				currentItem.type === 'scale' ||
				currentItem.type === 'rotate'
			) {
				transformStyle += 'perspective(1000px)';
			}

			if (currentItem.type === 'move') {
				const moveUnitX = isEmpty(currentItem.settings.unitX)
					? 'px'
					: currentItem.settings.unitX;

				const moveUnitY = isEmpty(currentItem.settings.unitY)
					? 'px'
					: currentItem.settings.unitY;

				const moveUnitZ = isEmpty(currentItem.settings.unitZ)
					? 'px'
					: currentItem.settings.unitZ;

				transformStyle += ` translate3d(${currentItem.settings.x}${moveUnitX}, ${currentItem.settings.y}${moveUnitY}, ${currentItem.settings.z}${moveUnitZ})`;
			}

			if (currentItem.type === 'scale') {
				transformStyle += ` scale3d(${currentItem.settings.x}, ${currentItem.settings.y}, ${currentItem.settings.z})`;
			}

			if (currentItem.type === 'rotate') {
				transformStyle += ` rotateX(${currentItem.settings.x}deg)
					rotateY(${currentItem.settings.y}deg)
					rotateZ(${currentItem.settings.z}deg) `;
			}

			if (currentItem.type === 'skew') {
				transformStyle += ` skewX(${currentItem.settings.x}deg)
					skewY(${currentItem.settings.y}deg)
					 `;
			}

			motionPreview = {
				transformOrigin: `${motionValue.interaction.transformOrigin.xAxis} ${motionValue.interaction.transformOrigin.yAxis}`,
				transformStyle: 'preserve-3d',
				transform: transformStyle,
				opacity:
					currentItem.type === 'opacity' &&
					currentItem.settings.opacity,
				filter:
					currentItem.type === 'blur' &&
					`blur(${currentItem.settings.blur}px)`,
			};
		}
	}

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
