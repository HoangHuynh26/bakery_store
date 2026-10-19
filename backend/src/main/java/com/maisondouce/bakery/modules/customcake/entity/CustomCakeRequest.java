package com.maisondouce.bakery.modules.customcake.entity;

import com.maisondouce.bakery.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "custom_cake_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomCakeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "request_number", nullable = false, unique = true, length = 50)
    private String requestNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "customer_name", length = 150)
    private String customerName;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 100)
    private String customerEmail;

    @Column(name = "cake_type", nullable = false, length = 100)
    private String cakeType;

    @Column(nullable = false, length = 50)
    private String shape;

    @Column(name = "size_servings", nullable = false, length = 50)
    private String sizeServings;

    @Column(nullable = false, length = 100)
    private String flavor;

    @Column(nullable = false, length = 100)
    private String filling;

    @Column(nullable = false, length = 100)
    private String frosting;

    @Column(name = "color_theme", length = 100)
    private String colorTheme;

    @Column(name = "piping_message", length = 255)
    private String pipingMessage;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "reference_image_url", length = 500)
    private String referenceImageUrl;

    @Column(name = "preferred_date", nullable = false)
    private LocalDate preferredDate;

    @Column(name = "preferred_time", length = 50)
    private String preferredTime;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "SUBMITTED"; // SUBMITTED, QUOTED, ACCEPTED, REJECTED, IN_PRODUCTION, COMPLETED

    @Column(name = "quotation_amount", precision = 15, scale = 2)
    private BigDecimal quotationAmount;

    @Column(name = "admin_quotation_notes", columnDefinition = "TEXT")
    private String adminQuotationNotes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
