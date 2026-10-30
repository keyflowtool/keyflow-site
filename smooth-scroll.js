/* Mouse wheel: NATIVE scrolling (user, 2026-10-30: "sigo percibiendo un trancazo... cuando intento desplazarme con la
   rueda"). The hand-made smooth scroll that lived here caught every wheel notch with a non-passive listener, so the
   browser had to wait for the page before scrolling: whenever the page was busy (starting the card videos) the wheel
   froze for a moment, and a size change above the view cut a glide halfway. Native wheel scrolling runs off the
   page's thread and can't be held up. The file stays (every page links it) but does nothing.
   The previous version is in the git history (commit before 2026-10-30). */
