# READ 180 Games

A static educational game center inspired by the visual structure of a reading activity site. This project uses GitHub Pages for hosting and Supabase Auth/database for optional Google sign-in and cloud saves.

## Games

- **Word Builder** — unscramble vocabulary words.
- **Word Match** — match vocabulary words to their meanings.
- **Story Quest** — read a short story and answer comprehension questions.

## GitHub Pages

Expected site URL:

`https://chrisbershes.github.io/Read-180-Games/`

## Supabase

`js/config.js` contains the Supabase project URL and frontend publishable key placeholder. Do not put a Supabase secret/service-role key in the site.

Run `supabase/schema.sql` in the Supabase SQL Editor. The schema adds cloud progress fields for all three games and uses row-level security so signed-in players can only access their own progress.

## Google OAuth

Supabase Authentication > Providers > Google should contain the Google Web OAuth Client ID and Client Secret. Google should use this Supabase callback URL:

`https://xfuetdrzbycwtadgnjpw.supabase.co/auth/v1/callback`

Supabase Authentication > URL Configuration should allow:

`https://chrisbershes.github.io/Read-180-Games/`

## Login UI update
When Google sign-in succeeds, the top-right Guest control becomes the signed-in user's Google name (including first and last name when Google provides it). Clicking the name opens a dropdown with the account email and Sign out. The Profile button on the home page also changes from Sign in with Google to Sign out.

For GitHub Pages, the Supabase Auth Site URL and Redirect URL should be exactly:
https://chrisbershes.github.io/Read-180-Games/

Google OAuth's authorized redirect URI remains the Supabase callback URL shown in the Supabase Google provider settings.
