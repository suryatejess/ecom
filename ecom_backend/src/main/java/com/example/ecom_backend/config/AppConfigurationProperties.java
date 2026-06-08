package com.example.ecom_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "com.group.project")
public class AppConfigurationProperties {
    private JwtConfiguration jwt;
    private CookieConfiguration cookie;
    private FrontendConfiguration frontend;

    public static class JwtConfiguration {
        private String secret;
        private int expiresIn;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public int getExpiresIn() {
            return expiresIn;
        }

        public void setExpiresIn(int expiresIn) {
            this.expiresIn = expiresIn;
        }
    }

    public static class CookieConfiguration {
        private String name;
        private int expiresIn;
        private boolean secure;
        private String sameSite;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getExpiresIn() {
            return expiresIn;
        }

        public void setExpiresIn(int expiresIn) {
            this.expiresIn = expiresIn;
        }

        public boolean isSecure() {
            return secure;
        }

        public void setSecure(boolean secure) {
            this.secure = secure;
        }

        public String getSameSite() {
            return sameSite;
        }

        public void setSameSite(String sameSite) {
            this.sameSite = sameSite;
        }
    }

    public static class FrontendConfiguration {
        private String url;

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

    public JwtConfiguration getJwt() {
        return jwt;
    }

    public void setJwt(JwtConfiguration jwt) {
        this.jwt = jwt;
    }

    public CookieConfiguration getCookie() {
        return cookie;
    }

    public void setCookie(CookieConfiguration cookie) {
        this.cookie = cookie;
    }

    public FrontendConfiguration getFrontend() {
        return frontend;
    }

    public void setFrontend(FrontendConfiguration frontend) {
        this.frontend = frontend;
    }
}
