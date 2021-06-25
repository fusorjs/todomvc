import {createTags} from '@perform/base/tag';
import {component} from '@perform/dom';

export const {
  div, ul, li, h1, header, section, footer,
  span, strong, a, input, label, button,
} = createTags([
  'div', 'ul', 'li', 'h1', 'header', 'section', 'footer',
  'span', 'strong', 'a', 'input', 'label', 'button',
], component);
