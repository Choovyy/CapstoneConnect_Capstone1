package CapstoneConnect.Capstone_1.config;

import CapstoneConnect.Capstone_1.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired
    private UserService userService;

    // Security filter chain for OAuth2 login and custom URL permissions
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/user", "/api/auth/microsoft").permitAll()  // Public endpoints
                        .anyRequest().authenticated()  // All other requests need authentication
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuthSuccessHandler())  // Custom success handler for OAuth2 login
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")  // Custom logout URL
                        .logoutSuccessUrl("/")  // Redirect to homepage after logout
                );

        return http.build();
    }

    // Custom handler for OAuth2 login success
    @Bean
    public AuthenticationSuccessHandler oAuthSuccessHandler() {
        return ((request, response, authentication) -> {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

            String oauthId = oauth2User.getAttribute("oid");   // Microsoft uses "oid"
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");

            if (email != null) {
                userService.saveUserIfNotExists(oauthId, email, name); // ✅ Save immediately
            }

            boolean isFirstTimeUser = userService.isFirstTimeUser(email);

            // Log isFirstTimeUser value for debugging
            System.out.println("isFirstTimeUser: " + isFirstTimeUser);



            if (isFirstTimeUser) {
                response.sendRedirect("http://localhost:5173/user-survey");  // e.g. React route
            } else {
                response.sendRedirect("/home");  // e.g. React route
            }
        });
    }


    // CORS configuration to allow cross-origin requests
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // React app origin, replace with your production frontend URL if needed
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);  // Allow cookies or authentication tokens in cross-origin requests
    }
}
