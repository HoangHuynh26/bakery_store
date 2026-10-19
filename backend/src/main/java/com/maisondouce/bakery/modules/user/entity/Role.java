package com.maisondouce.bakery.modules.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @Column(length = 50)
    private String id; // e.g. ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_STAFF, ROLE_CUSTOMER

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;
}
