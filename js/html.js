import {createComponent} from '@perform/core/dom';
import {createTags} from '@perform/core/tags';

export const {
  div, ul, li, h1, header, section, footer,
  span, strong, a, input, label, button,
} = createTags([
  'div', 'ul', 'li', 'h1', 'header', 'section', 'footer',
  'span', 'strong', 'a', 'input', 'label', 'button',
], createComponent);
