"""Prepare browser and social assets from the supplied logo. Requires Pillow."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
logo = Image.open(root / 'branding/ac-law-logo-original.png').convert('RGBA')
background = '#faf6ef'

def centred(image, size, bounds):
    image = image.copy()
    image.thumbnail(bounds, Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', size, background)
    canvas.alpha_composite(image, ((size[0] - image.width) // 2, (size[1] - image.height) // 2))
    return canvas.convert('RGB')

# The small LAW FIRM lettering cannot remain legible at tab-icon sizes.
monogram = logo.crop((160, 55, 1440, 800))
monogram = monogram.crop(monogram.getbbox())
icon = centred(monogram, (256, 256), (232, 232))
icon.save(root / 'dist/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
for size, name in [(32, 'favicon-32.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png')]:
    icon.resize((size, size), Image.Resampling.LANCZOS).save(root / 'dist' / name)
centred(logo.crop(logo.getbbox()), (1200, 630), (900, 470)).save(root / 'dist/assets/ac-law-share.png')
