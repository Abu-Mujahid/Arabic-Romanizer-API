# Arabic Romanizer API

Secure backend API for Arabic → Latin transliteration (and reverse) supporting:
- IJMES
- ALA-LC
- DIN 31635
- Buckwalter
- SHARIAsource
- Custom (with extra instructions)

## Endpoints

- POST `/api/transliterate`
	- body: `{ "text": "السلام عليكم", "style": "IJMES", "reverse": false, "customInstructions": "optional" }`
	- returns: `{ "transliteration": "As-Salām ʿalaykum" }`

- POST `/api/transliterate/batch`
	- body: `{ "texts": ["السلام عليكم","الجرح والتعديل"], "style": "IJMES", "reverse": false }`
	- returns: `{ "results": [ { "text":"…", "transliteration":"…" } ] }`

CORS enabled for cross-origin browsers.

## Local development

1. `cp .env.example .env` and fill one of:
	 - `OPENAI_API_KEY=...`
	 - or Azure: `AZURE_SECRET_KEY`, `AZURE_ENDPOINT_URL`, optionally `AZURE_4_1_DEPLOYMENT`
2. `npm install`
3. `npm run dev` (defaults to http://localhost:3001)

Test:

```bash
curl -X POST http://localhost:3001/api/transliterate \
	-H "Content-Type: application/json" \
	-d '{"text":"السلام عليكم","style":"IJMES"}'
```

## Deploy (Vercel)

- Import the repo in Vercel
- Set Environment Variables (same as `.env`)
- Deploy. You will get a base URL like `https://arabic-romanizer-api.vercel.app`