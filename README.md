# READ 180 Games — GitHub Pages + Supabase

This build is configured for:

https://chrisbershes.github.io/Read-180-Games/

## 1. Add the Supabase publishable key

Open `js/config.js` and replace:

`PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE`

with the **publishable/anon key** from your Supabase project's API settings.

Never put a Supabase service-role/secret key in this repository.

## 2. Run the database SQL

In Supabase SQL Editor, run `supabase/schema.sql`.

The policies allow each signed-in user to read, insert, and update only their own `player_progress` row.

## 3. Supabase URL configuration

Site URL:

`https://chrisbershes.github.io/Read-180-Games/`

Redirect URL:

`https://chrisbershes.github.io/Read-180-Games/`

## 4. Google OAuth

In Google Cloud, the Authorized JavaScript origin should be:

`https://chrisbershes.github.io`

The Google OAuth redirect URI should remain the Supabase callback:

`https://xfuetdrzbycwtadgnjpw.supabase.co/auth/v1/callback`

## 5. What is fixed

- Google OAuth uses the explicit GitHub Pages URL.
- Supabase JS v2 is loaded before the application scripts.
- The Supabase client uses the publishable key.
- Signed-in progress is loaded from `player_progress` before the game starts.
- Game progress is written to local storage and upserted to Supabase.
- Auth state changes refresh the account UI.
- The SQL is safe to rerun because existing policies are dropped before recreation.
- No service-role key is required by the browser.
