// In-memory intro state (no storage APIs — resets on hard reload, which is
// exactly when the preloader should replay).
let introPending = true

export const isIntroPending = () => introPending

export const completeIntro = () => {
  introPending = false
}

// How long page content waits before animating in on first load, so the hero
// reveal starts just as the preloader curtain lifts.
export const INTRO_HERO_DELAY = 2.1
