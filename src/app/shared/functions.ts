

export function getPathToBody(el: HTMLElement) {

  const arr: HTMLElement[] = [];
  let cur = el;

  while(cur) {
    arr.push(cur);
    cur = cur.parentElement!;
  }

  return arr;

}


export function announceToScreenReader(message: string, ariaLive: 'assertive' | 'polite' = 'assertive', ariaAtomic = 'true') {
  // Create or get the announcement element
  let announcementElement = document.getElementById('sr-announcement');

  // If element doesn't exist, create it
  if (!announcementElement) {
    announcementElement = document.createElement('div');
    announcementElement.setAttribute('id', 'sr-announcement');

    // Make it visually hidden but accessible to screen readers
    announcementElement.style.cssText = `
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;

    // Add aria attributes for screen reader announcement
    announcementElement.setAttribute('aria-live', ariaLive);
    announcementElement.setAttribute('aria-atomic', ariaAtomic);

    // Add to the document
    document.body.appendChild(announcementElement);
  }

  // Update the content
  announcementElement.textContent = message;

  // Force re-announcement by temporarily changing content
  // This helps with screen readers that might not re-read identical content
  setTimeout(() => {
    announcementElement.textContent = '';
    setTimeout(() => {
      announcementElement.textContent = message;
    }, 50);
  }, 50);
}
