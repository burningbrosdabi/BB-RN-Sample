import {useNavigationState} from "@react-navigation/native";

export const useGetPreviousRoute = () => {
    const previous  = useNavigationState(state => {
        const routes = state.routes;
        if (routes.length >= 2) {
            return routes[routes.length - 2].name;
        }
        return undefined;
    });

    return previous;
}