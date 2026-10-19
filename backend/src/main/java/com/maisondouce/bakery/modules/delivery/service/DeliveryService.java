package com.maisondouce.bakery.modules.delivery.service;

import com.maisondouce.bakery.modules.delivery.dto.DeliveryTimeSlotDTO;
import com.maisondouce.bakery.modules.delivery.dto.DeliveryZoneDTO;

import java.util.List;

public interface DeliveryService {
    List<DeliveryZoneDTO> getZones();
    List<DeliveryTimeSlotDTO> getTimeSlots();
}
