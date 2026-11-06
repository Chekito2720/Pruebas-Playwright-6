/**
 * Selectores centralizados. Si el sitio cambia, solo hay que ajustar este archivo.
 */
export const S = {
  // Pantalla de bienvenida
  startLink: 'a.start__link',

  // Overlays molestos
  cookiesForm: '.cookies',
  cookiesButtons: '.cookies button',
  cookiesDecline: '.cookies button:has-text("Not really, no")',
  helpForm: '.help-form',
  helpHide: '.help-form__send-to-bottom-button',
  timer: '.timer',

  // Tarjeta 1: credenciales
  password: 'input[placeholder="Choose Password"]',
  email: 'input[placeholder="Your email"]',
  domain: 'input[placeholder="Domain"]',
  dropdownOpener: '.dropdown__opener',
  dropdownItem: '.dropdown__list-item',
  termsBox: '.checkbox__box',

  // Tarjeta 2: avatar e intereses
  uploadButton: '.avatar-and-interests__upload-button',
  interestItem: '.avatar-and-interests__interests-list__item',
  unselectAll: 'label[for="interest_unselectall"]',

  // Botones "Next" (visibles)
  next: ':is(a,button):visible',
} as const;
