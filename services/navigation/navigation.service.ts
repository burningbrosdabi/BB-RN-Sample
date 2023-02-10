import {
    NavigationContainerRef,
    NavigationState,
    PartialRoute,
    PartialState,
    Route,
    StackActions,
} from '@react-navigation/native';
import { ButtonType } from 'components/button/Button';
import { HandledError } from 'error';
import { createContext, useContext } from 'react';
import { AuthRouteSetting, RouteSetting } from 'routes';
import { BehaviorSubject } from 'rxjs';
import { linkService } from 'services/link/link.service';
import { Logger } from 'services/log';
import { Colors } from 'styles';
import { store } from 'utils/state';
import { showDialog } from 'utils/state/action-creators';

type RouteSubscriber = (route: string) => void;

export default class NavigationService {
    private static _instance: NavigationService;
    private _container?: NavigationContainerRef;
    private _stackNavigatorMounted = false;
    private _currentTab = 'Home';
    private _routeObservable = new BehaviorSubject<string>('');

    #currentRoutes?: PartialRoute<Route<string, object | undefined>>;

    get initialized(): boolean {
        return !!this._container && this._stackNavigatorMounted;
    }

    get currentTab(): string {
        return this._currentTab;
    }

    static get instance(): NavigationService {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;
    }

    onReady() {
        this._stackNavigatorMounted = true;
        linkService().addRouteListener((route: RouteSetting<any> | null) => {
            if (!this.initialized || !route) return;
            this.navigate(route);
        });
    }

    set container(container: NavigationContainerRef) {
        this._container = container;
    }

    private constructor() {
    }

    onStateChange(navState?: NavigationState) {
        if (!navState) return;
        try {
            const getCurrentRoute = (
                navigationState: NavigationState | PartialState<NavigationState>,
            ): PartialRoute<Route<string, object | undefined>> | undefined => {
                if (!navigationState) return undefined;
                const route = navigationState.routes[navigationState.index!];
                if (route.state?.routes) return getCurrentRoute(route.state);

                return route as PartialRoute<Route<string, object | undefined>>;
            };
            const route = getCurrentRoute(navState);
            NavigationService.instance.onRouteChange(route);
        } catch (error) {
            const exception = new HandledError({
                error: error as Error,
                stack: 'NavigationService.onStateChange',
            });
            exception.log(true);
        }
    }

    addOnRouteListener(onNext: RouteSubscriber): () => void {
        const subscription = this._routeObservable?.subscribe(onNext);
        if (subscription) {
            return () => subscription.closed && subscription.unsubscribe();
        }
        return () => {
        };
    }

    onRouteChange(nextRoute?: PartialRoute<Route<string, object | undefined>>) {
        if (nextRoute?.key === this.#currentRoutes || !nextRoute) return;

        Logger.instance.logNavigation({
            from: this.#currentRoutes?.name ?? '',
            to: nextRoute.name,
            params: nextRoute.params,
        });

        this._currentTab = nextRoute.name;
        this.#currentRoutes = nextRoute;
        this._routeObservable.next(nextRoute?.name);
    }

    goBack() {
        if (!this.initialized) return;
        const backAction = StackActions.pop();
        this._container!.dispatch(backAction);
    }

    backToRoot(key?: string) {
        if (!this.initialized) return;
        const action = StackActions.popToTop();
        this._container!.dispatch(action);
    }

    navigate<T extends object>(routeSetting: RouteSetting<T>, replace?: boolean) {
        if (!this.initialized) return;
        if (routeSetting.shouldBeAuth && !store.getState().auth.isLoggedIn) {
            store.dispatch(
                showDialog({
                    title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',

                    actions: [
                        {
                            type: ButtonType.primary,
                            text: 'Đăng nhập',
                            onPress: () => {
                                this.navigate(new AuthRouteSetting());
                            },
                        },
                        {
                            text: 'Bỏ qua',
                            type: ButtonType.flat,
                            onPress: () => {
                            },
                            textStyle: { color: Colors.primary },
                        },
                    ],
                }),
            );

            return;
        }
        let navigateAction;
        if (!routeSetting.guard()) return;
        if (replace) {
            navigateAction = StackActions.replace(routeSetting.path, routeSetting.params);
        } else {
            navigateAction = StackActions.push(routeSetting.path, routeSetting.params);
        }
        this._container!.dispatch(navigateAction);
    }
}

export const NavigationServiceContext = createContext<NavigationService>(
    NavigationService.instance,
);

export const useNavigator = (): NavigationService => {
    return useContext(NavigationServiceContext);
};
