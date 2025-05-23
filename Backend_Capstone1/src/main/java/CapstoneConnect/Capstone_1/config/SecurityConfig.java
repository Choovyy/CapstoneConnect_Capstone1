package CapstoneConnect.Capstone_1.config;

import CapstoneConnect.Capstone_1.jwt.JwtAuthenticationFilter;
import CapstoneConnect.Capstone_1.jwt.JwtUtil;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseCookie;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/user", "/api/auth/microsoft").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/survey/**").permitAll()
                        .requestMatchers("/api/survey/save/**").authenticated()
                        .requestMatchers("/api/auth/userId").authenticated()
                        .requestMatchers("/api/survey/update/**").authenticated()
                        .requestMatchers("/api/test/protected").authenticated()
                        .requestMatchers("/api/profile/**").authenticated()


                        // Add project endpoints protection:
                        .requestMatchers("/api/projects/create").authenticated()
                        .requestMatchers("/api/projects/getall").authenticated()
                        .requestMatchers("/api/projects/update/**").authenticated()
                        .requestMatchers("/api/projects/delete/**").authenticated()
                        .requestMatchers("/api/projects/user/**").authenticated()
                        .requestMatchers("/api/projects/**").authenticated()  // catch-all for others (like get by id)                        .requestMatchers("/api/projects/*/apply/*").authenticated()
                        .requestMatchers("/api/projects/*/applicants").authenticated()
                        .requestMatchers("/api/survey/**").authenticated()
                        
                        // Personality Quiz endpoints - initialize and questions should be permitAll
                        .requestMatchers("/api/personality-quiz/initialize").permitAll()
                        .requestMatchers("/api/personality-quiz/questions").permitAll()
                        .requestMatchers("/api/personality-quiz/submit").authenticated()

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
                        .frameOptions(frame -> frame.sameOrigin())
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler oAuthSuccessHandler() {
        return (request, response, authentication) -> {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

            String oauthId = oauth2User.getAttribute("oid");
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");

            if (email != null) {
                userService.saveUserIfNotExists(oauthId, email, name);
            }

            UserEntity user = userService.getUserByEmail(email).orElseThrow();
            boolean isFirstTimeUser = user.isFirstTimeUser();

            // Generate token with both email and userId
            String token = jwtUtil.generateToken(email, user.getId());

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

            // Append JWT as a query parameter for frontend to extract
            String redirectUrl;
            if (isFirstTimeUser) {
                redirectUrl = "http://localhost:5173/user-survey-page?token=" + token;
            } else {
                redirectUrl = "http://localhost:5173/home?token=" + token;
            }
            response.sendRedirect(redirectUrl);
        };
    }    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
    
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOrigins(java.util.Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
        configuration.setExposedHeaders(java.util.Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
