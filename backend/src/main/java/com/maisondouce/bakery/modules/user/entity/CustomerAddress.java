package com.maisondouce.bakery.modules.user.entity;

import com.maisondouce.bakery.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "customer_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerAddress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "recipient_name", nullable = false, length = 150)
    private String recipientName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "street_address", nullable = false, length = 255)
    private String streetAddress;

    @Column(length = 100)
    private String ward;

    @Column(nullable = false, length = 100)
    private String district;

    @Builder.Default
    @Column(nullable = false, length = 100)
    private String city = "Ho Chi Minh City";

    @Builder.Default
    @Column(name = "is_default", nullable = false)
    private boolean defaultAddress = false;

    @Column(name = "delivery_note", length = 255)
    private String deliveryNote;
}
