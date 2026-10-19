package com.maisondouce.bakery.modules.support.service.impl;

import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.order.entity.Order;
import com.maisondouce.bakery.modules.order.repository.OrderRepository;
import com.maisondouce.bakery.modules.support.dto.*;
import com.maisondouce.bakery.modules.support.entity.SupportMessage;
import com.maisondouce.bakery.modules.support.entity.SupportTicket;
import com.maisondouce.bakery.modules.support.repository.SupportMessageRepository;
import com.maisondouce.bakery.modules.support.repository.SupportTicketRepository;
import com.maisondouce.bakery.modules.support.service.SupportService;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SupportServiceImpl implements SupportService {

    private final SupportTicketRepository ticketRepository;
    private final SupportMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    private static final Pattern ORDER_NUM_PATTERN = Pattern.compile("(?i)(MD-\\d{8}-[A-Z0-9]+)");

    public SupportServiceImpl(SupportTicketRepository ticketRepository,
                              SupportMessageRepository messageRepository,
                              UserRepository userRepository,
                              OrderRepository orderRepository) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public SupportTicketDTO createTicket(UUID userId, CreateTicketRequest request) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        Order order = null;
        if (request.getOrderId() != null) {
            order = orderRepository.findById(request.getOrderId()).orElse(null);
        }

        String ticketNum = "TK-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        SupportTicket ticket = SupportTicket.builder()
                .ticketNumber(ticketNum)
                .user(user)
                .order(order)
                .subject(request.getSubject())
                .category(request.getCategory() != null ? request.getCategory() : "ORDER_INQUIRY")
                .status("OPEN")
                .priority("NORMAL")
                .build();

        SupportTicket savedTicket = ticketRepository.save(ticket);

        SupportMessage firstMessage = SupportMessage.builder()
                .ticket(savedTicket)
                .senderUser(user)
                .staffReply(false)
                .message(request.getMessage())
                .build();
        messageRepository.save(firstMessage);

        savedTicket.setMessages(List.of(firstMessage));
        return mapToDTO(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupportTicketDTO> getUserTickets(UUID userId) {
        if (userId == null) return Collections.emptyList();
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SupportTicketDTO getTicketByNumber(String ticketNumber) {
        SupportTicket ticket = ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("SupportTicket", "ticketNumber", ticketNumber));
        return mapToDTO(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public FaqChatResponse answerConciergeQuestion(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return buildWelcomeResponse();
        }

        String msg = userMessage.toLowerCase().trim();

        // 1. Check if user provided an Order Number pattern (e.g. MD-20261019-XXXX)
        Matcher matcher = ORDER_NUM_PATTERN.matcher(userMessage);
        if (matcher.find()) {
            String orderNum = matcher.group(1).toUpperCase();
            Optional<Order> orderOpt = orderRepository.findByOrderNumber(orderNum);
            if (orderOpt.isPresent()) {
                Order o = orderOpt.get();
                String statusVn = mapStatusToVn(o.getStatus());
                String reply = String.format("Mã đơn hàng **%s** của quý khách hiện đang ở trạng thái: **%s**.\n" +
                                "• Người nhận: %s\n" +
                                "• Ngày nhận: %s (Khung giờ: %s)\n" +
                                "• Tổng tiền: %,.0f₫\n" +
                                "Đội ngũ thợ bánh đang chuẩn bị chu đáo nhất để bánh đến tay quý khách tươi ngon nhất!",
                        o.getOrderNumber(),
                        statusVn,
                        o.getRecipientName(),
                        o.getDeliveryDate() != null ? o.getDeliveryDate().toString() : "Trong ngày",
                        o.getDeliveryTimeSlot() != null ? o.getDeliveryTimeSlot().getSlotName() : "Tiêu chuẩn",
                        o.getTotalAmount()
                );
                return FaqChatResponse.builder()
                        .reply(reply)
                        .matchedCategory("ORDER_TRACKING")
                        .suggestedPrompts(List.of("Cách bảo quản bánh", "Giờ & phí giao hàng", "Dị ứng & Thành phần"))
                        .build();
            } else {
                return FaqChatResponse.builder()
                        .reply("Rất tiếc Maison Douce không tìm thấy đơn hàng mã **" + orderNum + "**. Quý khách vui lòng kiểm tra lại email xác nhận đơn hoặc số điện thoại đặt hàng.")
                        .matchedCategory("ORDER_TRACKING")
                        .suggestedPrompts(List.of("Tra cứu đơn hàng", "Liên hệ tiệm bánh", "Giờ & phí giao hàng"))
                        .build();
            }
        }

        // 2. Storage & Shelf life (checked before generic duration queries)
        if (containsAny(msg, "bảo quản", "để được bao lâu", "tủ lạnh", "hạn sử dụng", "hết hạn", "chảy kem", "để ngoài được")) {
            String reply = "❄️ **Hướng dẫn bảo quản bánh từ Chuyên gia:**\n" +
                    "• **Bánh kem tươi & Entremet (Fraisier, Opera, Tiramisu):** Bảo quản ngăn mát tủ lạnh (2°C - 6°C), dùng ngon nhất trong vòng **48 giờ**.\n" +
                    "• **Choux Pastry / Su kem:** Thưởng thức ngay trong ngày để vỏ choux giữ trọn độ giòn xốp và nhân kem mát lạnh.\n" +
                    "• **Croissant & Bánh mì thủ công:** Để ở nhiệt độ phòng thoáng mát trong 2 ngày; trước khi ăn nướng lại ở 160°C trong 3 phút để vỏ bánh giòn tan ngậy mùi bơ.";
            return FaqChatResponse.builder()
                    .reply(reply)
                    .matchedCategory("STORAGE")
                    .suggestedPrompts(List.of("Dị ứng & Thành phần", "Giờ & phí giao hàng", "Bánh sinh nhật"))
                    .build();
        }

        // 3. Delivery & Shipping
        if (containsAny(msg, "giao hàng", "phí ship", "khu vực", "giao trong bao lâu", "thời gian giao", "ship", "vận chuyển", "khoảng cách")) {
            String reply = "🚚 **Chính sách giao hàng Maison Douce Bakery:**\n" +
                    "• **Khu vực phục vụ:** Toàn bộ TP. Hồ Chí Minh với xe chuyên dụng kiểm soát nhiệt độ mát.\n" +
                    "• **Miễn phí giao hàng:** Áp dụng cho đơn hàng từ **500.000₫** trong bán kính các Quận 1, 3, Bình Thạnh.\n" +
                    "• **Khung giờ giao bánh:** 08:00 - 20:00 hằng ngày, chia thành 4 khung giờ linh hoạt.\n" +
                    "• **Bánh sinh nhật & Entremet:** Luôn được đóng đệm chống sốc và túi đá gel giữ nhiệt cao cấp.";
            return FaqChatResponse.builder()
                    .reply(reply)
                    .matchedCategory("DELIVERY")
                    .suggestedPrompts(List.of("Cách bảo quản bánh", "Bánh thiết kế theo yêu cầu", "Tra cứu đơn hàng"))
                    .build();
        }

        // 4. Allergen & Ingredients
        if (containsAny(msg, "dị ứng", "allergen", "gluten", "sữa", "trứng", "hạt", "thành phần", "nguyên liệu", "chay", "vegan")) {
            String reply = "🌾 **Thông tin nguyên liệu & Dị ứng:**\n" +
                    "• Maison Douce sử dụng **100% bơ lạt Elle & Vire nhập khẩu từ Pháp**, sữa thanh trùng nguyên chất và bột mì T55 cao cấp.\n" +
                    "• **Cảnh báo dị ứng:** Đa số các dòng bánh có chứa **Gluten (lúa mì)**, **Sữa & Sản phẩm từ sữa**, **Trứng gà tươi**.\n" +
                    "• Một số sản phẩm như Macaron, Opera, Tarte hạt có chứa hoặc chế biến cùng dây chuyền với **Hạnh nhân, Hạt dẻ cười, Quả óc chó**.\n" +
                    "• Quý khách vui lòng kiểm tra mục *Thông tin dị ứng* trên từng trang chi tiết sản phẩm.";
            return FaqChatResponse.builder()
                    .reply(reply)
                    .matchedCategory("ALLERGEN")
                    .suggestedPrompts(List.of("Cách bảo quản bánh", "Bánh thiết kế riêng", "Hotline tư vấn"))
                    .build();
        }

        // 5. Custom Cake Atelier
        if (containsAny(msg, "thiết kế", "custom", "bánh cưới", "sinh nhật", "đặt riêng", "vẽ", "viết chữ", "báo giá")) {
            String reply = "🎂 **Atelier Bánh Thiết Kế Riêng Maison Douce:**\n" +
                    "• Quý khách có thể tự tay phối màu cốt bánh, lớp phủ ganache/kem bơ, và viết thông điệp nghệ thuật ngay trên mục **[Bánh thiết kế]** của website.\n" +
                    "• **Thời gian chuẩn bị:** Vui lòng gửi yêu cầu trước ít nhất **24 giờ** đối với bánh sinh nhật, và **3-5 ngày** đối với bánh cưới nhiều tầng.\n" +
                    "• Bếp trưởng bánh sẽ xem xét thiết kế và gửi báo giá kèm phác thảo chi tiết cho quý khách.";
            return FaqChatResponse.builder()
                    .reply(reply)
                    .matchedCategory("CUSTOM_CAKE")
                    .suggestedPrompts(List.of("Đến Atelier Bánh Thiết Kế", "Giờ & phí giao hàng", "Liên hệ tiệm bánh"))
                    .build();
        }

        // 6. Contact & Store Info
        if (containsAny(msg, "liên hệ", "địa chỉ", "ở đâu", "hotline", "số điện thoại", "tiệm", "cửa hàng", "mấy giờ mở cửa")) {
            String reply = "🏛️ **Thông tin liên hệ Boutique Maison Douce:**\n" +
                    "• **Địa chỉ cửa hàng:** 126 Đại Lộ Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh.\n" +
                    "• **Giờ mở cửa:** 07:30 - 21:30 hằng ngày (kể cả Thứ 7, Chủ Nhật & Ngày Lễ).\n" +
                    "• **Hotline hỗ trợ:** (028) 3822 5599\n" +
                    "• **Email dịch vụ khách hàng:** contact@maisondouce.vn";
            return FaqChatResponse.builder()
                    .reply(reply)
                    .matchedCategory("CONTACT")
                    .suggestedPrompts(List.of("Giờ & phí giao hàng", "Bảo quản bánh", "Tra cứu đơn hàng"))
                    .build();
        }

        // Default intelligent fallback
        return FaqChatResponse.builder()
                .reply("Dạ Maison Douce Concierge xin kính chào quý khách! Em có thể giải đáp ngay các thông tin về **Giờ & phí giao hàng**, **Cách bảo quản bánh**, **Thông tin dị ứng nguyên liệu**, **Tra cứu đơn hàng** (vui lòng nhập mã đơn ví dụ MD-...) hoặc **Đặt bánh thiết kế theo yêu cầu**.")
                .matchedCategory("GENERAL")
                .suggestedPrompts(List.of("Giờ & phí giao hàng", "Cách bảo quản bánh", "Dị ứng & Thành phần", "Bánh thiết kế riêng", "Địa chỉ cửa hàng"))
                .build();
    }

    private FaqChatResponse buildWelcomeResponse() {
        return FaqChatResponse.builder()
                .reply("Kính chào quý khách đến với **Maison Douce Concierge**! Em có thể hỗ trợ quý khách về menu bánh hôm nay, giao hàng tận nơi, hoặc tra cứu tiến độ đơn hàng.")
                .matchedCategory("WELCOME")
                .suggestedPrompts(List.of("Giờ & phí giao hàng", "Cách bảo quản bánh", "Dị ứng & Thành phần", "Địa chỉ cửa hàng"))
                .build();
    }

    private boolean containsAny(String input, String... keywords) {
        for (String kw : keywords) {
            if (input.contains(kw)) return true;
        }
        return false;
    }

    private String mapStatusToVn(String status) {
        if (status == null) return "Đang xử lý";
        return switch (status) {
            case "PENDING_PAYMENT" -> "Chờ thanh toán";
            case "PAYMENT_REVIEW" -> "Đang kiểm tra thanh toán chuyển khoản";
            case "CONFIRMED" -> "Đã xác nhận đơn";
            case "PREPARING" -> "Đang chuẩn bị nguyên liệu";
            case "BAKING" -> "Đang nướng bánh trong lò";
            case "DECORATING" -> "Nghệ nhân đang trang trí bánh";
            case "READY_FOR_PICKUP" -> "Bánh đã sẵn sàng tại cửa hàng";
            case "OUT_FOR_DELIVERY" -> "Đang trên đường giao đến bạn";
            case "DELIVERED", "COMPLETED" -> "Đã giao thành công";
            case "CANCELLED" -> "Đã huỷ";
            default -> status;
        };
    }

    private SupportTicketDTO mapToDTO(SupportTicket t) {
        List<SupportMessageDTO> msgDtos = t.getMessages() != null
                ? t.getMessages().stream().map(m -> SupportMessageDTO.builder()
                .id(m.getId())
                .senderName(m.getSenderUser() != null ? m.getSenderUser().getFullName() : (m.isStaffReply() ? "Boutique Concierge" : "Khách hàng"))
                .staffReply(m.isStaffReply())
                .message(m.getMessage())
                .createdAt(m.getCreatedAt())
                .build()).collect(Collectors.toList())
                : Collections.emptyList();

        return SupportTicketDTO.builder()
                .id(t.getId())
                .ticketNumber(t.getTicketNumber())
                .customerName(t.getUser() != null ? t.getUser().getFullName() : "Khách hàng vãng lai")
                .customerEmail(t.getUser() != null ? t.getUser().getEmail() : null)
                .subject(t.getSubject())
                .category(t.getCategory())
                .status(t.getStatus())
                .priority(t.getPriority())
                .referenceOrderNumber(t.getOrder() != null ? t.getOrder().getOrderNumber() : null)
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .messages(msgDtos)
                .build();
    }
}
