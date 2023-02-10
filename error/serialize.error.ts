
import HandledError from "./error";
import { SerializeErrorCode } from "./error.constant";

export default class SerializeError extends HandledError {

    constructor({ error, stack }: { error: Error, stack: string }) {
        super({
            error,
            stack,
            name: 'serialize_error',
            code: SerializeErrorCode.SERIALIZE_ERROR,
            message: error.message,
        });

    }

}