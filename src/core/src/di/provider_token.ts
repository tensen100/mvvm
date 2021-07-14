import { AbstractType, Type } from '../interface/type';
import { InjectionToken } from './injection_token';

export type ProviderToken<T> = Type<T>|AbstractType<T>|InjectionToken<T>;
