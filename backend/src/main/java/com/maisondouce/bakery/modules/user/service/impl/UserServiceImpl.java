package com.maisondouce.bakery.modules.user.service.impl;

import com.maisondouce.bakery.common.exception.BadRequestException;
import com.maisondouce.bakery.common.exception.ResourceNotFoundException;
import com.maisondouce.bakery.modules.auth.dto.UserProfileDTO;
import com.maisondouce.bakery.modules.user.dto.AddressDTO;
import com.maisondouce.bakery.modules.user.dto.AddressRequest;
import com.maisondouce.bakery.modules.user.dto.ChangePasswordRequest;
import com.maisondouce.bakery.modules.user.dto.UpdateProfileRequest;
import com.maisondouce.bakery.modules.user.entity.CustomerAddress;
import com.maisondouce.bakery.modules.user.entity.Role;
import com.maisondouce.bakery.modules.user.entity.User;
import com.maisondouce.bakery.modules.user.repository.CustomerAddressRepository;
import com.maisondouce.bakery.modules.user.repository.UserRepository;
import com.maisondouce.bakery.modules.user.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CustomerAddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            CustomerAddressRepository addressRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getProfile(UUID userId) {
        User user = getUser(userId);
        return mapToProfileDTO(user);
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = getUser(userId);
        user.setFullName(request.getFullName().trim());
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }
        User updated = userRepository.save(user);
        return mapToProfileDTO(updated);
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = getUser(userId);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password does not match");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDTO> getAddresses(UUID userId) {
        return addressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtDesc(userId).stream()
                .map(this::mapToAddressDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressDTO addAddress(UUID userId, AddressRequest request) {
        User user = getUser(userId);
        List<CustomerAddress> existing = addressRepository.findByUserIdOrderByDefaultAddressDescCreatedAtDesc(userId);

        boolean makeDefault = request.isDefaultAddress() || existing.isEmpty();
        if (makeDefault) {
            addressRepository.resetDefaultAddressForUser(userId);
        }

        CustomerAddress address = CustomerAddress.builder()
                .user(user)
                .recipientName(request.getRecipientName().trim())
                .phoneNumber(request.getPhoneNumber().trim())
                .streetAddress(request.getStreetAddress().trim())
                .ward(request.getWard() != null ? request.getWard().trim() : null)
                .district(request.getDistrict().trim())
                .city(request.getCity() != null ? request.getCity().trim() : "Ho Chi Minh City")
                .defaultAddress(makeDefault)
                .deliveryNote(request.getDeliveryNote() != null ? request.getDeliveryNote().trim() : null)
                .build();

        CustomerAddress saved = addressRepository.save(address);
        return mapToAddressDTO(saved);
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(UUID userId, UUID addressId, AddressRequest request) {
        CustomerAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerAddress", "id", addressId));

        if (request.isDefaultAddress() && !address.isDefaultAddress()) {
            addressRepository.resetDefaultAddressForUser(userId);
            address.setDefaultAddress(true);
        } else if (!request.isDefaultAddress() && address.isDefaultAddress()) {
            address.setDefaultAddress(false);
        }

        address.setRecipientName(request.getRecipientName().trim());
        address.setPhoneNumber(request.getPhoneNumber().trim());
        address.setStreetAddress(request.getStreetAddress().trim());
        address.setWard(request.getWard() != null ? request.getWard().trim() : null);
        address.setDistrict(request.getDistrict().trim());
        if (request.getCity() != null) {
            address.setCity(request.getCity().trim());
        }
        address.setDeliveryNote(request.getDeliveryNote() != null ? request.getDeliveryNote().trim() : null);

        CustomerAddress updated = addressRepository.save(address);
        return mapToAddressDTO(updated);
    }

    @Override
    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        CustomerAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerAddress", "id", addressId));
        addressRepository.delete(address);
    }

    @Override
    @Transactional
    public AddressDTO setDefaultAddress(UUID userId, UUID addressId) {
        CustomerAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerAddress", "id", addressId));

        addressRepository.resetDefaultAddressForUser(userId);
        address.setDefaultAddress(true);
        CustomerAddress updated = addressRepository.save(address);
        return mapToAddressDTO(updated);
    }

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private UserProfileDTO mapToProfileDTO(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .roles(roles)
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private AddressDTO mapToAddressDTO(CustomerAddress address) {
        return AddressDTO.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .phoneNumber(address.getPhoneNumber())
                .streetAddress(address.getStreetAddress())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .defaultAddress(address.isDefaultAddress())
                .deliveryNote(address.getDeliveryNote())
                .build();
    }
}
