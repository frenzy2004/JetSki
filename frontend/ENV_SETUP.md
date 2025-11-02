# 🔑 Environment Setup for JetSki

## Create `.env.local` file

In the `frontend/` directory, create a file called `.env.local` with:

```bash
# OpenAI API Key (for viral analysis & storyboard generation)
OPENAI_API_KEY=your_openai_key_here

# Google Gemini API Key (for comic panel generation - optional)
GOOGLE_API_KEY=AIzaSyAhne00yNumPpsJExCFQH01aCbwgazCnAI
```

## Get Your API Keys:

### OpenAI API Key
1. Go to: https://platform.openai.com/api-keys
2. Sign up / Log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)
5. Paste it in `.env.local`

### Google Gemini API Key (You already have this!)
- Already provided: `AIzaSyAhne00yNumPpsJExCFQH01aCbwgazCnAI`
- Just add it to `.env.local`

## That's It!

Once `.env.local` is set up, run:

```bash
npm install
npm run dev
```

Open http://localhost:3000 and you're ready to go! 🚀

