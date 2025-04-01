package controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;

@Controller
public class DashboardController {

    @GetMapping("/dashboard")
    public String showDashboard(@AuthenticationPrincipal OAuth2User user, Model model) {
        if (user != null) {
            String name = user.getAttribute("name");
            String email = user.getAttribute("email");
            model.addAttribute("name", name);
            model.addAttribute("email", email);
        }
        return "dashboard";  // Returns the Thymeleaf template
    }
}

