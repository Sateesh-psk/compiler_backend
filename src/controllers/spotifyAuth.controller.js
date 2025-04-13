import axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";

dotenv.config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Step 1: Redirect user to Spotify login
export const redirectToSpotifyLogin = (req, res) => {
  const scope = "user-read-private user-read-email";
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
    });
  res.redirect(authUrl);
};

// Step 2: Handle callback and exchange code for token
export const handleSpotifyCallback = async (req, res) => {
  const code = req.query.code || null;

  try {
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code,
        redirect_uri,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    res.json({ access_token, refresh_token, expires_in });
  } catch (err) {
    res.status(500).json({ error: "Token exchange failed" });
  }
};
