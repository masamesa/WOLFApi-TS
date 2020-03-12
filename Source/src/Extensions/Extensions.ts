import{User, ExtendedUser, Group, Message, IHistoricalMessage} from '../Models/Models'
import * as fs from 'fs'//'web-fs'//'fs'//'fs-web'

export class Extensions {
    
    //I stole these from Alec's palringoapi-ts.
    //https://github.com/calico-crusade/palringoapi-ts/blob/75fd0626566d4c3db0cbb60d40b5192e815f1fec/library/src/Utilities/PalUtils.ts
    static toPalTime(date: Date){
        return date.getTime() * 1e3
    }    

    static fromPalTime(data: number) {
        return new Date(data / 1e3);
    }
    
    static IdArray(data: (User | ExtendedUser | Group)[]) {
        var ids: number[] = [];
        for (let item of data) {
            ids.push(item.id);
        }
        return ids;
    }


    static fromHistoricalMessage(msg: IHistoricalMessage) : Message {
        var m = new Message();

        m.data = msg.data;
        m.id = msg.id;
        m.isGroup = msg.isGroup;
        m.isHtml = msg.mimeType == 'text/html';
        m.isImage = msg.mimeType == ('text/image_link' || 'image/jpeg');
        m.isText = msg.mimeType == 'text/plain';
        m.isVoice = msg.mimeType == ('audio/x-speex' || 'text/voice_link');
        m.mimeType = msg.mimeType;
    
        if (typeof msg.originator === 'number'){
            m.originator = msg.originator;
        } else {
            m.originator = msg.originator.id;
        }

        if (typeof msg.recipient === 'number'){
            m.recipient = msg.recipient;
        } else {
            m.recipient = msg.recipient.id;
        }
        
        let uArray = new Uint8Array(msg.data);
        m.text = new TextDecoder().decode(uArray);
        m.timestamp = Extensions.fromPalTime(msg.timestamp);

        return m;
    }

    static fromHistory(msgs: IHistoricalMessage[]) : Message[] {
        var out = [];

        for(var i = 0; i < msgs.length; i++){
            out.push(Extensions.fromHistoricalMessage(msgs[i]));
        }

        return out;
    }
}