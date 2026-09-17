const fs = require('fs');
const path = 'src/components/layout/Footer.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('useSiteSettings')) {
  content = content.replace(
    "import { astroNavLinks } from '../../data/astroServices';",
    "import { astroNavLinks } from '../../data/astroServices';\nimport { useSiteSettings } from '../../context/SiteSettings';"
  );

  content = content.replace(
    "export default function Footer() {",
    "export default function Footer() {\n  const settings = useSiteSettings();"
  );

  // Update Brand Line and Tags
  content = content.replace(
    "className=\"text-xl font-display font-semibold text-white/95\">{site.name}</span>",
    "className=\"text-xl font-display font-semibold text-white/95\">{settings.brandName || site.name}</span>"
  );

  content = content.replace(
    "{site.brandLine}",
    "{settings.tagline || site.brandLine}"
  );

  // Update Address
  content = content.replace(
    "href={site.location.mapUrl || '#'}",
    "href={site.location.mapUrl || '#'}" // Keeping map URL fallback for now
  );
  content = content.replace(
    "<span className=\"leading-relaxed\">{site.location.full}</span>",
    "<span className=\"leading-relaxed\">{settings.address || site.location.full}</span>"
  );

  // Update Phone
  content = content.replace(
    "href={telLink(primaryPhoneDigits)}",
    "href={settings.phoneNumber ? `tel:${settings.phoneNumber.replace(/[^0-9+]/g, '')}` : telLink(primaryPhoneDigits)}"
  );
  content = content.replace(
    "site.phones[0]",
    "settings.phoneNumber || site.phones[0]"
  );

  // Update Email
  content = content.replace(
    "href={mailLink()}",
    "href={settings.email ? `mailto:${settings.email}` : mailLink()}"
  );
  content = content.replace(
    "site.emails[0]",
    "settings.email || site.emails[0]"
  );

  // Update Copyright
  content = content.replace(
    "&copy; {new Date().getFullYear()} {site.name}.",
    "&copy; {new Date().getFullYear()} {settings.brandName || site.name}."
  );

  fs.writeFileSync(path, content, 'utf8');
}
