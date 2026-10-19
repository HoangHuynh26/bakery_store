package com.maisondouce.bakery.modules.delivery.service.impl;

import com.maisondouce.bakery.modules.delivery.dto.DeliveryTimeSlotDTO;
import com.maisondouce.bakery.modules.delivery.dto.DeliveryZoneDTO;
import com.maisondouce.bakery.modules.delivery.entity.DeliveryTimeSlot;
import com.maisondouce.bakery.modules.delivery.entity.DeliveryZone;
import com.maisondouce.bakery.modules.delivery.repository.DeliveryTimeSlotRepository;
import com.maisondouce.bakery.modules.delivery.repository.DeliveryZoneRepository;
import com.maisondouce.bakery.modules.delivery.service.DeliveryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryZoneRepository zoneRepository;
    private final DeliveryTimeSlotRepository timeSlotRepository;

    public DeliveryServiceImpl(
            DeliveryZoneRepository zoneRepository,
            DeliveryTimeSlotRepository timeSlotRepository) {
        this.zoneRepository = zoneRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryZoneDTO> getZones() {
        return zoneRepository.findAllByActiveTrue().stream()
                .map(this::mapZoneToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryTimeSlotDTO> getTimeSlots() {
        return timeSlotRepository.findAllByActiveTrueOrderByStartTimeAsc().stream()
                .map(this::mapSlotToDTO)
                .collect(Collectors.toList());
    }

    private DeliveryZoneDTO mapZoneToDTO(DeliveryZone z) {
        return DeliveryZoneDTO.builder()
                .id(z.getId())
                .name(z.getName())
                .districts(z.getDistricts())
                .standardFee(z.getStandardFee())
                .freeDeliveryThreshold(z.getFreeDeliveryThreshold())
                .active(z.isActive())
                .build();
    }

    private DeliveryTimeSlotDTO mapSlotToDTO(DeliveryTimeSlot s) {
        return DeliveryTimeSlotDTO.builder()
                .id(s.getId())
                .slotName(s.getSlotName())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .maxOrdersCapacity(s.getMaxOrdersCapacity())
                .active(s.isActive())
                .build();
    }
}
