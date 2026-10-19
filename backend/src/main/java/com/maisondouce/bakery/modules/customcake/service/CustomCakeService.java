package com.maisondouce.bakery.modules.customcake.service;

import com.maisondouce.bakery.modules.customcake.dto.CustomCakeCreateRequest;
import com.maisondouce.bakery.modules.customcake.dto.CustomCakeResponse;
import com.maisondouce.bakery.modules.customcake.dto.QuotationSubmitRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CustomCakeService {
    CustomCakeResponse createRequest(CustomCakeCreateRequest request, UUID userId);
    CustomCakeResponse getByRequestNumber(String requestNumber);
    List<CustomCakeResponse> getCustomerRequests(UUID userId);
    Page<CustomCakeResponse> getAdminRequests(String status, Pageable pageable);
    CustomCakeResponse submitQuotation(UUID id, QuotationSubmitRequest quotation);
    CustomCakeResponse updateStatus(UUID id, String status);
}
