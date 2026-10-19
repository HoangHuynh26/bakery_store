package com.maisondouce.bakery.modules.user.service;

import com.maisondouce.bakery.modules.auth.dto.UserProfileDTO;
import com.maisondouce.bakery.modules.user.dto.AddressDTO;
import com.maisondouce.bakery.modules.user.dto.AddressRequest;
import com.maisondouce.bakery.modules.user.dto.ChangePasswordRequest;
import com.maisondouce.bakery.modules.user.dto.UpdateProfileRequest;

import java.util.List;
import java.util.UUID;

public interface UserService {
    UserProfileDTO getProfile(UUID userId);
    UserProfileDTO updateProfile(UUID userId, UpdateProfileRequest request);
    void changePassword(UUID userId, ChangePasswordRequest request);
    List<AddressDTO> getAddresses(UUID userId);
    AddressDTO addAddress(UUID userId, AddressRequest request);
    AddressDTO updateAddress(UUID userId, UUID addressId, AddressRequest request);
    void deleteAddress(UUID userId, UUID addressId);
    AddressDTO setDefaultAddress(UUID userId, UUID addressId);
}
