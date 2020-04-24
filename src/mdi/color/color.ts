import { Component, Part, Prop } from '@mdi/element';
import { SWATCHES } from './constants';
import { hexToRgb, normalizeHex } from './utils';

import template from './color.html';
import style from './color.css';

@Component({
  selector: 'mdi-color',
  style,
  template
})
export default class MdiColor extends HTMLElement {
  @Prop() value: string = '#000000';

  @Part() $grid: HTMLDivElement;

  buttons: [HTMLButtonElement, string, any][] = [];
  isMouseDown: boolean = false;
  index: number = -1;

  connectedCallback() {
    SWATCHES.forEach((group, groupIndex) => {
      group.colors.forEach((color, colorIndex) => {
        const button = document.createElement('button');
        button.style.background = `#${color.hex}`;
        if (color.name === 'black') {
          button.style.gridArea = `13 / 17 / 14 / 19`;
          button.classList.add('black');
        } else if (color.name === 'white') {
          button.style.gridArea = `11 / 17 / 12 / 19`;
          button.classList.add('white');
        } else {
          button.style.gridRow = `${colorIndex + 1}`;
          button.style.gridColumn = `${groupIndex + 1}`;
        }
        const index = this.buttons.push([
          button,
          `#${color.hex}`,
          group
        ]);
        button.addEventListener('click', () => {
          this.handleSelect(index - 1);
        });
        button.addEventListener('mouseenter', () => {
          if (this.isMouseDown) {
            this.handleSelect(index - 1);
          }
        });
        this.$grid.appendChild(button);
      });
    });
    this.$grid.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      const index = this.buttons.findIndex(([b]) => b === e.target);
      if (index !== -1) {
        this.handleSelect(index);
      }
    });
    const setToFalse = () => {
      this.isMouseDown = false;
      document.removeEventListener('mouseup', setToFalse);
    };
    document.addEventListener('mouseup', setToFalse);
  }

  handleSelect(index) {
    const [button, hex, group] = this.buttons[index];
    const rgb = hexToRgb(hex);
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        group,
        hex,
        rgb
      }
    }));
    if (this.index !== -1) {
      const [lastButton] = this.buttons[this.index];
      lastButton.classList.toggle('active', false);
    }
    button.classList.toggle('active', true);
    this.index = index;
  }
}
