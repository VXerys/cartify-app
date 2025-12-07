# How to Get a GROQ API Key (Free)

Groq offers extremely fast AI inference and currently has a generous free tier.

## Step 1: Sign Up
1.  Go to: **[https://console.groq.com/keys](https://console.groq.com/keys)**
2.  Login with your Google or GitHub account.

## Step 2: Create Key
1.  Click **"Create API Key"**.
2.  Name it "Cartify".
3.  Click **"Submit"**.

## Step 3: Copy to Project
1.  Copy the key (starts with `gsk_...`).
2.  Open your `.env` file in the project.
3.  Add the key:

```env
EXPO_PUBLIC_GROQ_API_KEY=gsk_your_key_here
```

## Step 4: Restart
1.  Restart your Expo server (`npx expo start --clear`) to load the new `.env`.
