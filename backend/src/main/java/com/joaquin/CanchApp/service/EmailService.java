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

    public void sendCancelReservationEmail(
        String to,
        String name,
        String sportField,
        String stablishment,
        String day,
        String beginingHour,
        String phoneNumber

    ){
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("sportField", sportField);
        context.setVariable("stablishment", stablishment);
        context.setVariable("day", day);
        context.setVariable("beginingHour",beginingHour);
        context.setVariable("phoneNumber",phoneNumber);
        
        String htmlEmail = templateEngine.process("cancelReservationTemplate", context);

        MimeMessage message = mailSender.createMimeMessage();

        try{
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setText(htmlEmail, true);
            helper.setSubject("CanchApp: Tu Reserva ha sido Cancelada");
            mailSender.send(message);
            System.out.println("Mesaje enviado");
        }catch(MessagingException ex){
            throw new RuntimeException("Failed to send email", ex);
        }
    }

    public void sendConfirmReservarionEmail(
        String to,
        String name,
        String sportField,
        String stablishment,
        String day,
        String beginingHour,
        String location
    ){
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("sportField", sportField);
        context.setVariable("stablishment", stablishment);
        context.setVariable("day", day);
        context.setVariable("beginingHour",beginingHour);
        context.setVariable("location",location);

        String htmlEmail = templateEngine.process("confirmReservationTemplate", context);

        MimeMessage message = mailSender.createMimeMessage();

        try{
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setText(htmlEmail, true);
            helper.setSubject("CanchApp: Reserva Confirmada");
            mailSender.send(message);
            System.out.println("Mesaje enviado");
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
