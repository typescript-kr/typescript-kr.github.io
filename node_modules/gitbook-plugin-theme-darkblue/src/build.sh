#! /bin/bash

# Cleanup folder
rm -rf _assets

# Recreate folder
mkdir -p _assets/website/
mkdir -p _assets/ebook/

# Compile Website CSS
lessc -clean-css src/less/website.less _assets/website/style.css

# Compile eBook CSS
lessc -clean-css src/less/ebook.less _assets/ebook/ebook.css
lessc -clean-css src/less/pdf.less _assets/ebook/pdf.css
lessc -clean-css src/less/mobi.less _assets/ebook/mobi.css
lessc -clean-css src/less/epub.less _assets/ebook/epub.css
