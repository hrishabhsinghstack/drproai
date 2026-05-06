'use client'
import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  rightPanelVisible: boolean
  mobileNavVisible: boolean
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
  setRightPanel: (v: boolean) => void
  setMobileNav: (v: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  rightPanelVisible: true,
  mobileNavVisible: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setRightPanel: (v) => set({ rightPanelVisible: v }),
  setMobileNav: (v) => set({ mobileNavVisible: v }),
}))
