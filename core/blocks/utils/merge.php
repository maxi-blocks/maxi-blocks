<?php

/**
 * Merges the given arrays recursively.
 *
 * @param array $array1 The first array to merge.
 * @param array $array2 The second array to merge.
 * @param callable|null $callback The callback function to handle merging of values.
 * @return array The merged array.
 */
function merge_with(&$array1, $array2, $callback = null)
{
    foreach ($array2 as $key => $value) {
        if (is_array($value) && isset($array1[$key]) && is_array($array1[$key])) {
            $array1[$key] = merge_with($array1[$key], $value, $callback);
        } else {
            if ($callback) {
                $result = $callback($array1[$key] ?? null, $value);
                if ($result !== null) {
                    $array1[$key] = $result;
                } else {
                    $array1[$key] = $value;
                }
            } else {
                $array1[$key] = $value;
            }
        }
    }

    return $array1;
}

/**
 * Merges the given arrays recursively without a callback.
 *
 * @param array $array1 The first array to merge.
 * @param array $array2 The second array to merge.
 * @return array The merged array.
 */
function merge($array1, $array2)
{
    return merge_with($array1, $array2);
}
