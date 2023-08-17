<?php
/**
* Create selectors based on the raw selectors provided.
*
* @param array $raw_selectors An associative array of raw selectors.
* @param bool $add_pseudo_element_selectors If true, the selectors for pseudo elements are added.
*
* @return array The created selectors.
*/
function create_selectors($raw_selectors, $add_pseudo_element_selectors = true)
{
    $pseudo_elements = ['before', 'after'];

    /**
    * Get normal and hover selectors.
    *
    * @param array $selector An associative array containing a label and a target.
    *
    * @return array The normal and hover selectors.
    */
    function get_normal_and_hover_selectors($selector)
    {
        global $pseudo_elements;

        $pseudo_element = current(array_filter($pseudo_elements, function ($element) use ($selector) {
            return strpos($selector['label'], $element) !== false;
        }));
        $target_without_pseudo_element = str_replace("::{$pseudo_element}", '', $selector['target']);

        return [
			'normal' => [
				'label' => $selector['label'],
				'target' => $selector['target']
			],
			'hover' => [
				'label' => "{$selector['label']} on hover",
				'target' => "{$target_without_pseudo_element}:hover" . ($pseudo_element ? "::{$pseudo_element}" : '')
			]
        ];
    }

    /**
    * Add a pseudo element selector to the selectors list.
    *
    * @param string $key The key to add.
    * @param array $selector The selector to add.
    * @param string $pseudo_element The pseudo element.
    * @param array &$obj The selectors list.
    */
    function add_pseudo_element_selector($key, $selector, $pseudo_element, &$obj)
    {
        $obj["{$pseudo_element} {$key}"] = [
        'label' => "{$selector['label']} ::{$pseudo_element}",
        'target' => "{$selector['target']}::{$pseudo_element}"
        ];
    }

    // Initialize selectors from raw_selectors
    $selectors = [];
    foreach ($raw_selectors as $label => $target) {
        $selectors[$label] = [
        'label' => $label,
        'target' => $target
        ];
    }

    $result = $selectors;

    // Add pseudo element selectors if required
    if ($add_pseudo_element_selectors) {
        foreach ($pseudo_elements as $pseudo_element) {
            foreach ($selectors as $key => $selector) {
                add_pseudo_element_selector($key, $selector, $pseudo_element, $result);
            }
        }
    }

    // Add normal and hover selectors
    foreach ($result as $key => $selector) {
        $result[$key] = get_normal_and_hover_selectors($selector);
    }

    return $result;
}
