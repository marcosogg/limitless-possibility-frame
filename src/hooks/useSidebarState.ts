import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SIDEBAR_COOKIE_KEY = 'sidebar-state';

interface SidebarState {
  isOpen: boolean;
  isExpanded: boolean;
}

export function useSidebarState() {
  const [state, setState] = useState<SidebarState>(() => {
    const savedState = Cookies.get(SIDEBAR_COOKIE_KEY);
    return savedState 
      ? JSON.parse(savedState) 
      : { isOpen: false, isExpanded: true };
  });

  useEffect(() => {
    Cookies.set(SIDEBAR_COOKIE_KEY, JSON.stringify(state), { expires: 365 });
  }, [state]);

  const toggleOpen = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const toggleExpanded = () => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
  };

  return {
    isOpen: state.isOpen,
    isExpanded: state.isExpanded,
    toggleOpen,
    toggleExpanded,
    setOpen: (isOpen: boolean) => setState(prev => ({ ...prev, isOpen })),
    setExpanded: (isExpanded: boolean) => setState(prev => ({ ...prev, isExpanded }))
  };
} 