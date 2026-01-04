# Contact Form Email Setup

This contact form uses Resend to send emails when users submit the form.

## Setup Instructions

### 1. Get a Resend API Key

1. Go to [https://resend.com](https://resend.com) and sign up for a free account
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

Open the `.env` file in the root directory and update:

```env
RESEND_API_KEY=re_your_actual_api_key_here
RECIPIENT_EMAIL=youremail@example.com
```

Replace:

- `re_your_actual_api_key_here` with your actual Resend API key
- `youremail@example.com` with the email address where you want to receive contact form submissions

### 3. Verify Your Domain (Optional but Recommended)

By default, Resend uses `onboarding@resend.dev` as the sender email. For production:

1. Verify your domain in Resend dashboard
2. Update the `from` field in `src/pages/api/contact.ts`:

```typescript
from: 'noreply@yourdomain.com', // Change this to your verified domain
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Test the Form

1. Navigate to your contact form
2. Fill out all fields
3. Click "KÜLDÉS" (Send)
4. You should see a success message and receive an email at your configured recipient address

## How It Works

1. User fills out the contact form
2. JavaScript intercepts the form submission
3. Form data is sent to `/api/contact` endpoint
4. The API route uses Resend to send an email
5. User sees success/error message

## Troubleshooting

- **Email not sending**: Check that your `RESEND_API_KEY` is correct
- **Server errors**: Make sure you've installed dependencies with `npm install`
- **CORS errors**: The API route is on the same domain, so CORS shouldn't be an issue

## Files Modified

- `src/components/Contact.astro` - Added form handling and name attributes
- `src/pages/api/contact.ts` - New API endpoint for sending emails
- `astro.config.mjs` - Enabled server-side rendering
- `.env` - Environment variables for API key and recipient email
