package CapstoneConnect.Capstone_1.config;

import CapstoneConnect.Capstone_1.service.UserService;
import CapstoneConnect.Capstone_1.jwt.JwtUtil;
import CapstoneConnect.Capstone_1.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/user", "/api/auth/microsoft").permitAll()
                        .requestMatchers("/api/test/protected").authenticated()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuthSuccessHandler())
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Unauthorized");
                        })
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .addLogoutHandler((request, response, authentication) -> {
                            Cookie jwtCookie = new Cookie("jwt", null);
                            jwtCookie.setHttpOnly(true);
                            jwtCookie.setSecure(true);
                            jwtCookie.setPath("/");
                            jwtCookie.setMaxAge(0);
                            response.addCookie(jwtCookie);
                        })
                )
                .headers(headers -> headers
                        .frameOptions(options -> options.sameOrigin())
                );

        // Register JWT filter before the UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler oAuthSuccessHandler() {
        return ((request, response, authentication) -> {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

            String oauthId = oauth2User.getAttribute("oid");
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");

            if (email != null) {
                userService.saveUserIfNotExists(oauthId, email, name);
            }

            boolean isFirstTimeUser = userService.isFirstTimeUser(email);
            String token = jwtUtil.generateToken(email);

            // Allow secure cookie only if not on localhost
            boolean isSecure = !request.getServerName().equals("localhost");

            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(isSecure)
                    .path("/")
                    .maxAge(12 * 60 * 60)
                    .sameSite("Strict")
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());

            if (isFirstTimeUser) {
                response.sendRedirect("http://localhost:5173/user-survey-page");
            } else {
                response.sendRedirect("http://localhost:5173/home");
            }
        });
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
