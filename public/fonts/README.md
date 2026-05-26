# Fonts Directory

## Adding Magno Font

To use Magno as the display font, add the font files here:

### Required Files

```
/public/fonts/
├── Magno-Regular.woff2
├── Magno-Medium.woff2
└── Magno-Bold.woff2
```

### Where to Get Magno

Magno is a premium font. You'll need to:

1. **If you have a license**: Export the font files as `.woff2` format
2. **If purchasing**: Check these foundries:
   - [MyFonts](https://www.myfonts.com/)
   - [Fontspring](https://www.fontspring.com/)
   - [Adobe Fonts](https://fonts.adobe.com/) (if you have Creative Cloud)
   - Search "Magno font" to find the official source

3. **Alternative**: If Magno isn't available, consider similar geometric display fonts:
   - [Cabinet Grotesk](https://fonts.google.com/specimen/Cabinet+Grotesk) (Google Fonts)
   - [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Google Fonts)
   - [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts)

### After Adding Font Files

1. Place `.woff2` files in this directory
2. Uncomment the `@font-face` declarations in `/src/index.css`
3. Font will be available via `font-display` Tailwind class

### Current Fallback

Until Magno is added, the display font falls back to:
- System UI fonts (San Francisco on Mac, Segoe UI on Windows, etc.)
