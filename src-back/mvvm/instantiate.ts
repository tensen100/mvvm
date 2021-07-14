// import { updateDomProperties } from './update-dom-properties';
// import { createPublicInstance } from './create-public-instance';
//
// const TEXT_ELEMENT = 'TEXT_ELEMENT';
//
// export const instantiate = (element) => {
//     const { type, props = {} } = element;
//     const isDomElement = typeof type === 'string';
//     const isClassElement = !!(type.prototype && type.prototype.isReactComponent);
//     if (isDomElement) {
//         const isTextElement = type === TEXT_ELEMENT;
//         const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
//
//         updateDomProperties(dom, [], element.props);
//
//         const children = props.children || [];
//         const childInstances = children.map(instantiate);
//         const childDoms = childInstances.map(childInstance => childInstance.dom);
//         childDoms.forEach(chilDom => dom.appendChild(chilDom));
//         return { element, dom, childInstances };
//     } else if (isClassElement) {
//         const instance = {};
//         const publicInstance = createPublicInstance(element, instance);
//         const childElement = publicInstance.render();
//         const childInstance = instantiate(childElement);
//         Object.assign(instance, { dom: childInstance.dom, element, childInstance, publicInstance });
//         return instance;
//     } else {
//         const childElement = type(element.props);
//         const childInstance = instantiate(childElement);
//         return {
//             dom: childInstance.dom,
//             element,
//             childInstance,
//             fn: type
//         };
//     }
// }
