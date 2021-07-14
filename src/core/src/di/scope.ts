import { InjectionToken } from './injection_token';

export const INJECTOR_SCOPE = new InjectionToken<'root'|'platform'|null>('Set Injector scope.');
