package com.maisondouce.bakery.modules.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderTrackingDTO {
    private String orderNumber;
    private String currentStatus;
    private String currentStatusLabelEn;
    private String currentStatusLabelVi;
    private String fulfillmentType;
    @Builder.Default
    private List<TrackingStepDTO> timeline = new ArrayList<>();
    private OrderResponseDTO orderDetails;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrackingStepDTO {
        private String statusCode;
        private String labelVi;
        private String labelEn;
        private String description;
        private boolean completed;
        private boolean current;
        private Instant timestamp;
    }
}
