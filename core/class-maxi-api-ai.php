<?php
/**
 * MaxiBlocks AI API Handler
 *
 * Handles AI proxy requests to OpenAI, Anthropic, Gemini, and Mistral APIs.
 * This keeps API keys secure on the backend.
 *
 * @package MaxiBlocks
 */

if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_API_AI')):
    class MaxiBlocks_API_AI
    {
        /**
         * API namespace
         *
         * @var string
         */
        private $namespace;

        /**
         * Constructor
         *
         * @param string $namespace The REST API namespace
         */
        public function __construct($namespace)
        {
            $this->namespace = $namespace;
        }

        /**
         * Register AI-related REST API routes
         */
        public function register_routes()
        {
            register_rest_route($this->namespace, '/ai/chat', [
                'methods' => 'POST',
                'callback' => [$this, 'proxy_ai_chat'],
                'args' => [
                    'messages' => [
                        'required' => true,
                        'validate_callback' => function ($param) {
                            return is_array($param) || is_string($param);
                        },
                    ],
                    'prompt' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'design_prompt' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                    'page_type' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'site_profile' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'model' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'temperature' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        },
                    ],
                    'streaming' => [
                        'validate_callback' => function ($param) {
                            return is_bool($param);
                        },
                    ],
                    'provider' => [
                        'validate_callback' => function ($param) {
                            return is_string($param);
                        },
                    ],
                    'max_tokens' => [
                        'validate_callback' => function ($param) {
                            return is_numeric($param);
                        },
                    ],
                ],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);

            register_rest_route($this->namespace, '/ai/context', [
                'methods' => 'GET',
                'callback' => [$this, 'get_ai_context'],
                'permission_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ]);
        }

        /**
         * Proxy AI chat requests to OpenAI API (and others)
         * This keeps the API key secure on the backend
         *
         * @param WP_REST_Request $request The request object
         * @return WP_REST_Response|WP_Error The response
         */
        public function proxy_ai_chat($request)
        {
            // Get parameters from request
            $messages = $request->get_param('messages');
            $prompt = $request->get_param('prompt');
            $design_prompt = $request->get_param('design_prompt');
            $page_type = $request->get_param('page_type');
            $site_profile = $request->get_param('site_profile');
            $selected_block_id = $request->get_param('selected_block_id');
            if (!is_bool($design_prompt)) {
                $design_prompt = $this->is_design_prompt($prompt);
            }
            $model = $request->get_param('model');
            $temperature = $request->get_param('temperature');
            $streaming = $request->get_param('streaming') ?: false;
            $provider = strtolower($request->get_param('provider') ?: 'openai');
            $max_tokens = $request->get_param('max_tokens');

            $supported_providers = ['openai', 'anthropic', 'gemini', 'mistral'];
            if (!in_array($provider, $supported_providers, true)) {
                return new WP_Error(
                    'unsupported_provider',
                    'Unsupported AI provider',
                    ['status' => 400],
                );
            }

            if ($design_prompt) {
                if (empty($prompt) || !is_string($prompt)) {
                    return new WP_Error(
                        'invalid_prompt',
                        'Prompt must be a non-empty string',
                        ['status' => 400],
                    );
                }

                $context = $this->get_ai_context_text($site_profile, $page_type, $selected_block_id);
                $messages = [
                    [
                        'role' => 'system',
                        'content' => $this->get_design_agent_system_prompt($context),
                    ],
                    [
                        'role' => 'user',
                        'content' => 'User request: ' . $prompt,
                    ],
                ];
            }

            // Convert messages to OpenAI format if needed
            if (is_string($messages)) {
                $messages = json_decode($messages, true);
            }

            // Validate message format
            if (!is_array($messages) || empty($messages)) {
                error_log('MaxiBlocks AI proxy error: Invalid messages payload.');
                return new WP_Error(
                    'invalid_messages',
                    'Messages must be a non-empty array',
                    ['status' => 400],
                );
            }

            // Convert LangChain format to OpenAI format
            $converted_messages = [];
            foreach ($messages as $message) {
                if (isset($message['id']) && is_array($message['id'])) {
                    // This is a LangChain message format
                    $message_type = end($message['id']); // Get last element (SystemMessage, HumanMessage, etc.)
                    $content = $message['kwargs']['content'] ?? '';

                    switch ($message_type) {
                        case 'SystemMessage':
                            $converted_messages[] = [
                                'role' => 'system',
                                'content' => $content,
                            ];
                            break;
                        case 'HumanMessage':
                            $converted_messages[] = [
                                'role' => 'user',
                                'content' => $content,
                            ];
                            break;
                        case 'AIMessage':
                            $converted_messages[] = [
                                'role' => 'assistant',
                                'content' => $content,
                            ];
                            break;
                        default:
                            // Fallback to user role for unknown types
                            $converted_messages[] = [
                                'role' => 'user',
                                'content' => $content,
                            ];
                    }
                } else {
                    // Already in OpenAI format, use as-is
                    $converted_messages[] = $message;
                }
            }

            $messages = $converted_messages;

            if ($provider === 'openai') {
                $openai_api_key = get_option('openai_api_key_option');

                if (!$openai_api_key) {
                    error_log('MaxiBlocks AI proxy error: OpenAI API key not configured.');
                    return new WP_Error(
                        'no_api_key',
                        'OpenAI API key not configured',
                        ['status' => 500],
                    );
                }

                $model = $model ?: 'gpt-3.5-turbo';

                // Build OpenAI API request
                $body = [
                    'model' => $model,
                    'messages' => $messages,
                    'stream' => $streaming,
                ];

                // Add temperature based on model support
                // o1 and o3 models don't support temperature at all
                if (
                    !str_contains($model, 'o1') &&
                    !str_contains($model, 'o3')
                ) {
                    // Only GPT-5 models require temperature = 1, others support custom values
                    if (str_contains($model, 'gpt-5')) {
                        $body['temperature'] = 1;
                    } else {
                        // Most models (including gpt-4o) support custom temperature
                        if ($temperature !== null) {
                            $body['temperature'] = (float) $temperature;
                        }
                    }
                }

                if ($streaming) {
                    @ini_set('output_buffering', 'off');
                    @ini_set('zlib.output_compression', '0');
                    while (ob_get_level() > 0) {
                        ob_end_flush();
                    }

                    header('Content-Type: text/event-stream; charset=utf-8');
                    header('Cache-Control: no-cache');
                    header('Connection: keep-alive');
                    header('X-Accel-Buffering: no');

                    $response_buffer = '';

                    $curl_handle = curl_init(
                        'https://api.openai.com/v1/chat/completions',
                    );
                    curl_setopt($curl_handle, CURLOPT_POST, true);
                    curl_setopt($curl_handle, CURLOPT_HTTPHEADER, [
                        'Authorization: Bearer ' . $openai_api_key,
                        'Content-Type: application/json',
                    ]);
                    curl_setopt(
                        $curl_handle,
                        CURLOPT_POSTFIELDS,
                        wp_json_encode($body),
                    );
                    curl_setopt($curl_handle, CURLOPT_TIMEOUT, 0);
                    curl_setopt(
                        $curl_handle,
                        CURLOPT_WRITEFUNCTION,
                        function ($curl, $data) use (&$response_buffer) {
                            $response_buffer .= $data;
                            echo $data;
                            if (function_exists('ob_flush')) {
                                @ob_flush();
                            }
                            flush();
                            return strlen($data);
                        },
                    );

                    $result = curl_exec($curl_handle);
                    $curl_error = $result === false ? curl_error($curl_handle) : '';
                    $response_code = curl_getinfo(
                        $curl_handle,
                        CURLINFO_HTTP_CODE,
                    );
                    curl_close($curl_handle);

                    if ($result === false || $response_code !== 200) {
                        $error_message = $curl_error ?: $response_buffer;
                        error_log(
                            'MaxiBlocks AI streaming error: ' . $error_message,
                        );
                        $error_payload = wp_json_encode([
                            'type' => 'error',
                            'message' => $error_message ?: 'OpenAI API error',
                        ]);
                        echo "data: {$error_payload}\n\n";
                        echo "data: [DONE]\n\n";
                        if (function_exists('ob_flush')) {
                            @ob_flush();
                        }
                        flush();
                        exit;
                    }
                    exit;
                }

                $response = wp_remote_post('https://api.openai.com/v1/chat/completions', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $openai_api_key,
                        'Content-Type'  => 'application/json',
                    ],
                    'body'    => wp_json_encode($body),
                    'timeout' => 60,
                ]);

                if (is_wp_error($response)) {
                    return new WP_Error(
                        'openai_api_error',
                        $response->get_error_message(),
                        ['status' => 500]
                    );
                }

                $response_code = wp_remote_retrieve_response_code($response);
                $response_body = wp_remote_retrieve_body($response);

                if ($response_code !== 200) {
                    error_log(
                        'MaxiBlocks AI proxy error: ' . $response_body,
                    );
                    return new WP_Error(
                        'openai_api_error',
                        'OpenAI API returned error: ' . $response_body,
                        ['status' => $response_code],
                    );
                }

                // Parse and return response
                $data = json_decode($response_body, true);

                if (!$data) {
                    error_log('MaxiBlocks AI proxy error: Invalid response.');
                    return new WP_Error(
                        'invalid_response',
                        'Invalid response from OpenAI API',
                        ['status' => 500],
                    );
                }

                return rest_ensure_response($data);
            }
        }

        /**
         * Get the design agent system prompt
         *
         * @param string $context Optional context string
         * @return string The system prompt
         */
        private function get_design_agent_system_prompt($context = '')
        {
            $context_section = $context ? "\n\nContext:\n{$context}\n" : "\n";

            return <<<'PROMPT'
### ROLE & BEHAVIOR
You are the MaxiBlocks Design Partner. You do not write generic CSS; you manipulate specific MaxiBlocks settings using the Site Style Card and Responsive logic.

---

### PROTOCOL 1: THE "CLARIFY" TRIGGER (The 3-Button Rule)
**Logic:** You must NEVER guess a style. If the user's request is a "Vibe" or "Concept" (e.g., "Make it pop," "Add a shadow," "Round the corners," "Add space"), you MUST NOT apply changes immediately.
**Action:** Return `action: CLARIFY` with 3 distinct presets (A/B/C).

**Trigger Scenarios:**
1. **"Add a shadow"** -> Show: Soft / Crisp / Bold.
2. **"Round corners"** -> Show: Subtle / Soft / Full.
3. **"Add spacing"** -> Show: Compact / Comfortable / Spacious.
4. **"Add a border"** -> Show: Subtle / Strong / Brand.

---

### PROTOCOL 2: VARIABLE ENFORCEMENT (No Hardcoded Colors)
**Rule:** You are FORBIDDEN from using hex codes (e.g., #000000, #ff4a17) or standard color names (red, blue) unless the user explicitly types a hex code.
**Action:** You MUST map requests to the Global Style Card Variables.

**Mapping Dictionary:**
- "Primary," "Brand," "Color," "Blue/Orange" -> Use: `var(--highlight)` or `var(--link-text)`
- "Dark," "Black," "Strong," "Text" -> Use: `var(--h1)` or `var(--h2)`
- "Light," "Grey," "Subtle" -> Use: `var(--p)`
- "Background," "Base" -> Use: `var(--bg-1)` or `var(--bg-2)`

*Example:* If user says "Make the border orange" (and the brand color is orange), you output: `border-color: var(--highlight)`.

---

### PROTOCOL 3: RESPONSIVE AUTOMATION (The 100/60/40 Rule)
**Rule:** When updating dimensions (Padding, Margin, Height, Font Size), you NEVER update just the Desktop value. You must calculate and apply values for ALL 6 breakpoints.
**Action:** Calculate values based on this cascading ratio:
- **XL / L (Desktop):** 100% of target value.
- **M / S (Tablet):** 60% of target value.
- **XS / XXS (Mobile):** 40% of target value.

*JSON Output Requirement:*
Your payload must include keys for `_xl`, `_lg`, `_md`, `_sm`, `_xs`, `_xxs` suffix conventions used by MaxiBlocks.

---

### PROTOCOL 4: UI TARGETING
Always include `ui_target` to open the correct sidebar panel.
- Spacing/Padding -> `spacing-panel`
- Colors -> `color-panel`
- Borders -> `border-panel`
- Shadows -> `shadow-panel`

---

### JSON RESPONSE EXAMPLES

#### Example 1: User says "Give the section more space" (Vague -> Clarify)
{
  "action": "CLARIFY",
  "message": "I can adjust the spacing. How much breathing room do you need?",
  "options": [
    { "label": "Compact", "desc": "60px desktop / 20px mobile", "payload": { "val": "60px" } },
    { "label": "Comfortable", "desc": "100px desktop / 40px mobile", "payload": { "val": "100px" } },
    { "label": "Spacious", "desc": "140px desktop / 60px mobile", "payload": { "val": "140px" } }
  ]
}

#### Example 2: User says "Apply Comfortable spacing" (Specific -> Execute Responsive)
{
  "action": "MODIFY_BLOCK",
  "ui_target": "spacing-panel",
  "payload": {
    "paddingTop": "100px", "paddingBottom": "100px",
    "paddingTop_tablet": "60px", "paddingBottom_tablet": "60px",
    "paddingTop_mobile": "40px", "paddingBottom_mobile": "40px"
  },
  "message": "I've applied 100px spacing for desktop and automatically scaled it down for tablet (60px) and mobile (40px) so it fits perfectly."
}

#### Example 3: User says "Add a brand color border" (Color Variable -> Execute)
{
  "action": "MODIFY_BLOCK",
  "ui_target": "border-panel",
  "payload": {
    "border": "2px solid var(--highlight)"
  },
  "message": "I've added a border using your global Highlight color."
}

---

### List of High-Value Prompts (Prompt Suggestions)

Here is the list of prompt ideas to populate your "Quick Actions" bar. These are designed to feed into the system logic above.

#### Category: Layout & Spacing (Triggers Responsive Protocol)

1. **"Make the section taller"** (Triggers Spacing A/B/C)
2. **"Add breathing room between items"** (Triggers Gap/Padding A/B/C)
3. **"Make the content narrower"** (Triggers Max-Width A/B/C)
4. **"Fix the mobile spacing"** (Triggers a recalibration of Mobile values to 40% of Desktop)

#### Category: Style & Branding (Triggers Variable Protocol)

5. **"Add a subtle border"** (Uses `var(--p)` for grey)
6. **"Make it glow with brand color"** (Uses `var(--highlight)` for shadow)
7. **"Invert the colors"** (Swaps `bg-1` with `h1` variables)
8. **"Make buttons transparent"** (Ghost button: Border `var(--highlight)`, Bg `transparent`)

#### Category: Polish & Depth (Triggers Clarify Protocol)

9. **"Give images a shadow"** (Triggers Soft/Crisp/Bold)
10. **"Round the corners"** (Triggers Subtle/Soft/Full)
11. **"Glassmorphism effect"** (Applies transparency + blur)
12. **"Circle image mask"** (Sets radius to 50%)

### How to handle the "Values Specific" check in Code

In your middleware (JavaScript/PHP), you need to handle the logic for "User entered a chat" vs "User clicked a button."

**The Logic Flow:**

1. **User Opens Window:** Show **no** Clarification buttons. Show only the "Quick Action" chips (the list above).
2. **User types "Add shadow":**
* AI analyzes.
* AI sees "Shadow" (Vague).
* AI returns `action: CLARIFY` + 3 Options (Soft, Crisp, Bold).
* **UI displays the 3 buttons.**

3. **User clicks "Soft":**
* AI receives payload `{"shadow": "soft"}`.
* AI returns `action: MODIFY_BLOCK` + `ui_target: shadow-panel`.
* **UI applies change + Opens Sidebar.**

PROMPT . $context_section;
        }

        /**
         * Detect if a prompt is design-related
         *
         * @param string $prompt The user prompt
         * @return bool True if design-related
         */
        private function is_design_prompt($prompt)
        {
            if (empty($prompt) || !is_string($prompt)) {
                return false;
            }

            $normalized = strtolower($prompt);
            $keywords = [
                'style card',
                'stylecard',
                'palette',
                'theme',
                'font',
                'fonts',
                'typography',
                'color',
                'colour',
                'colors',
                'colours',
                'feminine',
                'luxury',
            ];

            foreach ($keywords as $keyword) {
                if (strpos($normalized, $keyword) !== false) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Get AI context REST endpoint
         *
         * @return WP_REST_Response The response with context
         */
        public function get_ai_context()
        {
            return rest_ensure_response([
                'context' => $this->get_ai_context_text(),
            ]);
        }

        /**
         * Build context text for AI from style cards and site settings
         *
         * @param string|null $site_profile Site profile override
         * @param string|null $page_type Page type override
         * @param string|null $selected_block_id Selected block ID
         * @return string The context string
         */
        private function get_ai_context_text($site_profile = null, $page_type = null, $selected_block_id = null)
        {
            if (!class_exists('MaxiBlocks_StyleCards')) {
                return '';
            }

            $active_sc = MaxiBlocks_StyleCards::get_maxi_blocks_active_style_card();
            if (!$active_sc || !is_array($active_sc)) {
                return '';
            }

            $name = $active_sc['name'] ?? 'Unknown';
            $light_colors = $active_sc['light']['styleCard']['color'] ?? [];
            $default_light_colors = $active_sc['light']['defaultStyleCard']['color'] ?? [];

            $get_color = function ($key) use ($light_colors, $default_light_colors) {
                $value = $light_colors[$key] ?? $default_light_colors[$key] ?? null;
                return $this->rgb_string_to_hex($value);
            };

            $background_1 = $get_color(1);
            $background_2 = $get_color(2);
            $link = $get_color(4);
            $hover = $get_color(6);

            $site_profile_value = $site_profile ?: get_option('maxi_ai_site_description');
            if (!$site_profile_value) {
                $site_profile_value = get_option('maxi_ai_business_name');
            }

            $page_type_value = $page_type ?: 'Unknown';

            return sprintf(
                'Active style card: %s. Site profile: %s. Page type: %s. Colors (light): background_1=%s, background_2=%s, link=%s, hover=%s. Selected Block: %s.',
                $name,
                $site_profile_value ?: 'unknown',
                $page_type_value ?: 'unknown',
                $background_1 ?: 'unknown',
                $background_2 ?: 'unknown',
                $link ?: 'unknown',
                $hover ?: 'unknown',
                $selected_block_id ?: 'none'
            );
        }

        /**
         * Convert RGB string to hex color
         *
         * @param string|null $rgb RGB string like "255, 255, 255"
         * @return string|null Hex color like "#ffffff" or null
         */
        private function rgb_string_to_hex($rgb)
        {
            if (!is_string($rgb)) {
                return null;
            }

            $parts = array_map('trim', explode(',', $rgb));
            if (count($parts) !== 3) {
                return null;
            }

            $r = max(0, min(255, (int) $parts[0]));
            $g = max(0, min(255, (int) $parts[1]));
            $b = max(0, min(255, (int) $parts[2]));

            return sprintf('#%02x%02x%02x', $r, $g, $b);
        }
    }
endif;
