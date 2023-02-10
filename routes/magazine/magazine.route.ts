import {RoutePath, RoutePathSetting, RouteSetting} from '../RouteSetting';

interface MagazineDetailProps {
  id: number;
}

export class MagazineDetailParams implements MagazineDetailProps {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

export class MagazineDetailRouteSetting extends RoutePathSetting<MagazineDetailProps> {
  protected _path: RoutePath = RoutePath.magazine;
  shouldBeAuth = false;
}

export class MagazinesScreenRouteSettings extends RouteSetting{
  protected _path: RoutePath = RoutePath.magazines;
  shouldBeAuth = false;
}