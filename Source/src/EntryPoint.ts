import { WolfClient } from './WOLFClient'
import { iPluginOptions, PluginInstance } from './Extensions'

export function WolfBot(url?: string): WolfClient{
    return new WolfClient(url);
}

export function Plugin(command: string, options?: iPluginOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Object.getOwnPropertyNames(target).filter(function (p) {
            if (typeof target[p] === 'function')
                if(descriptor.value == target[p])
                    PluginInstance.register(command.toLowerCase(), options, target[p]);
        });
    }
}