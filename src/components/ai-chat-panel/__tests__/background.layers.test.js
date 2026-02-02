import { cloneDeep } from 'lodash';
import {
	buildContainerBGroupAction,
	buildContainerBGroupAttributeChanges,
	getContainerBGroupSidebarTarget,
} from '../ai/utils/containerGroups';
import {
	buildButtonBGroupAction,
	buildButtonBGroupAttributeChanges,
	getButtonBGroupSidebarTarget,
} from '../ai/utils/buttonGroups';

const BASE_LAYERS = [
	{
		type: 'color',
		order: 0,
		'background-palette-status-general': true,
		'background-palette-color-general': 2,
		'background-color-general': 'var(--maxi-color-2)',
	},
	{
		type: 'image',
		order: 1,
		'background-image-size-general': 'auto',
	},
	{
		type: 'gradient',
		order: 2,
		'background-gradient-general':
			'linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
	},
];

const buildAttributes = () => ({
	'background-layers': cloneDeep(BASE_LAYERS),
	'background-layers-hover': [],
	'block-background-status-hover': false,
});

const runSuite = ({
	label,
	buildAction,
	buildChanges,
	getSidebar,
	expectedSidebar,
}) => {
	describe(label, () => {
		test('layer operations update attributes and open sidebar', () => {
			const attributes = buildAttributes();

			const addAction = buildAction(
				'Add another background layer with palette 4'
			);
			expect(addAction).toBeTruthy();
			const addChanges = buildChanges(addAction.property, addAction.value, {
				attributes,
			});
			expect(addChanges['background-layers']).toHaveLength(4);
			expect(
				addChanges['background-layers'][3]['background-palette-color-general']
			).toBe(4);
			expect(getSidebar(addAction.property)).toEqual(expectedSidebar);

			const removeAction = buildAction('Remove the top background layer');
			const removeChanges = buildChanges(
				removeAction.property,
				removeAction.value,
				{ attributes }
			);
			expect(removeChanges['background-layers']).toHaveLength(2);
			expect(getSidebar(removeAction.property)).toEqual(expectedSidebar);

			const removeSecondAction = buildAction(
				'Remove the second background layer'
			);
			const removeSecondChanges = buildChanges(
				removeSecondAction.property,
				removeSecondAction.value,
				{ attributes }
			);
			expect(removeSecondChanges['background-layers']).toHaveLength(2);
			expect(
				removeSecondChanges['background-layers'].some(
					layer => layer.type === 'image'
				)
			).toBe(false);
			expect(getSidebar(removeSecondAction.property)).toEqual(expectedSidebar);

			const reorderAction = buildAction(
				'Move the gradient behind the image layer'
			);
			const reorderChanges = buildChanges(
				reorderAction.property,
				reorderAction.value,
				{ attributes }
			);
			const reordered = reorderChanges['background-layers']
				.slice()
				.sort((a, b) => a.order - b.order);
			const gradientIndex = reordered.findIndex(
				layer => layer.type === 'gradient'
			);
			const imageIndex = reordered.findIndex(layer => layer.type === 'image');
			expect(gradientIndex).toBeLessThan(imageIndex);
			expect(getSidebar(reorderAction.property)).toEqual(expectedSidebar);

			const moveAction = buildAction('Move the second background layer up');
			const moveChanges = buildChanges(
				moveAction.property,
				moveAction.value,
				{ attributes }
			);
			const moved = moveChanges['background-layers']
				.slice()
				.sort((a, b) => a.order - b.order);
			expect(moved[moved.length - 1].type).toBe('image');
			expect(getSidebar(moveAction.property)).toEqual(expectedSidebar);

			const moveDownAction = buildAction(
				'Move the top background layer down'
			);
			const moveDownChanges = buildChanges(
				moveDownAction.property,
				moveDownAction.value,
				{ attributes }
			);
			const movedDown = moveDownChanges['background-layers']
				.slice()
				.sort((a, b) => a.order - b.order);
			expect(movedDown[movedDown.length - 1].type).toBe('image');
			expect(getSidebar(moveDownAction.property)).toEqual(expectedSidebar);

			const activeAction = buildAction(
				'Make the active gradient layer opacity 50%'
			);
			const activeChanges = buildChanges(
				activeAction.property,
				activeAction.value,
				{ attributes }
			);
			const updatedGradient = activeChanges['background-layers'].find(
				layer => layer.type === 'gradient'
			);
			expect(updatedGradient['background-gradient-opacity-general']).toBe(0.5);
			expect(getSidebar(activeAction.property)).toEqual(expectedSidebar);
		});

		test('hover layers toggle and update', () => {
			const attributes = buildAttributes();

			const toggleAction = buildAction('Enable hover background layers');
			const toggleChanges = buildChanges(
				toggleAction.property,
				toggleAction.value,
				{ attributes }
			);
			expect(toggleChanges['block-background-status-hover']).toBe(true);
			expect(getSidebar(toggleAction.property)).toEqual(expectedSidebar);

			const hoverAction = buildAction(
				'On hover, add a background overlay layer with palette 3'
			);
			const hoverChanges = buildChanges(
				hoverAction.property,
				hoverAction.value,
				{ attributes }
			);
			expect(hoverChanges['background-layers-hover']).toHaveLength(1);
			expect(
				hoverChanges['background-layers-hover'][0][
					'background-palette-color-general-hover'
				]
			).toBe(3);
			expect(hoverChanges['block-background-status-hover']).toBe(true);
			expect(getSidebar(hoverAction.property)).toEqual(expectedSidebar);
		});

		test('media basics and advanced settings apply to layers', () => {
			const attributes = buildAttributes();

			const imageAction = buildAction(
				'Add a background image layer and set it to cover'
			);
			const imageChanges = buildChanges(
				imageAction.property,
				imageAction.value,
				{ attributes }
			);
			const imageLayer = imageChanges['background-layers'].find(
				layer =>
					layer.type === 'image' &&
					layer['background-image-size-general'] === 'cover'
			);
			expect(imageLayer).toBeTruthy();

			const repeatAction = buildAction(
				'Repeat the background image and set it to fixed'
			);
			const repeatChanges = buildChanges(
				repeatAction.property,
				repeatAction.value,
				{ attributes }
			);
			const repeatLayer = repeatChanges['background-layers'].find(
				layer => layer.type === 'image'
			);
			expect(repeatLayer['background-image-repeat-general']).toBe('repeat');
			expect(repeatLayer['background-image-attachment-general']).toBe('fixed');

			const clipAction = buildAction(
				'Clip the background image to a circle'
			);
			const clipChanges = buildChanges(
				clipAction.property,
				clipAction.value,
				{ attributes }
			);
			const clipLayer = clipChanges['background-layers'].find(
				layer => layer.type === 'image'
			);
			expect(clipLayer['background-image-clip-path-status-general']).toBe(true);

			const wrapperAction = buildAction(
				'Set the background gradient wrapper height to 60%'
			);
			const wrapperChanges = buildChanges(
				wrapperAction.property,
				wrapperAction.value,
				{ attributes }
			);
			const gradientLayer = wrapperChanges['background-layers'].find(
				layer => layer.type === 'gradient'
			);
			expect(
				gradientLayer['background-gradient-wrapper-height-general']
			).toBe(60);

			const parallaxAction = buildAction(
				'Enable parallax on the background image and set speed to 3'
			);
			const parallaxChanges = buildChanges(
				parallaxAction.property,
				parallaxAction.value,
				{ attributes }
			);
			const parallaxLayer = parallaxChanges['background-layers'].find(
				layer => layer.type === 'image'
			);
			expect(parallaxLayer['background-image-parallax-status']).toBe(true);
			expect(parallaxLayer['background-image-parallax-speed']).toBe(3);

			const responsiveAction = buildAction(
				'On mobile, move the background image to the top'
			);
			const responsiveChanges = buildChanges(
				responsiveAction.property,
				responsiveAction.value,
				{ attributes }
			);
			const responsiveLayer = responsiveChanges['background-layers'].find(
				layer => layer.type === 'image'
			);
			expect(responsiveLayer['background-image-position-xs']).toBe(
				'center top'
			);
		});

		test('other media types create layers', () => {
			const attributes = buildAttributes();

			const gradientAction = buildAction(
				'Add a gradient background layer with 70% opacity'
			);
			const gradientChanges = buildChanges(
				gradientAction.property,
				gradientAction.value,
				{ attributes }
			);
			const gradientLayer = gradientChanges['background-layers'].find(
				layer =>
					layer.type === 'gradient' &&
					layer['background-gradient-opacity-general'] === 0.7
			);
			expect(gradientLayer).toBeTruthy();

			const videoAction = buildAction(
				'Add a video background layer and loop it'
			);
			const videoChanges = buildChanges(
				videoAction.property,
				videoAction.value,
				{ attributes }
			);
			const videoLayer = videoChanges['background-layers'].find(
				layer => layer.type === 'video'
			);
			expect(videoLayer['background-video-loop']).toBe(true);

			const svgAction = buildAction(
				'Add an SVG background layer with palette 4'
			);
			const svgChanges = buildChanges(svgAction.property, svgAction.value, {
				attributes,
			});
			const svgLayer = svgChanges['background-layers'].find(
				layer => layer.type === 'shape'
			);
			expect(svgLayer['background-svg-palette-color-general']).toBe(4);
		});
	});
};

runSuite({
	label: 'background layers (container)',
	buildAction: buildContainerBGroupAction,
	buildChanges: buildContainerBGroupAttributeChanges,
	getSidebar: getContainerBGroupSidebarTarget,
	expectedSidebar: { tabIndex: 0, accordion: 'background / layer' },
});

runSuite({
	label: 'background layers (button)',
	buildAction: buildButtonBGroupAction,
	buildChanges: buildButtonBGroupAttributeChanges,
	getSidebar: getButtonBGroupSidebarTarget,
	expectedSidebar: { tabIndex: 1, accordion: 'background / layer' },
});
