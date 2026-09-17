const fs = require('fs');
const path = 'src/components/sections/Contact.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('useSiteSettings')) {
  content = content.replace(
    "import { FaWhatsapp, CheckCircle2 } from '../../utils/icons';",
    "import { FaWhatsapp, CheckCircle2 } from '../../utils/icons';\nimport { useSiteSettings } from '../../context/SiteSettings';"
  );

  content = content.replace(
    "export default function Contact() {",
    "export default function Contact() {\n  const settings = useSiteSettings();"
  );

  // Address
  content = content.replace(
    "href={site.location.mapUrl || '#'}",
    "href={site.location.mapUrl || '#'}"
  );
  content = content.replace(
    "<div>\n                  <p className=\"font-medium text-navy-900\">{site.location.name}</p>\n                  <p className=\"text-navy-900/60\">{site.location.address}</p>\n                  <p className=\"text-navy-900/60\">\n                    {site.location.city}, {site.location.state} - {site.location.pincode}\n                  </p>\n                </div>",
    "<div>\n                  <p className=\"font-medium text-navy-900\">{settings.brandName || site.location.name}</p>\n                  <p className=\"text-navy-900/60\">{settings.address || site.location.full}</p>\n                </div>"
  );

  // Phone
  content = content.replace(
    "href={telLink(primaryPhoneDigits)}",
    "href={settings.phoneNumber ? `tel:${settings.phoneNumber.replace(/[^0-9+]/g, '')}` : telLink(primaryPhoneDigits)}"
  );
  content = content.replace(
    "href={telLink(secondaryPhoneDigits)}",
    "href={settings.phoneNumber ? `tel:${settings.phoneNumber.replace(/[^0-9+]/g, '')}` : telLink(secondaryPhoneDigits)}"
  );
  content = content.replace(
    "site.phones[0]",
    "settings.phoneNumber || site.phones[0]"
  );
  content = content.replace(
    "site.phones[1]",
    "settings.phoneNumber || site.phones[1]"
  );

  // Email
  content = content.replace(
    "href={mailLink()}",
    "href={settings.email ? `mailto:${settings.email}` : mailLink()}"
  );
  content = content.replace(
    "site.emails[0]",
    "settings.email || site.emails[0]"
  );
  
  // WhatsApp Button at bottom
  content = content.replace(
    "href={whatsappLink()}",
    "href={settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}` : whatsappLink()}"
  );

  fs.writeFileSync(path, content, 'utf8');
}
