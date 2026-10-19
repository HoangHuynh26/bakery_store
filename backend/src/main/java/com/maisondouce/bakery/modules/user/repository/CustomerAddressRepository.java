package com.maisondouce.bakery.modules.user.repository;

import com.maisondouce.bakery.modules.user.entity.CustomerAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, UUID> {

    List<CustomerAddress> findByUserIdOrderByDefaultAddressDescCreatedAtDesc(UUID userId);

    Optional<CustomerAddress> findByIdAndUserId(UUID id, UUID userId);

    @Modifying
    @Query("UPDATE CustomerAddress a SET a.defaultAddress = false WHERE a.user.id = :userId")
    void resetDefaultAddressForUser(@Param("userId") UUID userId);
}
