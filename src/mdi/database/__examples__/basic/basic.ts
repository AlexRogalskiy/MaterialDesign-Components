import { Component, Part, Prop } from '@mdi/element';
import MdiDatabase from 'mdi/database/database';
import { Icon } from './../../../shared/models/icon';

import template from './basic.html';

@Component({
  selector: 'x-mdi-database-basic',
  template
})
export default class XMdiDatabaseBasic extends HTMLElement {

  @Prop() fontId = 'D051337E-BC7E-11E5-A4E9-842B2B6CFE1B';

  @Part() $database: MdiDatabase;

  @Part() $count: HTMLSpanElement;
  @Part() $total: HTMLSpanElement;

  icons: Icon[] = [];

  connectedCallback() {
    this.$database.addEventListener('sync', this.handleSync.bind(this));
    this.$database.font = this.fontId;
  }

  async handleSync(e: CustomEvent) {
    const { db } = e.detail;
    const count = await db.getCount(this.fontId);
    this.$count.innerText = count;
    const icons = await db.getIcons(this.fontId);
    this.$total.innerText = icons.length;

    // Optionally Cache outide of IndexedDB
    this.icons = icons;
  }
}