import { RuntimeError, RuntimeErrorCode } from './error_code';
import { stringifyForError } from './util/stringify_utils';

export function throwProviderNotFoundError(token: any, injectorName?: string): never {
    const injectorDetails = injectorName ? ` in ${injectorName}` : '';
    throw new RuntimeError(
        RuntimeErrorCode.PROVIDER_NOT_FOUND,
        `No provider for ${stringifyForError(token)} found${injectorDetails}`);
}
