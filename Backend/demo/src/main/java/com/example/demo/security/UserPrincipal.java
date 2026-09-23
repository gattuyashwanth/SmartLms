package com.example.demo.security;

import com.example.demo.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public Long getId() {
        return user.getId();
    }

    public String getFullName() {
        return user.getFullName();
    }

    public String getRoleName() {
        return user.getRole().name();
    }

    public boolean isStudent() {
        String r = getRoleName();
        return "ROLE_STUDENT".equalsIgnoreCase(r) || "STUDENT".equalsIgnoreCase(r);
    }

    public boolean isTeacher() {
        String r = getRoleName();
        return "ROLE_TEACHER".equalsIgnoreCase(r) || "TEACHER".equalsIgnoreCase(r);
    }

    public boolean isAdmin() {
        String r = getRoleName();
        return "ROLE_ADMIN".equalsIgnoreCase(r) || "ADMIN".equalsIgnoreCase(r);
    }

    public boolean hasRole(String role) {
        if (role == null) return false;
        String r = role.replaceFirst("(?i)^ROLE_", "").toUpperCase();
        String current = getRoleName().replaceFirst("(?i)^ROLE_", "").toUpperCase();
        return current.equals(r);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = user.getRole().name();
        String withoutPrefix = roleName.replaceFirst("(?i)^ROLE_", "").toUpperCase();
        String withPrefix = "ROLE_" + withoutPrefix;

        // Provide both prefixed (e.g. ROLE_STUDENT) and unprefixed (e.g. STUDENT)
        // so that both hasAuthority('ROLE_STUDENT'), hasAuthority('STUDENT'),
        // hasRole('STUDENT'), and hasRole('ROLE_STUDENT') always match.
        return List.of(
                new SimpleGrantedAuthority(withPrefix),
                new SimpleGrantedAuthority(withoutPrefix)
        );
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.isActive();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isActive();
    }
}
