## Supabase CLI
### Description:
The functionality of RAG based chat bot using gpt3.5 through OPENAI API. The program is ready to be run in the `/supabase` directory. It uses no creativity considering this being personalized and answering solely from user's knowledge-base.

#### Requirements
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