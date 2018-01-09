import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM, bindable, inject, singleton } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { IBootstrapColor } from '../../src/components/jquery/metis-menu/IBootstrapColors';

class Theme {
  public name: string;
  public path: string;
  public type: ThemeType;
}

type ThemeType = 'light' | 'dark';

@inject(HttpClient)
@singleton()
class BootstrapColor {

  constructor(private http: HttpClient) { }

  public getColors(text: string): IBootstrapColor {
    let key = ':root';
    let startIndex = text.indexOf(key) + key.length;
    let endIndex = text.indexOf('}', startIndex);
    let rule = text.slice(startIndex, endIndex).toString();
    let lines = rule.split('\n');
    if (lines.length === 1) {
      lines = rule.split(';');
      for (let index = 0; index < lines.length; index++) {
        lines[index] += ';';
      }
    }
    let colors = new Array();
    for (let index = 0; index < lines.length; index++) {
      let isColor = lines[index].indexOf('#') !== -1;
      if (isColor) {
        let str = lines[index].replace(/--/g, '"');
        str = str.replace(/:\s*#/g, '":"#');
        str = str.replace(/;/g, '"');
        str = str.replace(/{/g, '');
        str = str.replace(/}/g, '');
        str = str.replace(/gray-dark/g, 'grayDark');
        str = str.trim();
        colors.push(str);
      }
    }
    rule = colors.join(',');
    rule = '{' + rule + '}';
    let obj = <IBootstrapColor>JSON.parse(rule);
    if (Object.keys(obj).length > 0) {
      obj.muted = obj.gray;
    }
    return obj;
  }

  public async getColorsByPath(path: string): Promise<IBootstrapColor> {
    let result: IBootstrapColor;
    if (path && path.length > 0) {
      await this.http.get(path)
        .then((data) => {
          // console.log(data.response);
          result = this.getColors(data.response);
          return result;
        });
    }
    return result;
  }
}


@inject(BootstrapColor, EventAggregator)
export class App {

  public router: Router;

  private themes: Array<Theme>;
  @bindable() private selectedTheme: Theme;

  private selectedColors: IBootstrapColor;

  constructor(private bsColors: BootstrapColor, private ea: EventAggregator) {

    this.themes = [
      { name: 'cerulean', path: '/bootswatch/cerulean', type: 'light' },
      { name: 'cosmo', path: '/bootswatch/cosmo', type: 'light' },
      { name: 'cyborg', path: '/bootswatch/cyborg', type: 'dark' },
      { name: 'darkly', path: '/bootswatch/darkly', type: 'dark' },
      { name: 'default', path: '/bootswatch/default', type: 'light' },
      { name: 'litera', path: '/bootswatch/litera', type: 'light' },
      { name: 'lumen', path: '/bootswatch/lumen', type: 'light' },
      { name: 'lux', path: '/bootswatch/lux', type: 'light' },
      { name: 'minty', path: '/bootswatch/minty', type: 'light' },
      { name: 'sandstone', path: '/bootswatch/sandstone', type: 'light' },
      { name: 'simplex', path: '/bootswatch/simplex', type: 'light' },
      { name: 'sketchy', path: '/bootswatch/sketchy', type: 'light' },
      { name: 'slate', path: '/bootswatch/slate', type: 'dark' },
      { name: 'solar', path: '/bootswatch/solar', type: 'dark' },
      { name: 'spacelab', path: '/bootswatch/spacelab', type: 'light' },
      { name: 'superhero', path: '/bootswatch/superhero', type: 'dark' },
      { name: 'united', path: '/bootswatch/united', type: 'light' },
      { name: 'yeti', path: '/bootswatch/yeti', type: 'light' }
    ];
  }


  public configureRouter(config: RouterConfiguration, router: Router) {

    config.map([
      {
        route: ['bootstrap'],
        name: 'bootstrap',
        moduleId: PLATFORM.moduleName('./routes/bootstrap-route'),
        nav: true,
        title: 'Bootstrap',
        settings: { auth: false }
      },
      {
        route: ['purejs'],
        name: 'purejs',
        moduleId: PLATFORM.moduleName('./routes/purejs-route'),
        nav: true,
        title: 'JS',
        settings: { auth: false }
      },
      {
        route: ['jquery'],
        name: 'jquery',
        moduleId: PLATFORM.moduleName('./routes/jquery-route'),
        nav: true,
        title: 'jQuery',
        settings: { auth: false }
      }
    ]);
    this.router = router;
  }

  private async  selectedThemeChanged(newValue: Theme) {
    localStorage.setItem('selectedTheme', JSON.stringify(newValue));
    let colors = await this.bsColors.getColorsByPath(`${newValue.path}.min.css`);
    this.selectedColors = colors;
    this.ea.publish('theme-changed', { bsColors: this.selectedColors, theme: this.selectedTheme.type });
  }

}
