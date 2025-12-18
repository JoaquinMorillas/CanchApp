package com.joaquin.CanchApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CanchAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(CanchAppApplication.class, args);
	}

}
