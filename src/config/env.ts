interface EnvConfig {
    kindeClientId: string;
    kindeDomain: string;
    kindeRedirectUrl: string;
    kindePostLogoutRedirectUrl: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
  }
  
  export const env: EnvConfig = {
    kindeClientId: import.meta.env.VITE_KINDE_CLIENT_ID,
    kindeDomain: import.meta.env.VITE_KINDE_DOMAIN,
    kindeRedirectUrl: import.meta.env.VITE_KINDE_REDIRECT_URL,
    kindePostLogoutRedirectUrl: import.meta.env.VITE_KINDE_POST_LOGOUT_REDIRECT_URL,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };