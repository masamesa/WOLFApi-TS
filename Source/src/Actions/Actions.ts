import {Client} from '../Network/Client';
import {Packets} from '../Network/Packets'
import {AdminActionTypes, Role, GroupType} from '../Types/Types'
import {adminActionResult, groupActionResult, ExtendedGroup, GroupMember} from '../Modules/Modules'

export class Actions{
    public Packet = new Packets();
    public adminActionResult = new adminActionResult();
    public groupActionResult = new groupActionResult();
    private grp: ExtendedGroup;

    constructor(private client: Client){
    }

    async failReasonAdminAction(client: Client, group: ExtendedGroup, target: Number){
        var cachedTarget: GroupMember;

        this.adminActionResult = new adminActionResult();

        await client.info.groupMemberList(group.id, (resp) => {         
            for(var i = 0; i < resp.length; i++){
                if(resp[i].id == target)
                    cachedTarget = resp[i];

                if(cachedTarget != undefined){
                    if(cachedTarget.id == Role.Admin && !group.advancedAdmin)
                        return this.adminActionResult.fullAdminNotEnabled = true;
                    
                    if(i == resp.length && resp[i].id != target)
                        return this.adminActionResult.userNoLongerInGroup = true;

                    if(resp[i].id != client.info.ClientProfile.id)
                        return this.adminActionResult.botNolongerInGroup = true;

                    if(resp[i].id == client.info.ClientProfile.id){

                        if(resp[i].capabilities == Role.Mod && cachedTarget.capabilities == (Role.Admin | Role.Mod | Role.Owner))
                            return this.adminActionResult.insufficientPower = true;
                        
                        if(resp[i].capabilities != (Role.Owner | Role.Admin | Role.Mod))
                            return this.adminActionResult.noPower = true;
                    }
                    
                    if(i == resp.length)
                        return this.adminActionResult.unknownReason = true;
                }
            }});
    }

    async failReasonGroupAction(client: Client, group: ExtendedGroup){
        
        this.groupActionResult = new groupActionResult();
        await client.info.requestGroups().then((grp: ExtendedGroup[]) => {
            for(var i = 0; i < grp.length; i++)
            {
                if(i == grp.length && grp[i].id != group.id)
                    return this.groupActionResult.groupNotfound = true;
            }
        });
    }

    async getExtendedGroup(groupType: GroupType, groupName?: string, groupID?: number): Promise<ExtendedGroup>{
        return new Promise(async (resolve, reject) =>{
                if(this.grp != undefined)
                    this.grp = undefined;

                if(groupType == GroupType.name){
                var tempGroup: ExtendedGroup = await this.client.info.requestGroup(groupName);

                if(tempGroup == undefined){
                    this.groupActionResult.groupNotfound = true;
                    return resolve(tempGroup);
                }
                
                return resolve(tempGroup);
                }
            
                else if(groupType == GroupType.id){
                    await this.client.info.requestGroup(groupID, (resp: ExtendedGroup) => {return resolve(resp)});
            }
        });
    }
    
    async banUser(group: number, userID: number, callback?: (reason: adminActionResult) => void){
        await this.getExtendedGroup(GroupType.id, null, group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Ban), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.adminActionResult);
                }
            }
            else{
                this.adminActionResult.sucess = true;
                if(callback)
                    callback(this.adminActionResult)
            }    
        });
    }

    async kickUser(group: number, userID: number, callback?: (reason: adminActionResult) => void){
        await this.getExtendedGroup(GroupType.id, null, group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Kick), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.adminActionResult);
                }
            }
            else{
                this.adminActionResult.sucess = true;
                if(callback)
                    callback(this.adminActionResult)
            }    
        });
    }

    async silenceUser(group: number, userID: number, callback?: (reason: adminActionResult) => void){
        await this.getExtendedGroup(GroupType.id, null, group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Silence), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.adminActionResult);
                }
            }
            else{
                this.adminActionResult.sucess = true;
                if(callback)
                    callback(this.adminActionResult)
            }    
        });
    }

    async resetUser(group: number, userID: number, callback?: (reason: adminActionResult) => void){
        await this.getExtendedGroup(GroupType.id, null, group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Reset), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.adminActionResult);
                }
            }
            else{
                this.adminActionResult.sucess = true;
                if(callback)
                    callback(this.adminActionResult)
            }    
        });
    }

    async modUser(group: number, userID: number, callback?: (reason: adminActionResult) => void){
        await this.getExtendedGroup(GroupType.id, null, group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Mod), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.adminActionResult);
                }
            }
            else{
                this.adminActionResult.sucess = true;
                if(callback)
                    callback(this.adminActionResult)
            }    
        });
    }

    async adminUser(group: number, userID: number, callback?: (reason: adminActionResult) => void){
        await this.getExtendedGroup(GroupType.id, null, group);
        this.client.writePacket(this.Packet.adminAction(group, userID, AdminActionTypes.Admin), false, false, async (data: { code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonAdminAction(this.client, this.grp, userID)
                    callback(this.adminActionResult);
                }
            }
            else{
                this.adminActionResult.sucess = true;
                if(callback)
                    callback(this.adminActionResult)
            }    
        });
    }

    async joinGroup(groupName: string, password?: string, callback?: (reason: groupActionResult) => void){
        await this.getExtendedGroup(GroupType.name, groupName, null).then((val: ExtendedGroup) =>{ this.grp = val;});
        await this.client.writePacket(this.Packet.groupJoin(groupName, password), false, false, async (data: {code: number, body: any}) =>{
            
            if(data.code != 200){
                if(callback)
                {
                    switch(data.code){
                        case 4: return this.groupActionResult.higherlevel = true;
                        case 100: return this.groupActionResult.groupisfull = true;
                        case 101: return this.groupActionResult.hitgrouplimit = true;
                        case 105: return this.groupActionResult.nolongerexists = true;
                        case 107: return this.groupActionResult.banned = true;
                        case 112: return this.groupActionResult.restritedtonewusers = true;
                        case 115: return this.groupActionResult.groupisclosed = true;
                        case 116: return this.groupActionResult.toomanyacounts = true;
                        case 117: return this.groupActionResult.groupcanonlybejoinedfromgame = true;
                        case 110: return this.groupActionResult.alreadyInGroup = true;
                        default: return this.groupActionResult.unknownerror = true;
                    }
                    callback(this.groupActionResult);
                }
            }
            else{
                this.groupActionResult.sucess = true;
                if(callback)
                    callback(this.groupActionResult)
            }    
        });
    }

    async leaveGroup(groupID: number, callback?: (reason: groupActionResult) => void){
        await this.client.info.requestGroups((resp) => {
            for(var i = 0; i < resp.length; i++)
                if(resp[i].id == groupID)
                    this.grp = resp[i];
            });
        
        this.client.writePacket(this.Packet.groupLeave(groupID), false, false, async (data: {code: number, body: any}) =>{
            if(data.code != 200){
                if(callback)
                {
                    await this.failReasonGroupAction(this.client, this.grp)
                    callback(this.groupActionResult);
                }
            }
            else{
                this.groupActionResult.sucess = true;
                if(callback)
                    callback(this.groupActionResult)
            }    
        });
    }
}