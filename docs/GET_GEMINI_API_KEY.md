# How to Get a valid Google Gemini API Key

If you are receiving `404 Not Found` or `Model not found` errors, it is likely your API Key is not enabled for the **Google AI Studio** service, or the project doesn't have access to the models.

Follow these steps to get a fresh, working key:

## Step 1: Go to Google AI Studio
1.  Open your browser and navigate to: **[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**.
2.  Sign in with your Google Account.

## Step 2: Create a Key
1.  Click on the blue **"Create API key"** button.
2.  You can choose to **"Create API key in new project"** (Recommended for fresh start).
3.  Wait for the key to generate.

## Step 3: Copy the Key
1.  Copy the string that starts with `AIza...`.
2.  **Paste it** into your `.env` file in the Cartify project:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_new_pasted_key_here
```

## Step 4: Restart
1.  Stop your Expo server (Ctrl+C).
2.  Run `npx expo start --clear` to clear cache.
3.  Reload the app on your phone.

> **Note:** Ensure you are in a supported region. If you are in Europe or certain other regions, you might need to enable specific settings or the API might be restricted without billing enabled (though Flash is usually free).
