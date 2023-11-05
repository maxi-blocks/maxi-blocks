<?php

/**
 * Convert aspect ratio to decimal.
 *
 * @param string $aspect_ratio Aspect ratio.
 * @example '16 / 9' => 1.7778
 * @example '1 / 2' => 0.5
 * @example '1 /' => 1
 * @example '16 / 0' => 1
 * @return float Aspect ratio in decimal form.
 */
function convert_aspect_ratio_to_decimal($aspect_ratio) {
    $result = 0.0;

    if (!is_string($aspect_ratio)) {
        $result = $aspect_ratio;
    } else {
        if (preg_match('/^(\d+)(?:\/(\d*))?$/', $aspect_ratio, $match)) {
            $numerator = (float) $match[1];
            $denominator = isset($match[2]) && $match[2] !== '' ? (float) $match[2] : 1.0;

            // Handle divide by zero case by returning 1
            if ($denominator === 0.0) {
                $result = 1.0;
            } else {
                $result = $numerator / $denominator;
            }
        } else {
            $result = (float) $aspect_ratio;
        }
    }

    return round($result, 4);
}
