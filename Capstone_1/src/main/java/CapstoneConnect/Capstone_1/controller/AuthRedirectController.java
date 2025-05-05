package CapstoneConnect.Capstone_1.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthRedirectController {

    @GetMapping("/microsoft")
    public void redirectToMicrosoft(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/microsoft");
    }
}
