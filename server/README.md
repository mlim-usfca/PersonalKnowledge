## Supabase CLI
### Description:
The functionality of RAG based chat bot using gpt3.5 through OPENAI API. The program is ready to be run in the `/supabase` directory. It uses no creativity considering this being personalized and answering solely from user's knowledge-base.

### Requirements
1. Make sure the following is installed:
- Docker
- Node.js 18+

2. Dependencies:
Installations through `npm` and `brew`. If not using these please find related package manager commands.

3. Change directory into `server`
```
cd ./server
```
4. Start the supabase CLI by running this command
```
npx supabase start
```

5. Then, configure the environment
```
npx supabase status -o env \
  --override-name api.url=NEXT_PUBLIC_SUPABASE_URL \
  --override-name auth.anon_key=NEXT_PUBLIC_SUPABASE_ANON_KEY |
    grep NEXT_PUBLIC > .env.local
```
The file above will copied into `./web` folder
`cp .env.local ../web/`

6. Install required libraries
```
brew install deno
npm i @xenova/transformers ai
```

7. Configure your OpenAI API key
```
cat > supabase/functions/.env <<- EOF
OPENAI_API_KEY=<your-api-key>
EOF
```

8. Configure your Browserless.io key
- Visit [Browserless.io](https://www.browserless.io) to generate an API key.
- Store the API key in your `supabase/functions/.env` file as follows: `PUPPETEER_BROWSERLESS_IO_KEY=your-browserless-api-key`. This step ensures secure access to Browserless services for Puppeteer operations.

### Serve and Test the Edge Function
- To serve the Edge Function locally for testing and development, use the Supabase CLI with the following command:

```sh
supabase functions serve <FunctionName>
```

- To test the Edge Function with `curl`:

```sh
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/<functionName>' \
    --header 'Authorization: Bearer <authToken>' \
    --header 'Content-Type: application/json' \
    --data '{"name":"<functionName>","url": "https://example.com"}'
```
Replace `<FunctionName>` with function name you want to serve or test.
Replace `<authToken>` with your current auth token.
Replace `https://example.com` with the url you want to extract content.

### Test the Database
- Run `supabase db reset` to apply schema changes.
- Run `supabase db test` to validate the updates with new tests.
