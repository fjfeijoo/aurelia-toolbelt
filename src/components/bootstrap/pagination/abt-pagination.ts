import { customElement, inject, bindable, bindingMode, BindingEngine, containerless } from 'aurelia-framework';

@containerless()
@inject(Element)
@customElement('abt-pagination')
export class BootstrapPaginationCustomElement {

  @bindable({ defaultBindingMode: bindingMode.oneWay }) public totalPages: number = 1;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public selectedPage: number = 1;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public visiblePages: number = 1;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public hideOnlyOnePage: boolean = true;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public boundaryLinks: boolean = true;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public directionLinks: boolean = true;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public showGoto: boolean = true;

  // @bindable({ defaultBindingMode: bindingMode.oneWay }) public pageVariable: string;
  // @bindable({ defaultBindingMode: bindingMode.oneWay }) public totalPagesVariable: string;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public first: string = 'First';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public last: string = 'Last';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public prev: string = 'Previous';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public next: string = 'Next';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public loop: boolean = false;

  @bindable({ defaultBindingMode: bindingMode.oneWay }) public click: Function;


  private pagination: Element;
  private paginationItems: Element;
  private pages: string[] = [];

  private onClick(event: Event) {
    if (this.click) {
      this.click({ event: event });
      console.log(event.target);
    }
    return false;
  }

  private createVisibleItems(visibleItem: number, selectedItem: number, totalPages: number): string[] {
    let items: string[] = [];
    for (let index = 0; index < visibleItem; index++) {
      items[index] = 'a';
    }
    let leftSide = Math.ceil(visibleItem / 2);
    let rightSide = Math.floor(visibleItem / 2);

    if (selectedItem < leftSide) {
      items[selectedItem - 1] = selectedItem.toString();
    } else if (selectedItem > (totalPages - rightSide)) {
      items[(selectedItem - totalPages) + (items.length - 1)] = selectedItem.toString();
    } else {
      items[leftSide - 1] = selectedItem.toString();
    }

    let showLeftDots = this.showLeftDots(selectedItem);
    let showRightDots = this.showRightDots(selectedItem, totalPages);

    if (showLeftDots && this.showGoto) {
      items[0] = '1';
      items[1] = '2';
      items[2] = '...';
    }
    if (showRightDots && this.showGoto) {
      items[items.length - 3] = '...';
      items[items.length - 2] = (this.totalPages - 1).toString();
      items[items.length - 1] = this.totalPages.toString();
    }

    let isBefore: boolean = true;
    let currentItem = selectedItem;
    for (let index = 0; index < items.length; index++) {
      if (items[index] === selectedItem.toString()) {
        isBefore = false;
      }
      if (items[index] === 'a' && !isBefore) {
        currentItem += 1;
        items[index] = currentItem.toString();
      }
    }

    let isAfter: boolean = true;
    let currentItemReverse = selectedItem;
    for (let index = items.length; index--;) {
      if (items[index] === selectedItem.toString()) {
        isAfter = false;
      }
      if (items[index] === 'a' && !isAfter) {
        currentItemReverse -= 1;
        items[index] = currentItemReverse.toString();
      }
    }

    return items;
  }

  private showLeftDots(selectedItem: number): boolean {
    return selectedItem > 5;
  }
  private showRightDots(selectedItem: number, totalPages: number): boolean {
    return totalPages - 5 > selectedItem;
  }

  private afterAttached() {

    if (this.visiblePages <= 0) {
      throw Error('you are a stupid vicious programmer');
    }

    if (this.visiblePages > this.totalPages) {
      throw Error('you are a stupid vicious programmer');
    }


    this.pages = this.createVisibleItems(this.visiblePages, this.selectedPage, this.totalPages);


  }
}

