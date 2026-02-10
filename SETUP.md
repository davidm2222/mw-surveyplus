# Setup Instructions

## API Key Configuration

The interview feature requires an Anthropic API key to function.

### Steps:

1. **Get your API key**
   - Go to https://console.anthropic.com/
   - Create an account or sign in
   - Navigate to API Keys
   - Create a new API key

2. **Create `.env.local` file**
   ```bash
   # In the project root directory
   cp .env.local.example .env.local
   ```

3. **Add your API key**
   - Open `.env.local`
   - Replace `sk-ant-your-key-here` with your actual API key
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   ```

4. **Restart the dev server**
   ```bash
   npm run dev
   ```

## Security Notes

✅ **Good:** API key is stored in `.env.local` (never committed to git)
✅ **Good:** API calls are made from server-side API routes
✅ **Good:** API key is never exposed to the client browser

⚠️ **Important:** Never commit `.env.local` to git (already in `.gitignore`)

## Testing the Interview

1. Create a study from the dashboard
2. Navigate to `/interview/{study-id}` (we'll add a proper link soon)
3. Click "Let's start"
4. Chat with the AI!

The API route at `/api/interview` handles all Claude API communication securely.
