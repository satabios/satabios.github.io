"""Export the responsive site and current settings as a single offline HTML."""
from pathlib import Path
import re

folder = Path(__file__).resolve().parent
page = (folder / 'index.html').read_text(encoding='utf-8')
settings = (folder / 'settings.js').read_text(encoding='utf-8')
# Escaping prevents a future text value from closing the inline script element.
settings = settings.replace('</', '<\\/')
page, count = re.subn(
    r'(<script id="wedding-settings">)[\s\S]*?(</script>)',
    lambda match: match[1] + settings + match[2], page, count=1,
)
if count != 1:
    raise SystemExit('The settings block was not found. No export was written.')
page = page.replace('<script src="./settings.js"></script>', '')
output = folder / 'wedding-rsvp-mobile-desktop.html'
output.write_text(page, encoding='utf-8')
print(f'Created {output.name}')
