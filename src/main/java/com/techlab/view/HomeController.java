package com.techlab.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    public HomeController() {
        System.out.println("✅ Constructor del HomeController ejecutado.");
    }

    @GetMapping("/")
    public String mostrarInicio() {
        return "index";  // Carga index.html desde /templates/
    }
}
