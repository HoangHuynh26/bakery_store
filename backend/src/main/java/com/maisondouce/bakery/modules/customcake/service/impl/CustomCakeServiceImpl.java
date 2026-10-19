package com.maisondouce.bakery.modules.customcake.service.impl;

import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.customcake.dto.CustomCakeCreateRequest;
import com.maisondouce.bakery.modules.customcake.dto.CustomCakeResponse;
import com.maisondouce.bakery.modules.customcake.dto.QuotationSubmitRequest;
import com.maisondouce.bakery.modules.customcake.entity.CustomCakeRequest;
import com.maisondouce.bakery.modules.customcake.repository.CustomCakeRequestRepository;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomCakeServiceImpl implements com.maisondouce.bakery.modules.customcake.service.CustomCakeService {

    private final CustomCakeRequestRepository customCakeRequestRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    @Override
    @Transactional
    public CustomCakeResponse createRequest(CustomCakeCreateRequest req, UUID userId) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        String reqNumber = generateRequestNumber();

        CustomCakeRequest entity = CustomCakeRequest.builder()
                .requestNumber(reqNumber)
                .user(user)
                .customerName(req.getCustomerName() != null ? req.getCustomerName() : (user != null ? user.getFullName() : "Khách Hàng"))
                .customerPhone(req.getCustomerPhone() != null ? req.getCustomerPhone() : (user != null ? user.getPhoneNumber() : null))
                .customerEmail(req.getCustomerEmail() != null ? req.getCustomerEmail() : (user != null ? user.getEmail() : null))
                .cakeType(req.getCakeType())
                .shape(req.getShape())
                .sizeServings(req.getSizeServings())
                .flavor(req.getFlavor())
                .filling(req.getFilling())
                .frosting(req.getFrosting())
                .colorTheme(req.getColorTheme())
                .pipingMessage(req.getPipingMessage())
                .specialInstructions(req.getSpecialInstructions())
                .referenceImageUrl(req.getReferenceImageUrl())
                .preferredDate(req.getPreferredDate())
                .preferredTime(req.getPreferredTime())
                .status("SUBMITTED")
                .build();

        CustomCakeRequest saved = customCakeRequestRepository.save(entity);
        log.info("Custom cake request created: {}", reqNumber);
        return CustomCakeResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomCakeResponse getByRequestNumber(String requestNumber) {
        return customCakeRequestRepository.findByRequestNumber(requestNumber)
                .map(CustomCakeResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Yêu cầu bánh thiết kế", "mã số", requestNumber));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomCakeResponse> getCustomerRequests(UUID userId) {
        return customCakeRequestRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(CustomCakeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomCakeResponse> getAdminRequests(String status, Pageable pageable) {
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return customCakeRequestRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase(), pageable)
                    .map(CustomCakeResponse::fromEntity);
        }
        return customCakeRequestRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(CustomCakeResponse::fromEntity);
    }

    @Override
    @Transactional
    public CustomCakeResponse submitQuotation(UUID id, QuotationSubmitRequest quotation) {
        CustomCakeRequest req = customCakeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yêu cầu bánh thiết kế", "id", id));

        req.setQuotationAmount(quotation.getQuotationAmount());
        req.setAdminQuotationNotes(quotation.getAdminNotes());
        req.setStatus("QUOTED");

        CustomCakeRequest saved = customCakeRequestRepository.save(req);
        log.info("Quotation submitted for custom cake {}: {} VND", req.getRequestNumber(), quotation.getQuotationAmount());
        return CustomCakeResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CustomCakeResponse updateStatus(UUID id, String status) {
        CustomCakeRequest req = customCakeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Yêu cầu bánh thiết kế", "id", id));

        req.setStatus(status.toUpperCase());
        CustomCakeRequest saved = customCakeRequestRepository.save(req);
        log.info("Custom cake status updated {}: {}", req.getRequestNumber(), status);
        return CustomCakeResponse.fromEntity(saved);
    }

    private String generateRequestNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = 1000 + random.nextInt(9000);
        return "CC-" + dateStr + "-" + rand;
    }
}
