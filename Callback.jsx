// src/Callback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state === 'login') {
      // Exchange code for access token (should be done on backend in production)
      fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: '',
          client_id: '',
          client_secret: '',
          code: code,
          redirect_uri: 'http://localhost:1717/OauthRedirect',
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            // Store access token (e.g., in localStorage or secure backend session)
            localStorage.setItem('salesforce_token', data.access_token);
            navigate('/dashboard'); // Redirect to dashboard
          } else {
            console.error('Token exchange failed:', data);
            navigate('/login', { state: { error: 'Authentication failed. Please try again.' } });
          }
        })
        .catch((err) => {
          console.error('Token exchange error:', err);
          navigate('/login', { state: { error: 'An error occurred during authentication.' } });
        });
    } else {
      navigate('/login', { state: { error: 'Invalid authentication response.' } });
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Callback;