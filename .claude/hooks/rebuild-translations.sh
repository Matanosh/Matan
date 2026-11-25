#!/usr/bin/env bash
# PostToolUse hook (Edit|Write): after a change to a Hebrew source page or to the
# translation tools, rebuild the English and French pages so the three languages
# never drift apart. A failed build is reported back to Claude (exit 2).
set -u
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
file="$(jq -r '.tool_input.file_path // empty')"
[ -n "$file" ] || exit 0
rel="${file#"$root"/}"
case "$rel" in
  index.html|privacy.html|terms.html|accessibility.html|tools/i18n_home.py|tools/build_i18n.py|tools/build_legal.py) ;;
  *) exit 0 ;;
esac
cd "$root" || exit 0
if ! out="$(python3 tools/build_i18n.py 2>&1 && python3 tools/build_legal.py 2>&1)"; then
  {
    echo "English/French rebuild FAILED after editing $rel."
    echo "Usually a Hebrew sentence changed and its row in tools/i18n_home.py (home page)"
    echo "or tools/build_legal.py (legal pages) no longer matches. Update the translation"
    echo "table with matching English and French text; the rebuild runs again on the next edit."
    echo "--- build output ---"
    echo "$out" | tail -25
  } >&2
  exit 2
fi
echo "Rebuilt en/ and fr/ after editing $rel."
exit 0
