#!/usr/bin/env bash
# PreToolUse hook (Edit|Write): the pages in en/ and fr/ are generated from the
# Hebrew pages, so direct edits would be overwritten. Block them and redirect.
set -u
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
file="$(jq -r '.tool_input.file_path // empty')"
rel="${file#"$root"/}"
case "$rel" in
  en/*.html|fr/*.html)
    {
      echo "Blocked: $rel is generated and gets overwritten on every rebuild."
      echo "Edit the Hebrew page instead (index.html, privacy.html, terms.html, accessibility.html)"
      echo "and the translations in tools/i18n_home.py (home page) or tools/build_legal.py (legal pages)."
      echo "English and French rebuild automatically after the edit."
    } >&2
    exit 2 ;;
esac
exit 0
