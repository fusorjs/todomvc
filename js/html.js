import {createComponent} from '@perform/dom/component';
import {createTags} from '@perform/base/tag';

export const {
  div, ul, li, h1, header, section, footer,
  span, strong, a, input, label, button,
} = createTags([
  'div', 'ul', 'li', 'h1', 'header', 'section', 'footer',
  'span', 'strong', 'a', 'input', 'label', 'button',
], createComponent);
