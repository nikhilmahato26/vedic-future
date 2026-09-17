const fs = require('fs');

const path = 'src/components/sections/Hero.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('useSiteSettings')) {
  content = content.replace(
    "import { site, telLink, whatsappLink, primaryPhoneDigits } from '../../data/site';",
    "import { site, telLink, whatsappLink, primaryPhoneDigits } from '../../data/site';\nimport { useSiteSettings } from '../../context/SiteSettings';"
  );
  
  content = content.replace(
    "export default function Hero() {",
    "export default function Hero() {\n  const settings = useSiteSettings();"
  );
  
  // Update Title
  content = content.replace(
    "Unlock Your Destiny Through\n              <span className=\"mt-1 block text-coral-gradient-animate\">Vedic Wisdom</span>",
    "{settings.heroHeading || <>\n              Unlock Your Destiny Through\n              <span className=\"mt-1 block text-coral-gradient-animate\">Vedic Wisdom</span>\n              </>}"
  );

  // Update Subtitle
  content = content.replace(
    "Vedic Astrology • Numerology • Vastu • Spiritual Healing • Poojas &amp; Homas",
    "{settings.heroSub || 'Vedic Astrology • Numerology • Vastu • Spiritual Healing • Poojas & Homas'}"
  );

  // Update Location
  content = content.replace(
    "Location: {site.location.full}",
    "Location: {settings.address || site.location.full}"
  );
  
  // Update Brand Name
  content = content.replace(/{site\.name}/g, "{settings.brandName || site.name}");
  
  // Update Links (we will just rewrite the link hrefs)
  content = content.replace(
    "href={telLink(primaryPhoneDigits)}",
    "href={settings.phoneNumber ? `tel:${settings.phoneNumber.replace(/[^0-9+]/g, '')}` : telLink(primaryPhoneDigits)}"
  );

  content = content.replace(
    "href={whatsappLink()}",
    "href={settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}` : whatsappLink()}"
  );

  fs.writeFileSync(path, content, 'utf8');
}
