import { R3DependencyMetadataFacade } from '../../compiler/compiler_facade_interface';
import { Host, Inject, Optional, Self, SkipSelf } from '../metadata';
import { Attribute } from '../metadata_attr';

export function convertDependencies(deps: any[]): R3DependencyMetadataFacade[] {
    return deps.map(dep => reflectDependency(dep));
}

function reflectDependency(dep: any|any[]): R3DependencyMetadataFacade {
    const meta: R3DependencyMetadataFacade = {
        token: null,
        attribute: null,
        host: false,
        optional: false,
        self: false,
        skipSelf: false,
    };

    if (Array.isArray(dep) && dep.length > 0) {
        for (let j = 0; j < dep.length; j++) {
            const param = dep[j];
            if (param === undefined) {
                // param may be undefined if type of dep is not set by ngtsc
                continue;
            }

            const proto = Object.getPrototypeOf(param);

            if (param instanceof Optional || proto.ngMetadataName === 'Optional') {
                meta.optional = true;
            } else if (param instanceof SkipSelf || proto.ngMetadataName === 'SkipSelf') {
                meta.skipSelf = true;
            } else if (param instanceof Self || proto.ngMetadataName === 'Self') {
                meta.self = true;
            } else if (param instanceof Host || proto.ngMetadataName === 'Host') {
                meta.host = true;
            } else if (param instanceof Inject) {
                meta.token = param.token;
            } else if (param instanceof Attribute) {
                if (param.attributeName === undefined) {
                    throw new Error(`Attribute name must be defined.`);
                }
                meta.attribute = param.attributeName;
            } else {
                meta.token = param;
            }
        }
    } else if (dep === undefined || (Array.isArray(dep) && dep.length === 0)) {
        meta.token = null;
    } else {
        meta.token = dep;
    }
    return meta;
}
