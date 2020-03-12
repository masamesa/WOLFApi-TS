import {Client} from '../Network/Client';
import {Packets} from '../Network/Packets';
import { StageInfo } from '../Models';
import { FakeMediaStreamTrack } from 'fake-mediastreamtrack';
//import adapter from 'webrtc-adapter';



export class Stages{
    public packet = new Packets();
    
    constructor(private client: Client){
    }

    async requestAudioSlots(groupID: number, subscribe?: boolean, callback?: (callback: StageInfo[]) => void){
        this.client.writePacket(this.packet.requestAudioSlots(groupID, subscribe), false, false, (resp: StageInfo[]) => {
            if(callback)
                callback(resp)
        });
    }

    async slotUpdate(groupID: number, slot: StageInfo, callback?: (callback) => void){
        this.client.writePacket(this.packet.slotUpdate(groupID, slot), true, true, (resp) => {
            if(callback)
                callback(resp)
        });
    }
    //experimental, not implimented
    /*async broadcastTrack(groupID: number, slotID: number, sdp){
        var r = new RTCPeerConnection();
        const track = new FakeMediaStreamTrack({
            kind: 'audio'
        });
        r.addTrack(track);
        Promise.resolve(r.createOffer({
            offerToReceiveAudio: !1,
            offerToReceiveVideo: !1
        })).then(async function(e){
            var t = e.sdp.replace('a=sendrecv', 'a=sendonly');
            return r.setLocalDescription(e),
            Promise.resolve(await this.client.writePacket(this.pack.broadcast(groupID, slotID, t))).then(function(e){
                var t = e.sdp,
                    o = e.slot;
                    return r.uuid = o.uuid,
                
            });
        })
  
    }  */
}