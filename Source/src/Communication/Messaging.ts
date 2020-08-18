import {Client} from '../Network/Client';
import {Packets} from '../Network/Packets';
import {ExtendedMessage, ExtendedGroup, Message, ExtendedUser, IMessage } from '../Models/Models';
import * as jimp from 'jimp';
import { PluginInstance } from '../Extensions';
import { brotliDecompressSync } from 'zlib';
import { runInThisContext } from 'vm';
import { promises } from 'fs';
export class Messaging{
    public packet = new Packets();

    constructor(private client: Client){
    }

    async toBuffer(Message: string){
        var imagebuffer:Buffer;
        await jimp.read(Message).then(async image => {
                await image.getBufferAsync(jimp.MIME_JPEG).then(result =>{
                    return imagebuffer = result;
            }).catch(ex => this.client.On.Trigger('log', 'BufferEx:\r\n' + ex));
        }).catch(ex => this.client.On.Trigger('log', 'ReadEx:\r\n' + ex));
        return imagebuffer;
    }

    private async _checkMessage(message: Message): Promise<boolean>{
        let tempbool: boolean = false;
        return new Promise((resolve, reject) => {
            for (var plugin in PluginInstance.plugins.all()){
                if(message.text.startsWith(plugin, 1))
                    return tempbool = true;
            }
            
            return resolve(tempbool);
        });
        return;
    }

    async nextMessage(message: ExtendedMessage, callback?: (resp: ExtendedMessage) => void, anyNextMessage?: boolean): Promise<ExtendedMessage>{
        return new Promise((resolve, reject) =>{
            this.client.Connection.on('message send', async (data: { body: IMessage}) =>{
                if(data.body.originator != this.client.info.ClientProfile.subscriber.id && anyNextMessage ? true : message.originator == data.body.originator 
                    && await this._checkMessage(new Message(data.body)) == false){

                        let msg = new ExtendedMessage(data.body);
                        msg.userProfile = await this.client.info.requestUser(data.body.originator);

                        if(msg.isGroup)
                            msg.group = await this.client.info.requestGroup(msg.recipient);

                        if(callback)
                            return callback(msg);
                        return resolve(msg);
                }
            });
        });
        return;
    }

    async nextGroupMessage(groupID: number, callback?: (resp: ExtendedMessage) => void): Promise<ExtendedMessage>{
        return new Promise((resolve, reject) =>{
            this.client.Connection.on('message send', async (data: { body: IMessage}) =>{
                if(data.body.isGroup && data.body.originator != this.client.info.ClientProfile.subscriber.id && data.body.recipient == groupID
                    && await this._checkMessage(new Message(data.body)) == false){
                    let msg = new ExtendedMessage(data.body);

                    msg.userProfile = await this.client.info.requestUser(data.body.originator);

                    if(msg.isGroup)
                        msg.group = await this.client.info.requestGroup(msg.recipient);

                    if(callback)
                        return callback(msg);
                    return resolve(msg);
                }
            });
        });
        return;
    }

    async nextPrivateMessage(userID: number, callback?: (resp: ExtendedMessage) => void): Promise<ExtendedMessage>{
        return new Promise((resolve, reject) =>{
            this.client.Connection.on('message send', async (data: { body: IMessage}) =>{
                if(!data.body.isGroup && data.body.originator != this.client.info.ClientProfile.subscriber.id && data.body.recipient == userID
                    && await this._checkMessage(new Message(data.body)) == false){
                    let msg = new ExtendedMessage(data.body);
                    
                    msg.userProfile = await this.client.info.requestUser(data.body.originator);

                    if(callback)
                        return callback(msg);
                    return resolve(msg);
                }
            });
        });
        return;
    }

    async messages(callback?: (resp: ExtendedMessage) => void): Promise<ExtendedMessage>{
        return new Promise((resolve, reject) =>{
            this.client.Connection.on('message send', async (data: { body: IMessage}) =>{
                let msg = new ExtendedMessage(data.body);

                msg.userProfile = await this.client.info.requestUser(data.body.originator);

                if(msg.isGroup)
                    msg.group = await this.client.info.requestGroup(msg.recipient);

                if(callback)
                    return callback(msg);
                return resolve(msg);
            });
        });
        return;
    }

    async groupMessage(groupID: number, data: string, isImage?: boolean, flightId?: string,  completed?: (data: any) => void){
        if(isImage){
            this.client.writePacket(this.packet.messagePacket(groupID, true, await this.toBuffer(data), 'image/jpeg', flightId), false, false, data =>{
                if(completed)
                    completed(data);
                    return;
            });
        }
        else{
        this.client.writePacket(this.packet.messagePacket(groupID, true, data, 'text/plain', flightId), false, false, data =>{
            if(completed)
                completed(data);
                return;
        });
        }
    }

    async privateMessage(userID: number, data: string, isImage?: boolean, flightId?: string, completed?: (data: any) => void){
        if(isImage){
            this.client.writePacket(this.packet.messagePacket(userID, false, await this.toBuffer(data), 'image/jpeg', flightId), false, false, data =>{
                if(completed)
                    completed(data);
                    return;
            });
        }
        else{
        this.client.writePacket(this.packet.messagePacket(userID, false, data, 'text/plain', flightId), false, false, data =>{
            if(completed)
                completed(data);
                return;
        });
        }
    }

    async reply(msg: ExtendedMessage, data: string, isImage?: boolean, flightId?: string, completed?: (data: any) => void){
        if(isImage){
            this.client.writePacket(this.packet.messagePacket(msg.isGroup == false ? msg.originator : msg.group.id, msg.isGroup,
                                                            await this.toBuffer(data), 'image/jpeg', flightId), false, false, data =>{
                                                                if(completed)
                                                                    completed(data);
                                                                    return;
                                                            });
        }
        else{
        this.client.writePacket(this.packet.messagePacket(msg.isGroup == false ? msg.originator : msg.group.id, msg.isGroup,
                                                        data, 'text/plain', flightId), false, false, data =>{
                                                            if(completed)
                                                                completed(data);
                                                                return;
                                                        });
        }
    }

}