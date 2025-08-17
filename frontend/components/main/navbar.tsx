'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function AppBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const jwt = localStorage.getItem("jwt");
      const logged = localStorage.getItem("logged");
      setIsLoggedIn(!!jwt && logged === "true");
    };

    checkLoginStatus();
    
    // Listen for storage changes (useful for cross-tab updates)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem("jwt");
    localStorage.removeItem("logged");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    
    // Update state
    setIsLoggedIn(false);
    
    // Redirect to home or login page
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const menuItems = [
    "Profile",
    "Dashboard", 
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    ...(isLoggedIn ? ["Log Out"] : []),
  ];

  return (
    <Navbar  onMenuOpenChange={setIsMenuOpen} className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 backdrop-blur-sm  ">
      <NavbarContent  >
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">RAG</p>
        </NavbarBrand>
      </NavbarContent>

      
      <NavbarContent justify="end">
        {isLoggedIn && (
          <NavbarItem>
            <Button 
              color="danger" 
              variant="flat"
              onPress={handleSignOut}
            >
              Sign Out
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : 
                item === "Log Out" ? "danger" : 
                "foreground"
              }
              href="#"
              size="lg"
              onPress={item === "Log Out" ? handleSignOut : undefined}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

