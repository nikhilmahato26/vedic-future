You are completely right. I had built the backend functionality for the Settings Page, but the frontend React components were still hardcoded to read from the static `src/data/site.js` file instead of pulling from your database!

### How I wired it up:
1. I created a global `SettingsProvider` context in Next.js.
2. The root layout now dynamically fetches your database settings (`getSiteSettings()`) and securely passes them down to all client components.
3. I have successfully hooked up all four major components to the new Context API:
   - **`Navbar.jsx`**: It now dynamically shows the **Announcement Banner** at the top of the screen if you enable it, and its "Call" and "WhatsApp" buttons use the numbers from the database.
   - **`Hero.jsx`**: It now displays the **Homepage Hero** Headline and Subheading text, Brand Name, and Location directly from your settings. The 3 huge CTA buttons (Book, Call, WhatsApp) also point to your new numbers.
   - **`Footer.jsx`**: Now dynamically displays the Brand Name, Address, Public Email, and Phone Numbers in the footer links.
   - **`Contact.jsx`**: The contact form section at the bottom of the page now automatically updates its displayed contact cards when you change your Address/Phone/Email in the admin panel.

Everything is completely controlled from the Settings Page now! 
