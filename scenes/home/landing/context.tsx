import {createContext} from "react";
import {Collection} from "model/collection";


export const CollectionLandingContext = createContext<{ collection?: Collection, setCollection: (value: Collection) => void }>({
    collection: undefined,
    setCollection: (_) => {/**/
    }
})