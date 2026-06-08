package com.example.ecom_backend.filters;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private LettuceBasedProxyManager<String> proxyManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException{

        // 1. get ip
        String ipAddress = request.getRemoteAddr();
        String uri = request.getRequestURI();

        // 2. build key
        String buildKey = "rate_limit_" + ipAddress + uri;

        // 3. define Bandwidth + BucketConfiguration
        Refill refill = Refill.intervally(10, Duration.ofMinutes(1));
        Bandwidth limit = Bandwidth.classic(10,  refill);
        BucketConfiguration config = BucketConfiguration.builder()
                .addLimit(limit)
                .build();

        // 4. get bucket from proxyManager
        Bucket bucket = proxyManager.builder().build( buildKey,() -> config );

        // 5. if tryConsume(1) -> chain.doFilter(...)
        //    else -> response 429
        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.getWriter().write("Too many requests");
        }

    }

}
