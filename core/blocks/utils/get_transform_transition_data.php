<?php

/**
 * @param array $selectors Custom CSS selectors
 * @param array $attributes Attributes
 * @return array Transform transition
 */
function get_transform_transition_data($selectors, $attributes)
{
    $transform_transition = [];

    if (!empty($selectors)) {
        $transform_selectors = get_transform_selectors($selectors, $attributes);

        foreach ($transform_selectors as $selector => $selector_data) {
            if (empty($selector_data['normal'])) {
                continue;
            }

            $transform_transition[$selector] = [
                'title' => ucfirst($selector_data['normal']['label']),
                'target' => $selector_data['normal']['target'],
                'property' => ['transform', 'transform-origin'],
                'isTransform' => true,
            ];
        }
    }

    return $transform_transition;
}
