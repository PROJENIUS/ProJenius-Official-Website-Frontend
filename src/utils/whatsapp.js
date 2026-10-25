/* WhatsApp chat links. One number for the whole site: change it here. */

export const WHATSAPP_NUMBER = "918925450473"; // country code + number, no "+" or spaces

/* Link that opens a WhatsApp chat with the message already typed in. */
export function whatsappHref(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
