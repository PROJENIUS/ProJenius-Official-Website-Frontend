import { useCallback, useEffect, useRef, useState } from "react";

import "./Magazine.css";

/* PDF is in src/assets/About/ */
import magazinePdf from "../../../assets/About/Magazine/Magazine.pdf";

/* ======================================================================
   Magazine.jsx

   ProJenius Magazine section — ONE file, ONE stylesheet (Magazine.css).

   No inline styles, no CSS modules, no third-party CSS/plugins.

   Every class name in the stylesheet is prefixed "hpmag" so it cannot
   clash with the rest of the site.

   ====================================================================== */

/* --------------------------------------------------------------------
   1) CONFIG — connect your EXISTING magazine content here
   -------------------------------------------------------------------- */

const MAGAZINE_TITLE = "ProJenius Magazine";

const MAGAZINE_TOTAL_PAGES = 25;

/* Page images are found automatically in src/assets/About/Magazine
   (files must be named page-1.webp ... page-25.webp). */
const magazineImageModules = import.meta.glob(
    "../../../assets/About/Magazine/Page/*.webp",
    { eager: true, import: "default" }
);

if (Object.keys(magazineImageModules).length === 0) {
    console.warn(
        "Magazine: no images found. Put page-1.webp ... page-25.webp in src/assets/About/Magazine/Page/"
    );
}

const MAGAZINE_PAGES = Array.from(
    { length: MAGAZINE_TOTAL_PAGES },
    (_, i) => {
        const suffix = `/Page/page-${i + 1}.webp`;

        const key = Object.keys(magazineImageModules).find((k) =>
            k.endsWith(suffix)
        );

        return key ? magazineImageModules[key] : "";
    }
);

/* Your PDF (imported above from src/assets/About). */
const MAGAZINE_DOWNLOAD_URL = magazinePdf;
const MAGAZINE_DOWNLOAD_NAME = "ProJenius_Magazine.pdf";

/* Only shown if they really exist. Leave null to hide. */
const MAGAZINE_ISSUE = null; // e.g. "01"
const MAGAZINE_DATE = null; // e.g. "2026"

/* "Inside this issue" sections.
   NOTE: if the slide you removed came BEFORE any of these pages,
   change that section's page number (e.g. 22 -> 21). */
const MAGAZINE_SECTIONS = [
    { id: "about", label: "About Us", page: 3 },
    { id: "ecosystem", label: "Ecosystem", page: 8 },
    { id: "services", label: "Services", page: 11 },
    { id: "collaboration", label: "Collaboration", page: 18 },
    { id: "achievements", label: "Achievements", page: 22 },
];

/* ---------- helpers ---------- */

const clampMagazinePage = (n) =>
    Math.min(MAGAZINE_TOTAL_PAGES, Math.max(1, Math.round(n)));

const getMagazinePageSrc = (n) => MAGAZINE_PAGES[n - 1];

const getMagazinePageAlt = (n) =>
    `${MAGAZINE_TITLE}, page ${n} of ${MAGAZINE_TOTAL_PAGES}`;

const getMagazineMeta = () => {
    const items = [MAGAZINE_TITLE];

    if (MAGAZINE_ISSUE) items.push(`Issue ${MAGAZINE_ISSUE}`);
    if (MAGAZINE_DATE) items.push(MAGAZINE_DATE);

    items.push(
        "Digital publication",
        `${MAGAZINE_TOTAL_PAGES} pages`
    );

    return items;
};

/* Lazy loading: pages are only fetched/decoded when needed (current + neighbours). */
const readyCache = new Map();

const magazinePageReady = (n) => {
    if (n < 1 || n > MAGAZINE_TOTAL_PAGES) return Promise.resolve();

    if (!readyCache.has(n)) {
        const img = new Image();

        img.decoding = "async";
        img.src = getMagazinePageSrc(n);

        const decoded = img.decode
            ? img.decode()
            : new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
              });

        readyCache.set(n, decoded.catch(() => {}));
    }

    return readyCache.get(n);
};

/* --------------------------------------------------------------------
   2) ICONS — small inline SVGs, sized by each block's own CSS
   -------------------------------------------------------------------- */

const base = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
};

const ChevronLeftIcon = () => (
    <svg {...base} strokeWidth="2">
        <path d="M15 5l-7 7 7 7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg {...base} strokeWidth="2">
        <path d="M9 5l7 7-7 7" />
    </svg>
);

const DownloadIcon = () => (
    <svg {...base} strokeWidth="1.8">
        <path d="M12 3v12m0 0-4-4m4 4 4-4M4 20h16" />
    </svg>
);

const BookOpenIcon = () => (
    <svg {...base} strokeWidth="1.8">
        <path d="M2 5.5c3-1.3 6-1.3 10 .8 4-2.1 7-2.1 10-.8v13c-3-1.3-6-1.3-10 .8-4-2.1-7-2.1-10-.8z" />
        <path d="M12 6.3v13" />
    </svg>
);

const CloseIcon = () => (
    <svg {...base} strokeWidth="2">
        <path d="M6 6l12 12M18 6L6 18" />
    </svg>
);

const ExpandIcon = () => (
    <svg {...base} strokeWidth="2">
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
);

/* --------------------------------------------------------------------
   3) SHARED HELPERS — page-number padding + touch-swipe
   -------------------------------------------------------------------- */

/* two-digit page numbers, e.g. 1 -> "01" */
const pad = (n) => String(n).padStart(2, "0");

/* Touch swipe helper (mouse is ignored so desktop clicks are unaffected).
   onSwipe(1) = next page, onSwipe(-1) = previous page. */
const useSwipe = (onSwipe) => {
    const startRef = useRef(null);
    const swipedRef = useRef(false);

    const onPointerDown = useCallback((e) => {
        if (e.pointerType === "mouse") return;

        startRef.current = {
            x: e.clientX,
            y: e.clientY,
        };
    }, []);

    const onPointerUp = useCallback(
        (e) => {
            const start = startRef.current;

            startRef.current = null;

            if (!start) return;

            const dx = e.clientX - start.x;
            const dy = e.clientY - start.y;

            if (
                Math.abs(dx) > 44 &&
                Math.abs(dx) > Math.abs(dy) * 1.5
            ) {
                swipedRef.current = true;

                onSwipe(dx < 0 ? 1 : -1);

                setTimeout(() => {
                    swipedRef.current = false;
                }, 350);
            }
        },
        [onSwipe]
    );

    const onPointerCancel = useCallback(() => {
        startRef.current = null;
    }, []);

    return {
        handlers: {
            onPointerDown,
            onPointerUp,
            onPointerCancel,
        },
        wasSwipe: () => swipedRef.current,
    };
};

/* --------------------------------------------------------------------
   4) Editorial intro
   -------------------------------------------------------------------- */

const MagazineIntro = () => (
    <div className="hpmag-intro">
        <h2
            className="hpmag-intro__headline hpmag-rv hpmag-rv--1"
            id="hpmag-title"
        >
            <span>Ideas.</span>
            <span>Technology.</span>
            <span>People.</span>
            <span>Progress.</span>
        </h2>

        <span
            className="hpmag-intro__rule hpmag-rv hpmag-rv--2"
            aria-hidden="true"
        />

        <p className="hpmag-intro__lede hpmag-rv hpmag-rv--3">
            A digital publication from ProJenius featuring our journey,
            projects, workshops, learning initiatives, and the people behind
            them.
        </p>
    </div>
);

/* --------------------------------------------------------------------
   5) Actions
   -------------------------------------------------------------------- */

const MagazineActions = ({ onExplore }) => (
    <div className="hpmag-actions hpmag-rv hpmag-rv--4">
        <button
            type="button"
            className="hpmag-actions__btn hpmag-actions__btn--primary"
            onClick={onExplore}
            aria-haspopup="dialog"
        >
            <BookOpenIcon />
            Explore Magazine
        </button>

        <a
            className="hpmag-actions__btn hpmag-actions__btn--secondary"
            href={MAGAZINE_DOWNLOAD_URL}
            download={MAGAZINE_DOWNLOAD_NAME}
        >
            <DownloadIcon />
            Download Magazine
        </a>
    </div>
);

/* --------------------------------------------------------------------
   6) "Inside this issue" editorial text navigation
   -------------------------------------------------------------------- */

const MagazineToc = ({ page, onSelect }) => {
    let activeId = null;
    let activePage = -1;

    MAGAZINE_SECTIONS.forEach((s) => {
        if (s.page <= page && s.page >= activePage) {
            activeId = s.id;
            activePage = s.page;
        }
    });

    return (
        <div className="hpmag-toc hpmag-rv hpmag-rv--5">
            <p className="hpmag-toc__label" id="hpmag-toc-label">
                Inside this issue
            </p>

            <nav aria-labelledby="hpmag-toc-label">
                <div className="hpmag-toc__scroller">
                    <ul className="hpmag-toc__list">
                        {MAGAZINE_SECTIONS.map((s) => (
                            <li key={s.id} className="hpmag-toc__item">
                                <button
                                    type="button"
                                    className="hpmag-toc__btn"
                                    data-label={s.label}
                                    aria-current={
                                        s.id === activeId
                                            ? "true"
                                            : undefined
                                    }
                                    aria-label={`${s.label}, go to page ${s.page}`}
                                    onClick={() => onSelect(s.page)}
                                >
                                    {s.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

/* --------------------------------------------------------------------
   7) Publication metadata row
   -------------------------------------------------------------------- */

const MagazineMeta = () => (
    <ul className="hpmag-meta" aria-label="Publication details">
        {getMagazineMeta().map((item) => (
            <li key={item} className="hpmag-meta__item">
                {item}
            </li>
        ))}
    </ul>
);

/* --------------------------------------------------------------------
   8) Magazine preview
   -------------------------------------------------------------------- */

const TURN_MS = 700;
const TURN_FAST_MS = 520;

const IDLE = {
    dir: null,
    fast: false,
};

const wait = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const MagazineBook = ({
    page,
    readerOpen,
    onOpen,
    onStep,
}) => {
    const [basePage, setBasePage] = useState(page);
    const [flipPage, setFlipPage] = useState(page);
    const [turn, setTurn] = useState(IDLE);

    const mountedRef = useRef(true);
    const busyRef = useRef(false);
    const shownRef = useRef(page);
    const latestRef = useRef(page);
    const readerOpenRef = useRef(readerOpen);

    latestRef.current = page;
    readerOpenRef.current = readerOpen;

    const { handlers, wasSwipe } = useSwipe(onStep);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    const run = useCallback(async () => {
        if (busyRef.current) return;

        busyRef.current = true;

        while (
            mountedRef.current &&
            shownRef.current !== latestRef.current
        ) {
            const from = shownRef.current;
            const to = latestRef.current;

            const reduce = window
                .matchMedia("(prefers-reduced-motion: reduce)")
                .matches;

            if (reduce || readerOpenRef.current) {
                shownRef.current = to;
                setBasePage(to);
                continue;
            }

            await Promise.all([
                magazinePageReady(from),
                magazinePageReady(to),
            ]);

            if (!mountedRef.current) break;

            const next = to > from;
            const fast = Math.abs(to - from) > 1;

            setBasePage(next ? to : from);
            setFlipPage(next ? from : to);

            setTurn({
                dir: next ? "next" : "prev",
                fast,
            });

            await wait(fast ? TURN_FAST_MS : TURN_MS);

            if (!mountedRef.current) break;

            shownRef.current = to;
            setBasePage(to);
            setTurn(IDLE);

            await wait(0);
        }

        busyRef.current = false;
    }, []);

    useEffect(() => {
        run();
    }, [page, run]);

    /* only load what is needed: current page + its neighbours */
    useEffect(() => {
        magazinePageReady(page);
        magazinePageReady(page + 1);
        magazinePageReady(page - 1);
    }, [page]);

    const handleOpen = () => {
        if (!wasSwipe()) onOpen();
    };

    const tiltClass =
        "hpmag-book__tilt" +
        (turn.fast ? " hpmag-book__tilt--fast" : "");

    const flipClass =
        "hpmag-book__leaf hpmag-book__leaf--flip" +
        (turn.dir
            ? ` hpmag-book__leaf--turn-${turn.dir}`
            : "");

    const shadeClass =
        "hpmag-book__shade" +
        (turn.dir ? " hpmag-book__shade--on" : "");

    return (
        <div className="hpmag-book" {...handlers}>
            <div className="hpmag-book__rise">
                <div className={tiltClass}>
                    <img
                        className="hpmag-book__leaf hpmag-book__leaf--base"
                        src={getMagazinePageSrc(basePage)}
                        alt={getMagazinePageAlt(basePage)}
                        decoding="async"
                        draggable="false"
                    />

                    <div
                        className={shadeClass}
                        aria-hidden="true"
                    />

                    <img
                        className={flipClass}
                        src={getMagazinePageSrc(flipPage)}
                        alt=""
                        aria-hidden="true"
                        hidden={!turn.dir}
                        decoding="async"
                        draggable="false"
                    />

                    <div
                        className="hpmag-book__finish"
                        aria-hidden="true"
                    />

                    <span
                        className="hpmag-book__hint"
                        aria-hidden="true"
                    >
                        <ExpandIcon />
                        Read
                    </span>

                    <button
                        type="button"
                        className="hpmag-book__hit"
                        onClick={handleOpen}
                        aria-haspopup="dialog"
                        aria-label={`Open magazine viewer, currently on page ${page}`}
                    />
                </div>

                <div
                    className="hpmag-book__floor"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
};

/* --------------------------------------------------------------------
   9) Page navigation
   -------------------------------------------------------------------- */

const MagazinePager = ({
    page,
    total,
    onPrev,
    onNext,
}) => (
    <>
        <div
            className="hpmag-pager"
            role="group"
            aria-label="Magazine page navigation"
        >
            <button
                type="button"
                className="hpmag-pager__btn"
                onClick={onPrev}
                aria-label="Previous page"
                aria-disabled={page === 1}
            >
                <ChevronLeftIcon />
            </button>

            <div
                className="hpmag-pager__count"
                aria-hidden="true"
            >
                <span className="hpmag-pager__label">
                    Current page
                </span>

                <span className="hpmag-pager__num">
                    <b>{pad(page)}</b>
                    <i>/</i>
                    <span className="hpmag-pager__total">
                        {pad(total)}
                    </span>
                </span>
            </div>

            <button
                type="button"
                className="hpmag-pager__btn"
                onClick={onNext}
                aria-label="Next page"
                aria-disabled={page === total}
            >
                <ChevronRightIcon />
            </button>
        </div>

        <progress
            className="hpmag-pager__progress"
            value={page}
            max={total}
            aria-hidden="true"
        />

        {/* screen-reader friendly page count */}
        <p
            className="hpmag-pager__sr"
            role="status"
            aria-live="polite"
        >
            Page {page} of {total}
        </p>
    </>
);

/* --------------------------------------------------------------------
   10) Full-screen reader
   -------------------------------------------------------------------- */

const OUT_MS = 130;
const IN_MS = 240;

const MagazineReader = ({
    open,
    page,
    onClose,
    onStep,
    onGoTo,
}) => {
    const total = MAGAZINE_TOTAL_PAGES;

    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const mainRef = useRef(null);

    const [shown, setShown] = useState(page);
    const [phase, setPhase] = useState("idle");
    const [dir, setDir] = useState("next");

    const shownRef = useRef(page);

    const { handlers } = useSwipe(onStep);

    /* open / close the native dialog */
    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();

            document.body.classList.add(
                "hpmag-scroll-lock"
            );

            if (closeRef.current) {
                closeRef.current.focus();
            }
        } else if (!open && dialog.open) {
            dialog.close();
        }

        if (!open) {
            document.body.classList.remove(
                "hpmag-scroll-lock"
            );
        }
    }, [open]);

    useEffect(
        () => () => {
            document.body.classList.remove(
                "hpmag-scroll-lock"
            );
        },
        []
    );

    /* slide + fade between pages */
    useEffect(() => {
        if (!open) {
            shownRef.current = page;
            setShown(page);
            setPhase("idle");

            return undefined;
        }

        if (shownRef.current === page) {
            setPhase("idle");
            return undefined;
        }

        let cancelled = false;
        const timers = [];

        setDir(
            page > shownRef.current
                ? "next"
                : "prev"
        );

        setPhase("out");

        timers.push(
            setTimeout(async () => {
                await magazinePageReady(page);

                if (cancelled) return;

                shownRef.current = page;
                setShown(page);
                setPhase("in");

                magazinePageReady(page + 1);
                magazinePageReady(page - 1);

                timers.push(
                    setTimeout(
                        () => setPhase("idle"),
                        IN_MS
                    )
                );
            }, OUT_MS)
        );

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
        };
    }, [page, open]);

    const handleClosed = () => {
        document.body.classList.remove(
            "hpmag-scroll-lock"
        );

        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.target instanceof HTMLInputElement) return;

        if (e.key === "ArrowRight") {
            e.preventDefault();
            onStep(1);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            onStep(-1);
        } else if (e.key === "Home") {
            e.preventDefault();
            onGoTo(1);
        } else if (e.key === "End") {
            e.preventDefault();
            onGoTo(total);
        }
    };

    const handleBackdropClick = (e) => {
        if (
            e.target === dialogRef.current ||
            e.target === mainRef.current
        ) {
            onClose();
        }
    };

    const imgClass =
        "hpmag-reader__img" +
        (phase === "out"
            ? ` hpmag-reader__img--out-${dir}`
            : "") +
        (phase === "in"
            ? ` hpmag-reader__img--in-${dir}`
            : "");

    return (
        <dialog
            ref={dialogRef}
            className="hpmag-reader"
            aria-labelledby="hpmag-reader-title"
            onClose={handleClosed}
            onKeyDown={handleKeyDown}
            onClick={handleBackdropClick}
        >
            {open && (
                <div className="hpmag-reader__shell">
                    <header className="hpmag-reader__top">
                        <div className="hpmag-reader__titles">
                            <p
                                className="hpmag-reader__name"
                                id="hpmag-reader-title"
                            >
                                {MAGAZINE_TITLE}
                            </p>

                            <p className="hpmag-reader__sub">
                                Page {page} of {total}
                            </p>
                        </div>

                        <div className="hpmag-reader__tools">
                            <a
                                className="hpmag-reader__download"
                                href={MAGAZINE_DOWNLOAD_URL}
                                download={
                                    MAGAZINE_DOWNLOAD_NAME
                                }
                                aria-label="Download magazine"
                            >
                                <DownloadIcon />
                                <span>Download</span>
                            </a>

                            <button
                                ref={closeRef}
                                type="button"
                                className="hpmag-reader__round"
                                onClick={onClose}
                                aria-label="Close magazine viewer"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </header>

                    <div
                        ref={mainRef}
                        className="hpmag-reader__main"
                        {...handlers}
                    >
                        <div className="hpmag-reader__frame">
                            <img
                                className={imgClass}
                                src={getMagazinePageSrc(
                                    shown
                                )}
                                alt={getMagazinePageAlt(
                                    shown
                                )}
                                decoding="async"
                                draggable="false"
                            />
                        </div>
                    </div>

                    <footer className="hpmag-reader__bottom">
                        <button
                            type="button"
                            className="hpmag-reader__round"
                            onClick={() =>
                                onStep(-1)
                            }
                            aria-label="Previous page"
                            aria-disabled={page === 1}
                        >
                            <ChevronLeftIcon />
                        </button>

                        <div className="hpmag-reader__scrub">
                            <span
                                className="hpmag-reader__count"
                                aria-hidden="true"
                            >
                                <b>{pad(page)}</b>{" "}
                                <span>
                                    / {pad(total)}
                                </span>
                            </span>

                            <input
                                className="hpmag-reader__range"
                                type="range"
                                min="1"
                                max={total}
                                value={page}
                                onChange={(e) =>
                                    onGoTo(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                aria-label="Go to page"
                                aria-valuetext={`Page ${page} of ${total}`}
                            />
                        </div>

                        <button
                            type="button"
                            className="hpmag-reader__round"
                            onClick={() =>
                                onStep(1)
                            }
                            aria-label="Next page"
                            aria-disabled={
                                page === total
                            }
                        >
                            <ChevronRightIcon />
                        </button>
                    </footer>
                </div>
            )}
        </dialog>
    );
};

/* --------------------------------------------------------------------
   11) Root component
   -------------------------------------------------------------------- */

const Magazine = () => {
    const [page, setPage] = useState(1);

    const [readerOpen, setReaderOpen] =
        useState(false);

    const [inView, setInView] = useState(false);

    const sectionRef = useRef(null);

    /* scroll-in sequence */
    useEffect(() => {
        const node = sectionRef.current;

        if (
            !node ||
            typeof IntersectionObserver ===
                "undefined"
        ) {
            setInView(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    const goTo = useCallback(
        (n) =>
            setPage(clampMagazinePage(n)),
        []
    );

    const step = useCallback(
        (d) =>
            setPage((p) =>
                clampMagazinePage(p + d)
            ),
        []
    );

    const openReader = useCallback(
        () => setReaderOpen(true),
        []
    );

    const closeReader = useCallback(
        () => setReaderOpen(false),
        []
    );

    const handleStageKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
        }
    };

    return (
        <section
            ref={sectionRef}
            id="magazine"
            className={`hpmag${
                inView ? " hpmag--in" : ""
            }`}
            aria-labelledby="hpmag-title"
        >
            <div className="hpmag__inner">
                <div className="hpmag__intro">
                    <MagazineIntro />
                </div>

                <div className="hpmag__actions">
                    <MagazineActions
                        onExplore={openReader}
                    />
                </div>

                <div className="hpmag__inside">
                    <MagazineToc
                        page={page}
                        onSelect={goTo}
                    />
                </div>

                <div
                    className="hpmag__stage"
                    role="group"
                    aria-label="Magazine preview"
                    onKeyDown={handleStageKeyDown}
                >
                    <MagazineMeta />

                    <MagazineBook
                        page={page}
                        readerOpen={readerOpen}
                        onOpen={openReader}
                        onStep={step}
                    />

                    <MagazinePager
                        page={page}
                        total={MAGAZINE_TOTAL_PAGES}
                        onPrev={() => step(-1)}
                        onNext={() => step(1)}
                    />
                </div>
            </div>

            <MagazineReader
                open={readerOpen}
                page={page}
                onClose={closeReader}
                onStep={step}
                onGoTo={goTo}
            />
        </section>
    );
};

export default Magazine;