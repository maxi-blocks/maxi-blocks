#!/usr/bin/env bash

set -Eeuo pipefail

readonly PLUGIN_SLUG="maxi-blocks"
readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PLUGIN_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly WP_ROOT="$(cd -- "${PLUGIN_DIR}/../../.." && pwd)"
readonly WORKSPACE_ROOT="$(cd -- "${WP_ROOT}/.." && pwd)"
readonly OUTPUT_ROOT="${RELEASE_OUTPUT_DIR:-${WORKSPACE_ROOT}/maxi-blocks-for-sites/wp-directory}"
readonly WP_CLI_BIN="${WP_CLI_BIN:-$(command -v wp 2>/dev/null || true)}"

warn() {
	printf 'WARNING: %s\n' "$*" >&2
}

fail() {
	printf 'ERROR: %s\n' "$*" >&2
	exit 1
}

command -v rsync >/dev/null 2>&1 || fail "rsync is required."
command -v zip >/dev/null 2>&1 || fail "zip is required."

VERSION="$(sed -nE 's/^[[:space:]]*\*[[:space:]]+Version:[[:space:]]*([^[:space:]]+).*/\1/p' "${PLUGIN_DIR}/plugin.php" | head -n 1)"
[[ -n "${VERSION}" ]] || fail "Could not read the Version header from plugin.php."
[[ "${VERSION}" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]] || fail "Invalid plugin version: ${VERSION}"

readonly VERSION
readonly RELEASE_DIR="${OUTPUT_ROOT}/${VERSION}"
OVERWRITE_RELEASE=0

# Check this before slow build and test jobs.
if [[ -e "${RELEASE_DIR}" ]]; then
	warn "Release ${VERSION} already exists at ${RELEASE_DIR}."
	printf 'Replace it and continue? This may mean the plugin version was not increased. [y/N] '
	if ! read -r REPLY; then
		printf '\n' >&2
		fail "Could not read confirmation; the existing release was not changed."
	fi
	case "${REPLY}" in
		y | Y | yes | YES | Yes)
			OVERWRITE_RELEASE=1
			;;
		*)
			fail "Release cancelled; the existing release was not changed."
			;;
	esac
fi

README_VERSION="$(sed -nE 's/^Stable tag:[[:space:]]*([^[:space:]]+).*/\1/p' "${PLUGIN_DIR}/readme.txt" | head -n 1)"
[[ "${README_VERSION}" == "${VERSION}" ]] || fail "readme.txt Stable tag (${README_VERSION:-missing}) does not match plugin.php (${VERSION})."

PACKAGE_VERSION="$(node -p "require('${PLUGIN_DIR}/package.json').version" 2>/dev/null || true)"
if [[ -n "${PACKAGE_VERSION}" && "${PACKAGE_VERSION}" != "${VERSION}" ]]; then
	warn "package.json version (${PACKAGE_VERSION}) differs from the WordPress plugin version (${VERSION}); using ${VERSION}."
fi

printf 'Creating MaxiBlocks %s production release...\n' "${VERSION}"

if [[ "${RELEASE_SKIP_BUILD:-0}" != "1" ]]; then
	(cd "${PLUGIN_DIR}" && npm run build)
else
	warn "Skipping build because RELEASE_SKIP_BUILD=1."
fi

if [[ "${RELEASE_SKIP_TESTS:-0}" != "1" ]]; then
	(cd "${PLUGIN_DIR}" && npm test)
else
	warn "Skipping tests because RELEASE_SKIP_TESTS=1."
fi

if [[ "${RELEASE_SKIP_POT:-0}" == "1" ]]; then
	warn "Skipping POT generation because RELEASE_SKIP_POT=1."
elif [[ -n "${WP_CLI_BIN}" ]] && command -v php >/dev/null 2>&1 && [[ -d "${WP_ROOT}/wp-content/plugins/${PLUGIN_SLUG}" ]]; then
	(
		cd "${WP_ROOT}"
		php -d memory_limit=2048M "${WP_CLI_BIN}" i18n make-pot \
			"wp-content/plugins/${PLUGIN_SLUG}" \
			"wp-content/plugins/${PLUGIN_SLUG}/languages/${PLUGIN_SLUG}.pot" \
			--slug="${PLUGIN_SLUG}" --debug
	)
else
	warn "WP-CLI, PHP, or the WordPress checkout was not found; keeping the existing POT file."
fi

mkdir -p "${OUTPUT_ROOT}"
STAGING_DIR="$(mktemp -d "${OUTPUT_ROOT}/.${PLUGIN_SLUG}-${VERSION}.XXXXXX")"
PREVIOUS_RELEASE="${STAGING_DIR}/previous-release"

cleanup() {
	status=$?
	if [[ -e "${PREVIOUS_RELEASE}" ]]; then
		rm -rf -- "${RELEASE_DIR}"
		mv "${PREVIOUS_RELEASE}" "${RELEASE_DIR}" || true
	fi
	rm -rf -- "${STAGING_DIR}"
	exit "${status}"
}
trap cleanup EXIT
STAGED_PLUGIN="${STAGING_DIR}/${PLUGIN_SLUG}"
mkdir "${STAGED_PLUGIN}"

readonly -a RELEASE_DIRS=(build core fonts img js languages templates)
readonly -a RELEASE_FILES=(changelog.txt license.txt plugin.php readme.txt uninstall.php)
readonly -a RSYNC_EXCLUDES=(
	'--exclude=**/.claude/***'
	'--exclude=**/.env'
	'--exclude=**/.env.*'
	'--exclude=**/node_modules/***'
	'--exclude=admin/starter-sites/.eslintrc.json'
	'--exclude=admin/starter-sites/package.json'
	'--exclude=admin/starter-sites/package-lock.json'
	'--exclude=admin/starter-sites/src/***'
	'--exclude=admin/starter-sites/vite.config.js'
)

for directory in "${RELEASE_DIRS[@]}"; do
	[[ -d "${PLUGIN_DIR}/${directory}" ]] || fail "Required release directory is missing: ${directory}"
	rsync -a "${RSYNC_EXCLUDES[@]}" "${PLUGIN_DIR}/${directory}/" "${STAGED_PLUGIN}/${directory}/"
done

for file in "${RELEASE_FILES[@]}"; do
	[[ -f "${PLUGIN_DIR}/${file}" ]] || fail "Required release file is missing: ${file}"
	install -m 0644 "${PLUGIN_DIR}/${file}" "${STAGED_PLUGIN}/${file}"
done

if find "${STAGED_PLUGIN}" -type l -print -quit | grep -q .; then
	fail "The staged release contains a symbolic link."
fi

FORBIDDEN_PATH="$(find "${STAGED_PLUGIN}" \
	\( -name '.env' -o -name '.env.*' -o -name '.claude' -o -name 'node_modules' \) \
	-print -quit)"
[[ -z "${FORBIDDEN_PATH}" ]] || fail "Forbidden path found in staged release: ${FORBIDDEN_PATH}"

[[ -f "${STAGED_PLUGIN}/core/admin/starter-sites/build/index.html" ]] || fail "Starter-sites production build is missing."
[[ -f "${STAGED_PLUGIN}/languages/${PLUGIN_SLUG}.pot" ]] || fail "POT file is missing."

(cd "${STAGING_DIR}" && zip -q -r "${PLUGIN_SLUG}.zip" "${PLUGIN_SLUG}")

if [[ -e "${RELEASE_DIR}" ]]; then
	[[ "${OVERWRITE_RELEASE}" == "1" ]] || fail "Release directory appeared while packaging: ${RELEASE_DIR}"
	mv "${RELEASE_DIR}" "${PREVIOUS_RELEASE}"
fi
mkdir "${RELEASE_DIR}" || fail "Release directory appeared while packaging: ${RELEASE_DIR}"
mv "${STAGED_PLUGIN}" "${STAGING_DIR}/${PLUGIN_SLUG}.zip" "${RELEASE_DIR}/"

if [[ -e "${PREVIOUS_RELEASE}" ]]; then
	rm -rf -- "${PREVIOUS_RELEASE}"
fi

trap - EXIT
rmdir "${STAGING_DIR}"

printf 'Release ready:\n  %s\n  %s\n' \
	"${RELEASE_DIR}/${PLUGIN_SLUG}" \
	"${RELEASE_DIR}/${PLUGIN_SLUG}.zip"
