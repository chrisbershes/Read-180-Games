# Explore Zone / READ 180-style Game Center

This build changes the visual direction toward the supplied reference:
- vivid red/orange environment
- white centered activity panel
- Explore Zone breadcrumb navigation
- compact top-right account controls
- educational activity cards
- website favicon/site icon
- Google sign-in entry point
- Word Builder game

## Google account saving

1. Create a Supabase project.
2. In Supabase Authentication, enable Google provider and configure the Google OAuth credentials.
3. Add your deployed site's URL to the allowed redirect URLs.
4. Put your Supabase project URL and anon/publishable key in `js/config.js`.
5. Run `supabase/schema.sql` in the Supabase SQL editor.
6. Replace the placeholder sync function in `js/auth.js` with the database upsert once your project is configured.

The frontend must never contain a Supabase service-role key.

Until configured, use "Continue in demo mode" to test the site.


## GitHub Pages

Yes, this project can be hosted as a static GitHub Pages site. Push the extracted files to a repository and enable Pages from the repository's Settings → Pages. After Pages gives you the live URL, add that exact URL to Supabase Authentication → URL Configuration and to the Google OAuth redirect/authorized settings.

## Sounds

The speaker buttons now use the browser's Speech Synthesis API, so clicking 🔊 reads the activity instruction or definition aloud. The site also uses Web Audio for small interface feedback sounds; no copyrighted audio files are bundled.
