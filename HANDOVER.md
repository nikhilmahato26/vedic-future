# Handover: Vedic Future 

Welcome to your new platform. We've upgraded Vedic Future from a static prototype to a fully dynamic Next.js web application. It runs faster, is deeply SEO-friendly, and most importantly, you now have full control over your pricing and orders from an Admin Dashboard.

## How to Run It Locally

1. **Open your Terminal** and navigate into the newly built folder:
   ```bash
   cd vedic-next
   ```

2. **Ensure your Environment Variables are set.** 
   Open the `.env` file inside `vedic-next` and ensure you have the following keys:
   ```ini
   DATABASE_URL="postgresql://neondb_owner:npg_OoyZQX5UvL4k@ep-tiny-hall-b4xd81ua-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   JWT_SECRET="your-secure-random-string"
   VEDINTEL_API_KEY="vai_live_xxxxxxxxxxxxxxxx"
   ```

3. **Install Dependencies & Start the Server:**
   ```bash
   npm install
   npm run dev
   ```

4. **Visit the Site:**
   - Public Website: [http://localhost:3000](http://localhost:3000)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## The Admin Panel Guide

Everything you do inside the admin panel is safe and shows up on the live site within seconds. **Never edit the database directly.** You can securely log in using the email you provided (by default, it was seeded with `admin@vedicfuture.com` and password `password123` — change this in production!).

### 1. Services (Pricing Control)
The public "Book Now" cards on the homepage are no longer hardcoded. 
- Go to **Services (Pricing)** in the admin sidebar.
- Click **Edit** on any service.
- If you change the price from `₹1500` to `₹2100`, the website updates instantly.
- If you check **"Quote Only (Hide Price)"**, the website removes the price tag and changes the button to "Request Quote".

### 2. Inbox & Orders
When a user fills out the Checkout/Booking form on the website, it lands here.
- You can instantly see their Ref Code, Target Date, Phone Number, and Payment Status.
- **Trap Secured:** If you change the price of Kundali *today*, it will not affect the historical snapshot of an order that was paid for *yesterday*. 
- **WhatsApp Integration:** Click the green "WhatsApp" button on any row. It will open your WhatsApp (or WhatsApp Web) with a pre-filled, personalized message including their Name, requested Service, and Reference code. 

## Next Steps for Production
1. **Cloudinary (Images):** The framework for server-signed secure uploads is built, but stubbed. When you're ready to allow image uploads in the Admin panel, provide Cloudinary Keys.
2. **Razorpay (Payments):** The checkout currently simulates a 1.5-second success sequence. When you're ready to take real money, plug the Razorpay SDK into the `createOrder` server action!
