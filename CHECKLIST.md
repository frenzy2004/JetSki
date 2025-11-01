# JetSki Launch Checklist

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
cd JetSki
pip install -r requirements.txt
```

**Expected output:** All packages install successfully

---

### Step 2: Get API Keys

#### OpenAI API Key (Required)
- [ ] Go to https://platform.openai.com/api-keys
- [ ] Create new API key
- [ ] Copy the key (starts with `sk-`)
- [ ] Cost: ~$0.01 per comic

#### Google Gemini API Key (Required for images)
- [ ] Go to https://aistudio.google.com/apikey
- [ ] Click "Create API Key"
- [ ] Copy the key
- [ ] Cost: ~$0.24 per comic (6 images)

#### Google Service Account (Optional - for Docs/Drive)
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project or select existing
- [ ] Enable "Google Docs API"
- [ ] Enable "Google Drive API"
- [ ] Create Service Account
- [ ] Download JSON credentials file
- [ ] Save somewhere safe

---

### Step 3: Configure Environment

- [ ] Copy `.env.example` to `.env`
- [ ] Add your OpenAI API key to `OPENAI_API_KEY`
- [ ] Add your Google Gemini API key to `GOOGLE_API_KEY`
- [ ] (Optional) Add path to Google credentials as `GOOGLE_SERVICE_ACCOUNT_PATH`

**Your `.env` should look like:**
```
OPENAI_API_KEY=sk-proj-abc123...
GOOGLE_API_KEY=AIzaSyAbc123...
GOOGLE_SERVICE_ACCOUNT_PATH=/path/to/credentials.json
```

---

### Step 4: Test the Server

- [ ] Run `python run.py`
- [ ] See "🚀 JetSki API is live" message
- [ ] Server runs at http://localhost:8000
- [ ] Open http://localhost:8000 in browser
- [ ] Should see welcome message with endpoints

---

### Step 5: Test API Endpoints

#### Test 1: Health Check
```bash
curl http://localhost:8000/
```
- [ ] Returns JSON with version and endpoints

#### Test 2: Analyze Only (No Images)
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```
- [ ] Returns viral analysis with 3 segments
- [ ] Shows selected segment (rank 1)
- [ ] No errors

#### Test 3: Full Pipeline
```python
# Run example_usage.py
python example_usage.py
```
- [ ] Prompts you to choose option
- [ ] Select "1" for full pipeline
- [ ] Runs without errors
- [ ] Creates `data/output/` folder
- [ ] Saves comic panels (if images enabled)
- [ ] Saves `full_result.json`

---

## ✅ Verification Checklist

### Basic Functionality
- [ ] Server starts without errors
- [ ] `/` endpoint returns welcome message
- [ ] `/analyze` returns viral analysis
- [ ] Viral analysis includes 3 segments
- [ ] Each segment has score, hook, timestamps
- [ ] Selected segment is auto-picked (rank 1)

### Storyboard Generation
- [ ] Storyboard includes 6 panels
- [ ] Each panel has scene_description
- [ ] Each panel has caption
- [ ] Hashtags are generated
- [ ] Posting tips are included

### Image Generation (if enabled)
- [ ] NanoBanana generates images
- [ ] All 6 panels created successfully
- [ ] Images are base64-encoded
- [ ] Can decode and save images
- [ ] Images saved to `data/output/comic_panels/`

### Google Integration (if configured)
- [ ] Google Doc is created
- [ ] Doc URL is returned
- [ ] Images uploaded to Drive
- [ ] Drive folder URL is returned
- [ ] Doc contains all analysis info

---

## 🧪 Test Scenarios

### Scenario 1: Minimal Setup
**Config:** Only `OPENAI_API_KEY` set

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "generate_images": false,
  "create_google_doc": false
}
```

**Expected:**
- [ ] Viral analysis works
- [ ] Storyboard generated
- [ ] No image generation attempted
- [ ] No Google Doc created

---

### Scenario 2: With Images
**Config:** `OPENAI_API_KEY` + `GOOGLE_API_KEY`

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "generate_images": true,
  "create_google_doc": false
}
```

**Expected:**
- [ ] Viral analysis works
- [ ] Storyboard generated
- [ ] 6 comic images created
- [ ] Images in response as base64
- [ ] No Google Doc (credentials not configured)

---

### Scenario 3: Full Pipeline
**Config:** All API keys configured

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "generate_images": true,
  "create_google_doc": true
}
```

**Expected:**
- [ ] Everything from Scenario 2
- [ ] Google Doc created
- [ ] Doc URL in response
- [ ] Images uploaded to Drive
- [ ] Drive folder URL in response
- [ ] Doc contains full analysis

---

## 🐛 Troubleshooting

### Error: "No module named 'google.genai'"
**Fix:**
```bash
pip install google-genai Pillow
```

### Error: "No transcript available"
**Fix:**
- Video doesn't have captions
- Try a different video with auto-generated captions

### Error: "OpenAI API key not found"
**Fix:**
- Check `.env` file exists
- Verify `OPENAI_API_KEY` is set correctly
- Restart server after adding keys

### Error: "Image generation failed"
**Fix:**
- Check `GOOGLE_API_KEY` is set
- Verify you have API access enabled
- Check API quota limits

### Warning: "Google credentials not found"
**Fix:**
- This is normal if you haven't set up Google Service Account
- DocAgent will run in "preview mode"
- Set `create_google_doc: false` to skip

---

## 📊 Success Metrics

After testing, you should be able to:

- [ ] Paste any YouTube URL
- [ ] Get viral analysis in < 2 minutes
- [ ] See 3 ranked viral moments
- [ ] Get auto-selected best moment
- [ ] See 6-panel storyboard
- [ ] Generate 6 comic images (if configured)
- [ ] Create Google Doc (if configured)
- [ ] Save images locally
- [ ] View full result as JSON

---

## 🎉 Ready to Launch!

When all checkboxes are complete:

- [ ] Server runs without errors
- [ ] API endpoints work
- [ ] Images generate successfully
- [ ] Costs are acceptable (~$0.25 per comic)
- [ ] Documentation is clear

**You're ready to turn YouTube videos into viral comics!** 🚀

---

## 📚 Next Steps

### Immediate
1. [ ] Test with 5-10 different videos
2. [ ] Verify viral moment detection quality
3. [ ] Check comic panel coherence
4. [ ] Review Google Doc formatting

### Short-term
1. [ ] Share on social media
2. [ ] Get user feedback
3. [ ] Optimize prompts based on results
4. [ ] Consider adding frontend UI

### Long-term
1. [ ] Build Next.js frontend
2. [ ] Add database for history
3. [ ] Implement Instagram auto-upload
4. [ ] Add user accounts

---

## 💡 Tips for First Use

1. **Start small** - Test with 5-10 minute videos first
2. **Check transcripts** - Videos with manual captions work best
3. **Review storyboards** - Set `generate_images=false` first to preview
4. **Monitor costs** - Each comic costs ~$0.25
5. **Save good examples** - Keep successful comics for reference

---

## 🆘 Need Help?

1. Read [SETUP.md](SETUP.md) for detailed documentation
2. Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for architecture overview
3. Review [example_usage.py](example_usage.py) for code examples
4. Check server logs for error details

---

**Let's make some viral comics!** 🎨🚤
