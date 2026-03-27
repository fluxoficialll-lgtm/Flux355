
export const ENDPOINTS_AUTH = {
    LOGIN: "/auth/login",
    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
    PROFILE: "/auth/profile",
    REGISTER: "/auth/register",
    ACCOUNT: "/auth/account",
    CHANGE_PASSWORD: "/auth/password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",

    // Endpoints de Perfil fundidos
    ME: "/api/users/me",
    USER_BY_USERNAME: (username: string) => `/api/users/name/${username}`,
    USER_BY_ID: (userId: string) => `/api/users/${userId}`,
};
