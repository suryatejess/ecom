package com.example.ecom_backend.config;

import com.example.ecom_backend.entities.AppUser;
import com.example.ecom_backend.entities.Provider;
import com.example.ecom_backend.entities.RoleType;
import com.example.ecom_backend.repositories.UserRepo;
import com.example.ecom_backend.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AppConfigurationProperties properties;


    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String providerUserId = oauthUser.getAttribute("sub");

        // find or create user
        AppUser user = userRepo.findByProviderAndProviderUserId(Provider.GOOGLE, providerUserId)
                .orElseGet(() -> {
                    AppUser u = new AppUser();
                    u.setProviderUserId(providerUserId);
                    u.setUsername(Provider.GOOGLE + ":" + providerUserId);
                    u.setEmail(email);
                    u.setName(name);
                    u.setRoleType(RoleType.USER);
                    u.setProvider(Provider.GOOGLE);
                    u.setPassword(null); // OAuth user
                    return userRepo.save(u);
                });

        // generate jwt
        String jwt = jwtUtil.generateToken(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(auth);

        ResponseCookie cookie = ResponseCookie.from(properties.getCookie().getName(), jwt)
                .httpOnly(true)
                .secure(properties.getCookie().isSecure())
                .path("/")
                .maxAge(properties.getCookie().getExpiresIn())
                .sameSite(properties.getCookie().getSameSite())
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        response.sendRedirect(properties.getFrontend().getUrl());
    }
}
