const fs = require('fs');
const path = 'src/components/layout/Navbar.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('useSiteSettings')) {
  content = content.replace(
    "import MobileMenu from './MobileMenu';",
    "import MobileMenu from './MobileMenu';\nimport { useSiteSettings } from '../../context/SiteSettings';"
  );

  content = content.replace(
    "export default function Navbar() {",
    "export default function Navbar() {\n  const settings = useSiteSettings();"
  );

  // Inject Announcement Banner right before the nav tag
  const bannerCode = `
      <AnimatePresence>
        {settings?.announcementActive && settings?.announcement && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-coral-500 text-white text-sm font-medium py-2 px-4 text-center"
          >
            {settings.announcement}
          </motion.div>
        )}
      </AnimatePresence>
      <nav`;
  content = content.replace("      <nav", bannerCode);

  // Update Call and Whatsapp links
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
