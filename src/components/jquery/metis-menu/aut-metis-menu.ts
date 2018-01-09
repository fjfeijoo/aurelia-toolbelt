import { inject, customElement, containerless, bindable, bindingMode, singleton, DOM } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';


import * as $ from 'jquery';
import 'metismenu';
import { IBootstrapColor } from './IBootstrapColors';

export type ThemeType = 'light' | 'dark';

@containerless()
@customElement('aut-metis-menu')
export class JQueryMetisMenu {

  private metismenu: HTMLUListElement;

  @bindable({ defaultBindingMode: bindingMode.oneTime }) public class: string = '';
  @bindable({ defaultBindingMode: bindingMode.oneTime }) public style: string = '';

  @bindable({ defaultBindingMode: bindingMode.twoWay }) public showMenu: Function;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public shownMenu: Function;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public hideMenu: Function;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public hiddenMenu: Function;


  @bindable({ defaultBindingMode: bindingMode.twoWay }) public themeType: ThemeType = 'light';
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public colors: IBootstrapColor;


  constructor(private element: Element) {
  }

  private async attached() {
    // @ts-ignore
    $(this.metismenu).metisMenu()
      .on('show.metismenu', (event: any) => {
        console.log(`show menu: ${JSON.stringify(event)}`);

        console.log(this.showMenu);
        let localEvent = this.showMenu;

        if (localEvent !== null || localEvent !== undefined) {
          Promise.resolve(() => {
            localEvent(event);
          });
        }

      })
      .on('shown.metismenu', (event: any) => {

        /** auto scroll */

        // var navbarHeight = $('.navbar').height();

        // $('body,html').animate({
        //     scrollTop: $(event.target).parent('li').position().top - navbarHeight
        //   }, 600);
        /***************************************************************************** */

        console.log(`shown menu: ${JSON.stringify(event)}`);

        let localEvent = this.shownMenu;

        if (localEvent !== null || localEvent !== undefined) {
          Promise.resolve(() => {
            localEvent(event);
          });
        }

      })
      .on('hide.metismenu', (event: any) => {

        console.log(`hide menu: ${JSON.stringify(event)}`);

        let localEvent = this.hideMenu;

        if (localEvent !== null || localEvent !== undefined) {
          Promise.resolve(() => {
            localEvent(event);
          });
        }

      })
      .on('hidden.metismenu', (event: any) => {

        console.log(`menu hidden: ${JSON.stringify(event)}`);

        let localEvent = this.hiddenMenu;

        if (localEvent !== null || localEvent !== undefined) {
          Promise.resolve(() => {
            localEvent(event);
          });
        }

      });

    return true;
  }

  private colorsChanged(colors: IBootstrapColor) {

    console.log('color changed, going to inject dom');

    DOM.injectStyles(
      ` .aut-mm-item-active{
            color: ${this.themeType === 'light' ? 'cyan' : 'red'} !important;
            background: ${colors.primary} !important;
          }

          .sidebar-nav .metismenu {
            color: ${this.themeType === 'light' ? 'red' : 'cyan'} !important;
            background: ${colors.info} !important;
          }

          .sidebar-nav ul
          {
            background: ${colors.dark} !important;
          }
          .sidebar-nav .metismenu a:not(.aut-mm-link-group):hover,
          .sidebar-nav .metismenu a:not(.aut-mm-link-group):focus,
          .sidebar-nav .metismenu a:not(.aut-mm-link-group):active {
            text-decoration: none;
            color: ${this.themeType === 'light' ? 'cyan' : 'red'} !important;
              background: ${colors.primary} !important;
            }
          `);
    console.log('******** DOM INJECTED **********');
  }

  private detached() {
    // dispose to avoid memory leak
    // @ts-ignore
    $(this.metismenu).metisMenu('dispose');
  }

}
