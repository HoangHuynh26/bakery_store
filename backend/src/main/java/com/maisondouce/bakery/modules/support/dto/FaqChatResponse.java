package com.maisondouce.bakery.modules.support.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaqChatResponse {
    private String reply;
    private String matchedCategory;
    private List<String> suggestedPrompts;
}
