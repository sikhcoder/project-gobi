"use client";

import type { User } from "./types";

const mockUser: User = {
  id: "user-1",
  email: "priya@example.com",
  name: "Priya",
  userType: "couple",
  createdAt: "2025-06-01",
};

export function useCurrentUser() {
  return { user: mockUser, isLoading: false, isAuthenticated: true };
}
