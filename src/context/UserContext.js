/**
 * UserContext.js
 * 
 * Provides user profile + membership data to every component.
 * Reads from localStorage (written by Login.js after Google OAuth).
 * 
 * Usage:
 *   import { useUser } from '../context/UserContext';
 *   const { profile, membership, logout } = useUser();
 *   // profile.picture  → Google avatar URL
 *   // profile.name     → Full name
 *   // profile.email    → Gmail address
 *   // membership.tier  → e.g. "balanced_daily"
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const safeJSON = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
};

// ─── Context ─────────────────────────────────────────────────────────────────
const UserContext = createContext(null);

// ─── Membership display names ─────────────────────────────────────────────────
export const MEMBERSHIP_LABELS = {
    balanced_daily: 'Balanced Daily',
    boardroom_only: 'Boardroom',
    ceo_only: 'CEO Coach',
    vc_only: 'VC Pitch',
    customer_only: 'Customer',
    premium_daily: 'Premium',
};

export const MEMBERSHIP_COLORS = {
    balanced_daily: { bg: '#1a2a1a', text: '#4ade80', border: '#16a34a' },
    boardroom_only: { bg: '#1a1a2e', text: '#818cf8', border: '#4f46e5' },
    ceo_only: { bg: '#2a1a00', text: '#fbbf24', border: '#d97706' },
    vc_only: { bg: '#1a0a2e', text: '#c084fc', border: '#9333ea' },
    customer_only: { bg: '#0a1a2e', text: '#38bdf8', border: '#0284c7' },
    premium_daily: { bg: '#2a1a00', text: '#ffd700', border: '#dc9a14' },
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UserProvider({ children }) {
    const [profile, setProfile] = useState(() => safeJSON('user_profile'));
    const [membership, setMembership] = useState(() => safeJSON('user_membership'));

    // Re-sync if localStorage changes (e.g. after membership purchase)
    useEffect(() => {
        const sync = () => {
            setProfile(safeJSON('user_profile'));
            setMembership(safeJSON('user_membership'));
        };
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    // Call this after a membership purchase to refresh UI immediately
    const refreshMembership = useCallback((newMembership) => {
        localStorage.setItem('user_membership', JSON.stringify(newMembership));
        setMembership(newMembership);
    }, []);

    // Logout helper
    const logout = useCallback(() => {
        ['user_profile', 'user_email', 'user_name', 'user_picture',
            'user_membership', 'auth_token'].forEach(k => localStorage.removeItem(k));
        setProfile(null);
        setMembership(null);
        window.location.href = '/login';
    }, []);

    const value = {
        profile,       // { name, email, picture, firstName, lastName, googleId }
        membership,    // { tier, is_active, end_date, daily_*_minutes, ... }
        refreshMembership,
        logout,

        // Convenience getters
        isAuthenticated: !!localStorage.getItem('auth_token') && !!profile,
        membershipLabel: membership ? (MEMBERSHIP_LABELS[membership.tier] || membership.tier) : 'Free',
        membershipColors: membership ? (MEMBERSHIP_COLORS[membership.tier] || MEMBERSHIP_COLORS.balanced_daily) : null,
        hasMembership: !!membership?.is_active,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
    return ctx;
}

// ─── Ready-made UserAvatar component for the Dashboard header ─────────────────
export function UserAvatar({ size = 36, showName = false, showMembership = false, style = {} }) {
    const { profile, membership, membershipLabel, membershipColors, logout } = useUser();
    const [open, setOpen] = useState(false);

    if (!profile) return null;

    const initials = (profile.firstName?.[0] || profile.name?.[0] || 'U').toUpperCase();

    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}>
            {/* Avatar Button */}
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: size, height: size, borderRadius: '50%',
                    border: '2px solid rgba(196,168,111,0.4)',
                    overflow: 'hidden', cursor: 'pointer', background: '#2a1a00',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, flexShrink: 0,
                }}
                title={profile.email}
            >
                {profile.picture ? (
                    <img
                        src={profile.picture}
                        alt={profile.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <span style={{ color: '#dc9a14', fontWeight: 600, fontSize: size * 0.4 }}>
                        {initials}
                    </span>
                )}
            </button>

            {/* Inline name + membership badge */}
            {showName && (
                <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#E8E0D5' }}>
                        {profile.firstName || profile.name}
                    </div>
                    {showMembership && membership && (
                        <MembershipBadge small />
                    )}
                </div>
            )}

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setOpen(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                    />
                    <div style={{
                        position: 'absolute', top: size + 10, right: 0, zIndex: 1000,
                        background: '#1e1610', border: '1px solid rgba(196,168,111,0.2)',
                        borderRadius: 6, minWidth: 220, boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
                        overflow: 'hidden',
                    }}>
                        {/* User Info */}
                        <div style={{ padding: '16px', borderBottom: '1px solid rgba(196,168,111,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(196,168,111,0.3)', flexShrink: 0 }}>
                                    {profile.picture
                                        ? <img src={profile.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <div style={{ width: '100%', height: '100%', background: '#2a1a00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc9a14', fontWeight: 700 }}>{initials}</div>
                                    }
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#E8E0D5' }}>{profile.name}</div>
                                    <div style={{ fontSize: 11, color: '#a67c2e', marginTop: 2 }}>{profile.email}</div>
                                </div>
                            </div>
                            {membership && (
                                <div style={{ marginTop: 10 }}>
                                    <MembershipBadge />
                                </div>
                            )}
                        </div>

                        {/* Menu Items */}
                        <div style={{ padding: '8px 0' }}>
                            <DropdownItem href="/upgrade" label="Upgrade Plan" icon="⬆" />
                            <DropdownItem href="/dashboard" label="Dashboard" icon="◈" />
                            <DropdownItem onClick={logout} label="Sign Out" icon="→" danger />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function DropdownItem({ href, onClick, label, icon, danger }) {
    const style = {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px', cursor: 'pointer',
        fontSize: 13, color: danger ? '#f87171' : '#c4a86f',
        background: 'transparent', border: 'none', width: '100%',
        textAlign: 'left', textDecoration: 'none',
        transition: 'background 0.15s',
    };
    const content = <><span style={{ opacity: 0.7 }}>{icon}</span>{label}</>;

    if (href) return <a href={href} style={style} onMouseEnter={e => e.target.style.background = 'rgba(196,168,111,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>{content}</a>;
    return <button style={style} onClick={onClick} onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,168,111,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{content}</button>;
}

// ─── Membership Badge (standalone) ───────────────────────────────────────────
export function MembershipBadge({ small = false }) {
    const { membership, membershipLabel, membershipColors } = useUser();
    if (!membership) return null;

    const colors = membershipColors || MEMBERSHIP_COLORS.balanced_daily;

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
            padding: small ? '2px 6px' : '4px 10px',
            fontSize: small ? 10 : 11,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
        }}>
            <span style={{ fontSize: small ? 9 : 10 }}>✦</span>
            {membershipLabel}
        </span>
    );
}

export default UserContext;