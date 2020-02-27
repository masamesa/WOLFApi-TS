import {Client} from '../Network/Client';
import {Packets} from '../Network/Packets';
import {ExtendedMessage } from '../Modules/Modules';
import * as jimp from 'jimp';

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

    async groupMessage(groupID: number, data: string, isImage?: boolean, completed?: (data: any) => void){
        if(isImage){
            this.client.writePacket(this.packet.messagePacket(groupID, true, await this.toBuffer(data), 'image/jpeg'), false, false, data =>{
                if(completed)
                    completed(data);
                    return;
            });
        }
        else{
        this.client.writePacket(this.packet.messagePacket(groupID, true, data, 'text/plain'), false, false, data =>{
            if(completed)
                completed(data);
                return;
        });
        }
    }

    async privateMessage(userID: number, data: string, isImage?: boolean, completed?: (data: any) => void){
        if(isImage){
            this.client.writePacket(this.packet.messagePacket(userID, false, await this.toBuffer(data), 'image/jpeg'), false, false, data =>{
                if(completed)
                    completed(data);
                    return;
            });
        }
        else{
        this.client.writePacket(this.packet.messagePacket(userID, false, data, 'text/plain'), false, false, data =>{
            if(completed)
                completed(data);
                return;
        });
        }
    }

    async reply(msg: ExtendedMessage, data: string, isImage?: boolean, completed?: (data: any) => void){
        if(isImage){
            this.client.writePacket(this.packet.messagePacket(msg.isGroup == false ? msg.originator : msg.group.id, msg.isGroup,
                                                            await this.toBuffer(data), 'image/jpeg'), false, false, data =>{
                                                                if(completed)
                                                                    completed(data);
                                                                    return;
                                                            });
        }
        else{
        this.client.writePacket(this.packet.messagePacket(msg.isGroup == false ? msg.originator : msg.group.id, msg.isGroup,
                                                        data, 'text/plain'), false, false, data =>{
                                                            if(completed)
                                                                completed(data);
                                                                return;
                                                        });
        }
    }

}