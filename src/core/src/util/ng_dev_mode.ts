import { global } from './global';

declare global{
    const ngDevMode: null | NgDevModePerfCounters;
    interface NgDevModePerfCounters {
        namedConstructors: boolean;
        firstCreatePass: number;
        tNode: number;
        tView: number;
        rendererCreateTextNode: number;
        rendererSetText: number;
        rendererCreateElement: number;
        rendererAddEventListener: number;
        rendererSetAttribute: number;
        rendererRemoveAttribute: number;
        rendererSetProperty: number;
        rendererSetClassName: number;
        rendererAddClass: number;
        rendererRemoveClass: number;
        rendererSetStyle: number;
        rendererRemoveStyle: number;
        rendererDestroy: number;
        rendererDestroyNode: number;
        rendererMoveNode: number;
        rendererRemoveNode: number;
        rendererAppendChild: number;
        rendererInsertBefore: number;
        rendererCreateComment: number;
    }
}
