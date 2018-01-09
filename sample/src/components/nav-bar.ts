import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
// declare var $: any;

@inject(Router, EventAggregator)
export class NavBar {
  public router: Router;

  private color;
  private themeType;

  constructor(router: Router, ea: EventAggregator) {
    this.router = router;

    ea.subscribe('theme-changed', x => {
      console.warn(x);
      this.color = x.bsColors;
      this.themeType = x.theme;

    });

  }

  public attached() {
    // todo
  }
  private showMenu() {
    alert('hi');
  }

}
