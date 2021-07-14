// import { createTextElement } from './create-text-element';
//
// export const createElement = (type: any, props: any, ...children) => {
//     props = Object.assign({}, props);
//     props.children = [].concat(children)
//         .filter(child => child !== null && child !== false)
//         .map(child => child instanceof Object ? child ? child : createTextElement(child));
//     return { type, props }
// }
