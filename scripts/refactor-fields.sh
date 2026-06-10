#!/bin/bash

# Replace showBreadcrumbs -> breadcrumbs in all content files
find src/content -type f \( -name "*.md" -o -name "*.mdx" \) 2>/dev/null | while read f; do
  if grep -l "showBreadcrumbs" "$f" >/dev/null 2>&1; then
    sed -i '' 's/showBreadcrumbs:/breadcrumbs:/g' "$f"
    echo "Updated breadcrumbs in: $f"
  fi
done

# Replace showTableOfContents -> toc in all content files
find src/content -type f \( -name "*.md" -o -name "*.mdx" \) 2>/dev/null | while read f; do
  if grep -l "showTableOfContents" "$f" >/dev/null 2>&1; then
    sed -i '' 's/showTableOfContents:/toc:/g' "$f"
    echo "Updated toc in: $f"
  fi
done

# Replace avater -> avatar in all content files
find src/content -type f \( -name "*.md" -o -name "*.mdx" \) 2>/dev/null | while read f; do
  if grep -l "avater" "$f" >/dev/null 2>&1; then
    sed -i '' 's/avater/avatar/g' "$f"
    echo "Updated avatar in: $f"
  fi
done

# Update markdown-page.md
if grep -l "showTableOfContents" src/pages/markdown-page.md >/dev/null 2>&1; then
  sed -i '' 's/showTableOfContents:/toc:/g' src/pages/markdown-page.md
  echo "Updated toc in markdown-page.md"
fi

echo "All replacements done!"