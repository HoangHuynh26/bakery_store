package com.maisondouce.bakery.modules.auth.service;

import com.maisondouce.bakery.modules.auth.dto.*;
import com.maisondouce.bakery.security.UserPrincipal;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(TokenRefreshRequest request);
    void logout(String refreshToken);
    UserProfileDTO getCurrentUser(UserPrincipal principal);
}
