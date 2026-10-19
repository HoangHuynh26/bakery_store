package com.maisondouce.bakery.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {

    @Builder.Default
    private boolean success = true;

    private String message;

    private List<T> data;

    private int page;

    private int size;

    private long totalElements;

    private int totalPages;

    private boolean isLast;

    @Builder.Default
    private Instant timestamp = Instant.now();

    public static <T> PagedResponse<T> fromPage(Page<T> page, String message) {
        return PagedResponse.<T>builder()
                .success(true)
                .message(message)
                .data(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isLast(page.isLast())
                .timestamp(Instant.now())
                .build();
    }
}
