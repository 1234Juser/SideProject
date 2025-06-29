package com.nowpick.backend.order.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 클라이언트에서 백엔드로 새로운 주문 생성을 요청할 때 사용하는 DTO.
 * 주문할 항목들과 픽업 시간을 포함한다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDTO {
    @NotNull(message = "주문 항목은 필수입니다.")
    @Size(min = 1, message = "주문 항목은 최소 한 개 이상이어야 합니다.")
    @Valid
    private List<OrderItemDTO> orderItems;

    @NotNull(message = "픽업 시간은 필수입니다.")
    @Future(message = "픽업 시간은 현재 시간 이후여야 합니다.")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime pickupAt;
}