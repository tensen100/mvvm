import 'reflect-metadata';

const startsWithKey = '__startswith';

function StartsWith(prefix: string): ParameterDecorator {
    return function (target: any, propertyKey: string, paramsIndex: number) {
        const startsWithConstraints = Reflect.getOwnMetadata(
            startsWithKey,
            target,
            propertyKey
        ) || {} as Record<number, string>;
        startsWithConstraints[paramsIndex] = prefix;

        Reflect.defineMetadata(
            startsWithKey,
            startsWithConstraints,
            target,
            propertyKey
        );
    }
}

function checkParam(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const method = descriptor.value;
    // 对greet方法进行改写，先进行参数校验
    descriptor.value = function () {
        // 获得startsWith装饰器收集到的[[参数次序:开头字符]]映射
        const startsWithConstraints = Reflect.getOwnMetadata(
            startsWithKey,
            target,
            propertyKey
        ) || {};

        // 对定义了startsWith装饰器的参数进行校验
        Array.from(arguments).forEach((arg: string, index: number) => {
            const prefix = startsWithConstraints[index];
            if (prefix && !arg.startsWith(prefix)) {
                throw new Error(`argument ${index} must start with ${prefix}`);
            }
        })

        return method.apply(this, arguments);
    };
}


const providerMap = new WeakMap();

function Injectable(): ClassDecorator {
    return function (target: any) {
        providerMap.set(target, null);
    }
}


function Component(): ClassDecorator {
    return function (target: any) {
    }
}

@Injectable()
class FlowerService {
    strew() {
        console.log('strew flower')
    }
}


@Component()
export class Greeter {

    constructor(private readonly flower: FlowerService) {

    }

    @checkParam
    greet(@StartsWith('t') name: string): void {
        console.log(`welcome, ${name}!`);
        this.flower.strew();
    }
}

export function Factory(target: any) {
    // 获取所有注入的服务
    const providers = Reflect.getOwnMetadata("design:paramtypes", target) || [];
    const deps = providers.map((type: any): any => {
        const instance = providerMap.get(type);
        if (instance == null) {
            providerMap.set(type, Factory(type));
        }
        return providerMap.get(type);
    })
    return new target(...deps)
}
