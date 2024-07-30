<?php

const PSEUDO_ELEMENTS = ['before', 'after'];


function get_base_selectors(array $selectors): array
{
    return array_combine(
        array_keys($selectors),
        array_map(
            function ($label, $target) {
                return ['label' => $label, 'target' => $target];
            },
            array_keys($selectors),
            array_values($selectors)
        )
    );
}

function get_pseudo_element_selectors(array $selectors): array
{
    $result = [];

    foreach (PSEUDO_ELEMENTS as $pseudo_element) {
        foreach ($selectors as $key => $selector) {
            $result["{$pseudo_element} {$key}"] = [
                'label' => "{$selector['label']} ::{$pseudo_element}",
                'target' => "{$selector['target']}::{$pseudo_element}",
            ];
        }
    }

    return $result;
}

function get_normal_and_hover_selectors($args)
{
    $label = $args['label'];
    $target = $args['target'];

    $pseudo_element = array_filter(PSEUDO_ELEMENTS, function ($pseudo) use ($label) {
        return strpos($label, $pseudo) !== false;
    });
    $pseudo_element = reset($pseudo_element);

    $target_without_pseudo_element = str_replace("::{$pseudo_element}", '', $target);

    $result = [
        'normal' => [
            'label' => $label,
            'target' => $target,
        ],
        'hover' => [
            'label' => "{$label} on hover",
            'target' => "{$target_without_pseudo_element}:hover" . ($pseudo_element ? "::{$pseudo_element}" : ''),
        ],
    ];

    if ($target_without_pseudo_element !== '') {
        $result['canvas hover'] = [
            'label' => "{$label} on canvas hover",
            'target' => ":hover {$target_without_pseudo_element}" . ($pseudo_element ? "::{$pseudo_element}" : ''),
        ];
    }

    return $result;
}

function create_selectors(
    array $raw_selectors,
    bool $add_pseudo_element_selectors = true,
    bool $add_only_pseudo_element_selectors = false
): array {
    $base_selectors = get_base_selectors($raw_selectors);

    $get_extended_selectors = function () use (
        $base_selectors,
        $add_pseudo_element_selectors,
        $add_only_pseudo_element_selectors
    ): array {
        if ($add_only_pseudo_element_selectors) {
            return get_pseudo_element_selectors($base_selectors);
        }

        if ($add_pseudo_element_selectors) {
            return array_merge(
                $base_selectors,
                get_pseudo_element_selectors($base_selectors)
            );
        }

        return $base_selectors;
    };

    $extended_selectors = $get_extended_selectors();

    return array_combine(
        array_keys($extended_selectors),
        array_map(
            function ($selector) {
                return get_normal_and_hover_selectors($selector);
            },
            array_values($extended_selectors)
        )
    );
}
