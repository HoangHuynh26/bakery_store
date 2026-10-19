package com.maisondouce.bakery.modules.user.controller;

import com.maisondouce.bakery.common.dto.ApiResponse;
import com.maisondouce.bakery.modules.order.entity.Order;
import com.maisondouce.bakery.modules.order.repository.OrderRepository;
import com.maisondouce.bakery.modules.user.dto.AdminCustomerDTO;
import com.maisondouce.bakery.modules.user.entity.Role;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
@Tag(name = "Admin Customers", description = "Customer profile inspection, spend statistics, and management")
public class AdminCustomerController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get paginated list of customers with order counts and total spending")
    public ResponseEntity<ApiResponse<Page<AdminCustomerDTO>>> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<User> users = userRepository.findAll(PageRequest.of(page, size, sort));

        Page<AdminCustomerDTO> dtoPage = users.map(user -> {
            List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
            BigDecimal totalSpent = orders.stream()
                    .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            AdminCustomerDTO dto = new AdminCustomerDTO();
            dto.setId(user.getId());
            dto.setFullName(user.getFullName());
            dto.setEmail(user.getEmail());
            dto.setPhoneNumber(user.getPhoneNumber());
            dto.setActive(user.isActive());
            dto.setCreatedAt(user.getCreatedAt());
            dto.setOrderCount(orders.size());
            dto.setTotalSpent(totalSpent);
            dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
            return dto;
        });

        return ResponseEntity.ok(ApiResponse.success("Tải danh sách khách hàng thành công.", dtoPage));
    }
}
