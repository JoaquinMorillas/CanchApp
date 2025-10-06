package com.joaquin.CanchApp.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendRegisterEmail(String to, String name){
        Context context = new Context();
        context.setVariable("name", name);

        String htmlEmail = templateEngine.process("registerEmailTemplate", context);

        MimeMessage message = mailSender.createMimeMessage();

        try{
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Bienvenido a CanchApp");
            helper.setText(htmlEmail, true);
            mailSender.send(message);
            System.out.println("email sent");
        }catch(MessagingException ex){
            throw new RuntimeException("Failed to send email", ex);
        }
    }

    public void sendTestEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Test from Spring Boot");
        message.setText("If you receive this, mail config works.");
        mailSender.send(message);
    }

}
