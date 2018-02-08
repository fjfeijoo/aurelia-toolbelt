import { CssMinifier } from './../../../utilities/purejs/cssMinifier';
import { transient, customElement, inject, containerless, bindable, bindingMode, observable, DOM } from 'aurelia-framework';

import * as $ from 'jquery';
import 'aureliatoolbelt-thirdparty/jquery.blockUI/jquery.blockUI.js';
import { IAutBlockUIOption } from './aut-block-ui-option';

@customElement('aut-block-ui')
@inject(Element, 'aut-block-ui-option', CssMinifier)
export class JQueryBlockUI {

  @bindable({ defaultBindingMode: bindingMode.twoWay }) public settings: IAutBlockUIOption = null;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) public block: string | boolean = false;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public blockPage: string | boolean = false;

  private content: HTMLDivElement;
  private spinnerMessage: string = null;
  private elementId: string;
  constructor(private element: Element, private option: IAutBlockUIOption, private cssMinifier: CssMinifier) {

  }

  private hasContent() {
    let slot = this.content.innerHTML.replace('<!--slot-->', '').trim();
    if (slot.length > 0) {
      return true;
    }
    return false;
  }

  private afterAttached() {
    if (this.blockPage && this.hasContent()) {
      throw Error('You can not use the [aut-block-ui] with [block-page] property, while you have defined a content inside it.');
    }

    if (this.settings) {
      this.option = Object.assign(this.option, this.settings);
    }

    let id = this.content.id;
    this.elementId = `#${id}`;
    this.setDefaultOption(id);
    this.setSpinnerStyle(id);

    this.blockChanged(this.block);
    this.blockPageChanged(this.blockPage);

  }

  private setDefaultOption(id: string) {
    $.blockUI.defaults.allowBodyStretch = this.option.allowBodyStretch || true;
    $.blockUI.defaults.draggable = this.option.draggable || true;
    $.blockUI.defaults.css = this.option.css || {
      padding: 0,
      margin: 0,
      width: '30%',
      top: '45%',
      left: '35%',
      textAlign: 'center',
      color: '#000',
      border: '3px solid #aaa',
      backgroundColor: '#fff',
      cursor: 'wait'
    };
    $.blockUI.defaults.overlayCSS = this.option.overlayCSS || {
      backgroundColor: '#000',
      opacity: 0.6,
      cursor: 'wait'
    };
    $.blockUI.defaults.cursorReset = this.option.cursorReset || 'default';
    $.blockUI.defaults.iframeSrc = this.option.iframeSrc || (/^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank');
    $.blockUI.defaults.forceIframe = this.option.forceIframe || false;
    $.blockUI.defaults.baseZ = this.option.baseZ || 1020;
    $.blockUI.defaults.centerX = this.option.centerX || true;
    $.blockUI.defaults.centerY = this.option.centerY || true;
    $.blockUI.defaults.bindEvents = this.option.bindEvents || true;
    $.blockUI.defaults.constrainTabKey = this.option.constrainTabKey || true;
    $.blockUI.defaults.fadeIn = this.option.fadeIn || 200;
    $.blockUI.defaults.fadeOut = this.option.fadeOut || 400;
    $.blockUI.defaults.timeout = this.option.timeout || 0;
    $.blockUI.defaults.showOverlay = this.option.showOverlay || true;
    $.blockUI.defaults.focusInput = this.option.focusInput || true;
    $.blockUI.defaults.quirksmodeOffsetHack = this.option.quirksmodeOffsetHack || 4;
    $.blockUI.defaults.blockMsgClass = (this.option.blockMsgClass || 'blockMsg') + ` m${id}`;
    $.blockUI.defaults.ignoreIfBlocked = this.option.ignoreIfBlocked || false;
    $.blockUI.defaults.message = this.option.message || '<h1>Please wait...</h1>';
  }

  private setSpinnerStyle(id: string) {
    let unit: string = this.getSizeUnit(this.option.spinnerSize);
    let size: number = this.getSize(this.option.spinnerSize);

    let isClass = false;
    let spinnerBgColor = '';
    if (this.option.spinnerColor) {
      isClass = this.option.spinnerColor.indexOf('.') > -1;
      if (isClass) {
        spinnerBgColor = 'bg-' + this.option.spinnerColor.replace('.', '');
      } else {
        spinnerBgColor = `background-color: ${this.option.spinnerColor || '#92459B'} !important`;
      }
    } else {
      spinnerBgColor = 'bg-primary';
      isClass = true;
    }

    let minify = `
    .blockElement.${'m' + id}{
      z-index: ${$.blockUI.defaults.baseZ} !important;
    }
    .blockPage.${'m' + id}{
      z-index: ${$.blockUI.defaults.baseZ} !important;
    }
    .${'b' + id} {
      width: ${size}${unit} !important;
      height: ${size}${unit} !important;
      ${!isClass ? spinnerBgColor : ''}
    }`;
    DOM.injectStyles(this.cssMinifier.minify(minify), null, null, 's' + id);

    // tslint:disable-next-line:max-line-length
    this.spinnerMessage = `<div class="bounce"><div class="bounce1 ${isClass ? spinnerBgColor : ''} ${'b' + id}"></div><div class="bounce2 ${isClass ? spinnerBgColor : ''} ${'b' + id}"></div><div class="bounce3 ${isClass ? spinnerBgColor : ''} ${'b' + id}"></div></div>`;
  }

  private blockChanged(isBlocked: boolean | string) {
    let option: any = {};
    if (!this.option.message) {
      option = {
        css: {
          border: 'none',
          backgroundColor: 'transparent'
        },
        message: this.spinnerMessage,
        overlayCSS: {
          backgroundColor: '#A0A0A0'
        }
      };
    } else {
      option = this.option;
    }
    if (isBlocked) {
      $(this.elementId).block(option);
      this.element.classList.add('block-ui-content');
      $(window).resize(() => {
        if (this.element.classList.contains('block-ui-content')) {
          $(this.elementId).block(option);
        }
      });
    } else {
      $(this.elementId).unblock();
      this.element.classList.remove('block-ui-content');
    }
  }

  private blockPageChanged(isBlocked: boolean | string) {
    if (this.blockPage && this.hasContent()) {
      throw Error('You can not use the [aut-block-ui] with [block-page] property, while you have defined a content inside it.');
    }
    let option: any = {};
    if (!this.option.message) {
      option = {
        css: {
          border: 'none',
          backgroundColor: 'transparent'
        },
        message: this.spinnerMessage,
        overlayCSS: {
          backgroundColor: '#A0A0A0'
        }
      };
    } else {
      option = this.option.message;
    }
    if (isBlocked) {
      $.blockUI(option);
    } else {
      $.unblockUI();
    }
  }

  private getSizeUnit(text: string): string {
    if (!text) {
      return 'px';
    }
    let unit = text.replace(/[0-9]/g, '').replace('.', '');
    if (unit === '') {
      unit = 'px';
    }
    return unit;
  }

  private getSize(text: string) {
    if (!text) {
      return 12;
    }
    let unit = this.getSizeUnit(text);
    let size = Number(text.replace(unit, '').trim());
    return size;
  }

  private detached() {
    $.unblockUI();
    $(this.content).unblock();
  }
}
