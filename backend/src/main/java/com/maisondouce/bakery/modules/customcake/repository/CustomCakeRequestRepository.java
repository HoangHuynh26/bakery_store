package com.maisondouce.bakery.modules.customcake.repository;

import com.maisondouce.bakery.modules.customcake.entity.CustomCakeRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomCakeRequestRepository extends JpaRepository<CustomCakeRequest, UUID> {
    Optional<CustomCakeRequest> findByRequestNumber(String requestNumber);
    List<CustomCakeRequest> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Page<CustomCakeRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<CustomCakeRequest> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
}
