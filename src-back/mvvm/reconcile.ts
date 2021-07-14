// import { instantiate } from './instantiate';
// import { updateDomProperties } from './update-dom-properties';
//
// export function reconcile(parentDom, instance, element) {
//     if (instance === null) {
//         const newInstance = instantiate(element);
//
//         newInstance?.publicInstance?.componentWillMount?.();
//         parentDom.appendChild(newInstance.dom);
//
//         newInstance?.publicInstance?.componentDidMount?.();
//
//         return newInstance;
//     } else if (element === null) {
//         instance?.publicInstance?.componentWillUnmount?.();
//         parentDom.removeChild(instance.dom);
//         return null;
//     } else if (instance.element.type !== element.type) {
//         const newInstance = instantiate(element);
//         newInstance?.publicInstance?.componentDidMount?.();
//         parentDom.replaceChild(newInstance.dom, instance.dom);
//         return newInstance;
//     }else if(typeof element.type === 'string') {
//         updateDomProperties(instance.dom, instance.element.props, element.props);
//
//         instance.childInstances = reconcileChildren(instance, element);
//
//         instance.element = element;
//
//         return instance;
//     } else {
//         if (!instance?.publicInstance?.shouldcomponentUpdate?.()) {
//             return;
//         }
//         instance?.publicInstance?.componentWillUpdate?.();
//         const newChildElement = instance.publicInstance.render();
//         const oldChildInstance = instance.childInstance;
//         const newChildInstance = reconcile(parentDom, oldChildInstance, newChildElement);
//         instance?.publicInstance?.componentDidUpdate?.();
//         instance.dom = newChildInstance.dom;
//         instance.childInstance = newChildInstance;
//         instance.element = element;
//         return instance;
//     }
// }
//
// function reconcileChildren(instance, element) {
//     const { dom, childInstances } = instance;
//     const newChildElements = element.props.children || [];
//     const count = Math.max(childInstances.length, newChildElements.length);
//     const newChildInstances = [];
//     for (let i = 0; i < count; i++) {
//         newChildInstances[i] = reconcile(dom, childInstances[i], newChildElements[i]);
//     }
//     return newChildInstances.filter(instance => instance !== null);
// }
