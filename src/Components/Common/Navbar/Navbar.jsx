import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

import "./Navbar.css";

/* =========================================================
   NAVIGATION
========================================================= */

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  {
    label: "Solutions",
    path: "/services/development",
    /* Order chosen by ProJenius; the footer list matches it. */
    dropdown: [
      { label: "Software Development", path: "/services/development" },
      { label: "PCB Design & Fabrication", path: "/services/pcb-design-fabrication" },
      { label: "Hardware & Embedded Systems", path: "/services/hardware-embedded-systems" },
      { label: "Rapid Prototyping", path: "/services/rapid-prototyping" },
    ],
  },
  /* Incubation is a section of the Startup page (details at /incubate). */
  { label: "Startup & Innovation", path: "/startup" },
  {
    label: "Learning & Development",
    path: "/services/courses",
    dropdown: [
      { label: "Courses", path: "/services/courses" },
      { label: "Internships", path: "/services/internship" },
      { label: "Workshops", path: "/workshop" },
      { label: "Career Guidance", path: "/services/career-guidance" },
    ],
  },
  { label: "Products", path: "/products" },
  { label: "News & Insights", path: "/news-insights" },
  { label: "Contact Us", path: "/contact" },
];

/* =========================================================
   SETTINGS
========================================================= */

const NAVBAR_DISPLAY_TIME = 2000;
const TOP_POSITION = 40;
const SCROLL_THRESHOLD = 2;

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {
  const location = useLocation();

  const hideTimer = useRef(null);
  const scrollFrame = useRef(null);
  const lastScrollY = useRef(0);
  const mobileOpenRef = useRef(false);
  const navbarHoverRef = useRef(false);
  const navbarRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  // Label of a dropdown that was just opened by mouse hover. A click that
  // follows the hover should keep it open rather than toggle it closed.
  const hoverOpenedRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const closeOnOutsidePointer = (event) => {
      if (!navbarRef.current?.contains(event.target)) {
        setServicesOpen(false);
        setOpenDropdown(null);
        if (mobileOpenRef.current) {
          setMobileOpen(false);
          mobileOpenRef.current = false;
        }
      }
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      const expanded = navbarRef.current?.querySelector('[aria-expanded="true"]');
      if (!expanded) return;
      const returnFocus = mobileOpenRef.current
        ? navbarRef.current?.querySelector(".glass-hamburger")
        : navbarRef.current?.querySelector(".glass-nav-button[aria-expanded='true']");
      setServicesOpen(false);
      setOpenDropdown(null);
      if (mobileOpenRef.current) {
        setMobileOpen(false);
        mobileOpenRef.current = false;
      }
      returnFocus?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  // Close the mobile drawer if resizing moves the layout back to desktop navigation.
  useEffect(() => {
    const closeDrawerOnDesktop = () => {
      if (window.innerWidth <= 1150 || !mobileOpenRef.current) return;
      mobileOpenRef.current = false;
      setMobileOpen(false);
      setServicesOpen(false);
      setOpenDropdown(null);
    };

    window.addEventListener("resize", closeDrawerOnDesktop);
    return () => window.removeEventListener("resize", closeDrawerOnDesktop);
  }, []);

  /* =========================================================
     CLEAR TIMER
  ========================================================= */

  const clearNavbarTimer = useCallback(() => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  /* =========================================================
     HIDE NAVBAR
  ========================================================= */

  const hideNavbar = useCallback(() => {
    clearNavbarTimer();

    if (
      window.scrollY > TOP_POSITION &&
      !mobileOpenRef.current &&
      !navbarHoverRef.current
    ) {
      setIsVisible(false);
    }
  }, [clearNavbarTimer, setIsVisible]);

  /* =========================================================
     SHOW NAVBAR FOR 2 SECONDS
  ========================================================= */

  const showNavbarTemporarily = useCallback(() => {
    clearNavbarTimer();

    setIsVisible(true);

    if (
      window.scrollY <= TOP_POSITION ||
      mobileOpenRef.current ||
      navbarHoverRef.current
    ) {
      return;
    }

    hideTimer.current = window.setTimeout(() => {
      if (
        window.scrollY > TOP_POSITION &&
        !mobileOpenRef.current &&
        !navbarHoverRef.current
      ) {
        setIsVisible(false);
      }
    }, NAVBAR_DISPLAY_TIME);
  }, [clearNavbarTimer, setIsVisible]);

  /* =========================================================
     NAVBAR HOVER
  ========================================================= */

  /*
    Pointer events filtered to a real mouse: a touch tap also fires
    mouseenter but never a matching mouseleave, which left the hover
    flag stuck on phones and the navbar unable to hide.
  */
  const handleNavbarMouseEnter = useCallback((event) => {
    if (event.pointerType !== "mouse") return;

    navbarHoverRef.current = true;

    clearNavbarTimer();
    setIsVisible(true);
  }, [clearNavbarTimer, setIsVisible]);

  const handleNavbarMouseLeave = useCallback((event) => {
    if (event.pointerType !== "mouse") return;

    navbarHoverRef.current = false;

    /*
      If page is already scrolled,
      hide immediately after mouse leaves.
    */
    if (
      window.scrollY > TOP_POSITION &&
      !mobileOpenRef.current
    ) {
      hideNavbar();
    }
  }, [hideNavbar]);

  /* =========================================================
     SCROLL HANDLER
  ========================================================= */

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const processScroll = () => {
      scrollFrame.current = null;

      // Clamp so iOS rubber-band overscroll at the bottom of the page
      // is not read as an upward scroll.
      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const currentScrollY = Math.min(Math.max(window.scrollY, 0), maxScrollY);
      const previousScrollY = lastScrollY.current;

      setIsScrolled(currentScrollY > 20);

      /* -----------------------------------------------
         AT TOP
      ------------------------------------------------ */

      if (currentScrollY <= TOP_POSITION) {
        clearNavbarTimer();
        setIsVisible(true);

        lastScrollY.current = currentScrollY;
        return;
      }

      /* -----------------------------------------------
         MOBILE MENU OPEN
      ------------------------------------------------ */

      if (mobileOpenRef.current) {
        clearNavbarTimer();
        setIsVisible(true);

        lastScrollY.current = currentScrollY;
        return;
      }

      /* -----------------------------------------------
         IGNORE TINY MOVEMENTS
      ------------------------------------------------ */

      const difference = currentScrollY - previousScrollY;

      if (Math.abs(difference) < SCROLL_THRESHOLD) {
        return;
      }

      /* -----------------------------------------------
         SCROLL DOWN
         → HIDE IMMEDIATELY (also when the cursor rests
           over the navbar, and close any open dropdown)
      ------------------------------------------------ */

      if (difference > 0) {
        clearNavbarTimer();

        // The hidden navbar moves out from under the cursor without a
        // mouseleave, so the hover flag must not survive the hide.
        navbarHoverRef.current = false;
        setOpenDropdown(null);
        setServicesOpen(false);
        setIsVisible(false);

        lastScrollY.current = currentScrollY;
        return;
      }

      /* -----------------------------------------------
         SCROLL UP
         → SHOW FOR 2 SECONDS
      ------------------------------------------------ */

      if (difference < 0) {
        showNavbarTemporarily();

        lastScrollY.current = currentScrollY;
        return;
      }

      lastScrollY.current = currentScrollY;
    };

    const handleScroll = () => {
      if (scrollFrame.current !== null) {
        return;
      }

      scrollFrame.current =
        window.requestAnimationFrame(processScroll);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    processScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      clearNavbarTimer();

      if (scrollFrame.current !== null) {
        window.cancelAnimationFrame(scrollFrame.current);
        scrollFrame.current = null;
      }
    };
  }, [clearNavbarTimer, showNavbarTemporarily]);

  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  useEffect(() => {
    clearNavbarTimer();

    setServicesOpen(false);
    setOpenDropdown(null);
    setMobileOpen(false);
    setIsVisible(true);

    mobileOpenRef.current = false;
    navbarHoverRef.current = false;

    // Instant: a smooth scroll from deep in the previous page ran
    // through the new page's reveal animations on the way up.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    return () => {
      clearNavbarTimer();
    };
  }, [location.pathname, clearNavbarTimer]);

  /* Links like /startup#startup-incubate: after the page loads (pages are
     lazy-loaded), scroll to that section. Tries for up to ~3 s. */
  useEffect(() => {
    const id = location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
    if (!id) return undefined;
    let tries = 0;
    let timer = 0;
    const tryScroll = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
      tries += 1;
      if (tries < 30) timer = window.setTimeout(tryScroll, 100);
    };
    timer = window.setTimeout(tryScroll, 60);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  /* =========================================================
     BODY LOCK
  ========================================================= */

  useEffect(() => {
    mobileOpenRef.current = mobileOpen;

    if (mobileOpen) {
      document.body.classList.add("nav-open");
      clearNavbarTimer();
    } else {
      document.body.classList.remove("nav-open");
    }

    return () => {
      document.body.classList.remove("nav-open");
    };
  }, [mobileOpen, clearNavbarTimer]);

  /* =========================================================
     ACTIVE ROUTE
  ========================================================= */

  const isActive = useCallback(
    (link) => {
      if (link.dropdown) {
        return (
          location.pathname === link.path ||
          link.dropdown.some((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
        );
      }

      return location.pathname === link.path;
    },
    [location.pathname]
  );

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const toggleMobileMenu = () => {
    clearNavbarTimer();

    const nextState = !mobileOpen;

    setMobileOpen(nextState);
    mobileOpenRef.current = nextState;
    setIsVisible(true);

    // Closing the drawer mid-page keeps the bar for the usual 2 seconds
    // instead of making it vanish under the visitor's finger.
    if (!nextState) {
      showNavbarTemporarily();
      setServicesOpen(false);
      setOpenDropdown(null);
    }
  };

  /* =========================================================
     NORMAL NAVIGATION CLICK
  ========================================================= */

  const handleNavigationClick = () => {
    clearNavbarTimer();

    setServicesOpen(false);
    setOpenDropdown(null);
    setMobileOpen(false);

    mobileOpenRef.current = false;

    setIsVisible(true);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <header
      ref={navbarRef}
      className={`
        glass-header
        ${isScrolled ? "scrolled" : ""}
        ${isVisible ? "header-visible" : "header-hidden"}
      `}
      onPointerEnter={handleNavbarMouseEnter}
      onPointerLeave={handleNavbarMouseLeave}
      onFocus={(event) => {
        // Keyboard users tabbing in see the navbar and it stays put.
        if (event.target.matches?.(":focus-visible")) {
          clearNavbarTimer();
          setIsVisible(true);
        }
      }}
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <div className="glass-navbar-inner">

        {/* ===================================================
            LOGO
        =================================================== */}

        <Link to="/"
        className="glass-logo" 
        aria-label="ProJenius Home"
        aria-current={location.pathname === "/" ? "page" : undefined}
        onClick={handleNavigationClick} >
          <span className="glass-logo-mark">
            <img src="/ProJenius_Logo.svg" alt="ProJenius Innovation Technology" className="logo-icon-crop" />
          </span>
          <span className="pj-brand-wordmark"><span className="logo-pro">ProJenius</span><span className="logo-jenius">Innovation Technology</span></span>
        </Link>
        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <nav
          className="glass-nav-links"
          aria-label="Main Navigation"
        >
          {navLinks.map((link, linkIndex) => {

            /* -----------------------------------------------
               DROPDOWN
            ------------------------------------------------ */

            if (link.dropdown) {
              return (
                <div
                  key={link.label}
                  className={`
                    glass-nav-item
                    has-dropdown
                    ${isActive(link) ? "active" : ""}
                  `}
                  onMouseEnter={() => { hoverOpenedRef.current = link.label; setOpenDropdown(link.label); setServicesOpen(true); }}
                  onMouseLeave={() => { hoverOpenedRef.current = null; setOpenDropdown(null); setServicesOpen(false); }}
                >
                  <button
                    ref={linkIndex === 2 ? dropdownButtonRef : undefined}
                    type="button"
                    className="glass-nav-link glass-nav-button"
                    onClick={() => {
                      if (hoverOpenedRef.current === link.label && openDropdown === link.label) {
                        hoverOpenedRef.current = null;
                        setServicesOpen(true);
                        setIsVisible(true);
                        return;
                      }
                      const nextOpen = openDropdown === link.label ? null : link.label;
                      setOpenDropdown(nextOpen);
                      setServicesOpen(Boolean(nextOpen));

                      setIsVisible(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setOpenDropdown(link.label);
                        setServicesOpen(true);
                        window.requestAnimationFrame(() => {
                          document.getElementById(`nav-dropdown-${link.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`)?.querySelector("a")?.focus();
                        });
                      }
                    }}
                    aria-expanded={servicesOpen && openDropdown === link.label}
                    aria-haspopup="true"
                    aria-controls={`nav-dropdown-${link.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}
                  >
                    <span>
                      {link.label}
                    </span>

                    <ChevronDown
                      size={15}
                      className={
                        servicesOpen && openDropdown === link.label ? "rotate" : ""
                      }
                    />
                  </button>

                  {servicesOpen && openDropdown === link.label && (
                    <div
                      id={`nav-dropdown-${link.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}
                      className="glass-dropdown"
                      aria-label={`${link.label} links`}
                      onMouseEnter={() =>
                        setServicesOpen(true)
                      }
                      onMouseLeave={() =>
                        setServicesOpen(false)
                      }
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`
                            glass-dropdown-item
                            ${location.pathname === item.path
                              ? "active"
                              : ""
                            }
                          `}
                          onClick={() => {
                            setServicesOpen(false);
                            setOpenDropdown(null);
                            handleNavigationClick();
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            /* -----------------------------------------------
               NORMAL LINK
            ------------------------------------------------ */

            return (
              <div
                key={link.path}
                className={`
                  glass-nav-item
                  ${isActive(link) ? "active" : ""}
                `}
              >
                <Link
                  to={link.path}
                  className="glass-nav-link"
                  aria-current={isActive(link) ? "page" : undefined}
                  onClick={handleNavigationClick}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* ===================================================
            MOBILE BUTTON
        =================================================== */}

        <button
          type="button"
          className="glass-hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileOpen && (
        <div className="glass-mobile-drawer">
          <nav aria-label="Mobile Navigation">
          {navLinks.map((link) => {

              /* ---------------------------------------------
                 MOBILE SERVICES
              --------------------------------------------- */

              if (link.dropdown) {
                return (
                  <div
                    key={link.label}
                    className="glass-mobile-group"
                  >
                    <button
                      type="button"
                      className={`
                        glass-mobile-link
                        glass-mobile-toggle
                        ${servicesOpen && openDropdown === link.label ? "open" : ""}
                      `}
                      aria-expanded={servicesOpen && openDropdown === link.label}
                      aria-haspopup="true"
                      aria-controls={`mobile-dropdown-${link.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}
                      onClick={() => {
                        clearNavbarTimer();
                        setIsVisible(true);
                        const nextOpen = openDropdown === link.label ? null : link.label;
                        setOpenDropdown(nextOpen);
                        setServicesOpen(Boolean(nextOpen));
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setOpenDropdown(link.label);
                          setServicesOpen(true);
                          window.requestAnimationFrame(() => {
                            document.getElementById(`mobile-dropdown-${link.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`)?.querySelector("a")?.focus();
                          });
                        }
                      }}
                    >
                      <span>
                        {link.label}
                      </span>

                      <ChevronDown size={16} />
                    </button>

                    {servicesOpen && openDropdown === link.label && (
                      <div id={`mobile-dropdown-${link.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`} className="glass-mobile-sub">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`
                              glass-mobile-link
                              sub
                              ${location.pathname === item.path
                                ? "active"
                                : ""
                              }
                            `}
                            onClick={() => {
                              setServicesOpen(false);
                              setOpenDropdown(null);
                              setMobileOpen(false);

                              mobileOpenRef.current = false;

                              clearNavbarTimer();
                              setIsVisible(true);
                            }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              /* ---------------------------------------------
                 MOBILE NORMAL LINK
              --------------------------------------------- */

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    glass-mobile-link
                    ${isActive(link) ? "active" : ""}
                  `}
                  aria-current={isActive(link) ? "page" : undefined}
                  onClick={() => {
                    setMobileOpen(false);

                    mobileOpenRef.current = false;

                    setServicesOpen(false);
                    setOpenDropdown(null);

                    clearNavbarTimer();
                    setIsVisible(true);
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
