import { Packet } from './../Network/Packet';
import { ExtendedUser, SelectedList, CGroup, StageInfo } from '../Models/Models';
import { AdminActionTypes, Language, Gender, RelationshipStatus, LookingFor, DeviceType, OnlineState } from '.././Types/Types';
import { isNull } from 'util';
import { Extensions } from '../Extensions';
import {Md5} from 'ts-md5'
import { truncateSync } from 'fs';

//List of all the current packet templates implimented into the API.
export class Packets{

    //#region client initlization

    logout(){
        return new Packet('security logout');
    }

    loginPacket(Username: string, Password: string, type: any, device: DeviceType){
        switch(type){
            case 'email':{
                return new Packet('security login', {
                    deviceTypeId: device,
                    type: 'email',
                    username: Username,
                    password: Md5.hashStr(Password),
                    md5Password: true
                },
                {
                    version: 2
                });
            }
        }
    }

    //soon to be deprecated, but keeping it in just in case anyone
    //has a use for it
    loginPacketv1(Email: string, Password: string){
        return new Packet('security login', {
            username: Email,
            password: Password
        });
    }

    subscribeToPM(){
        return new Packet('message private subscribe',{});
    }

    subscribeToGroups(id: number[]){
        return new Packet('message group subscribe',{
            idList: id
        });
    }

    //#endregion

    //#region group actions

    GroupList(){
        return new Packet('group list');
    }

    groupProfile(search: string | number, extended: boolean){
        return new Packet('group profile', {
            id: typeof search === 'number' ? search : null,
            name: typeof search === 'string' ? search : null,
            extended: extended
        }, {version: 3});
    }

    requestGroupStatistics(groupID: number){
        return new Packet('group stats',  {
            id: groupID
        });
    }

    createGroup(group: CGroup){
        return new Packet('group create', group);
    }

    updateGroupProfile(group: CGroup){
        return new Packet('group profile update', group);
    }

    adminAction(group: number, target: number, action: AdminActionTypes){
        return new Packet('group admin', {
            groupId: group,
            id: target,
            capabilities: action
        });
    }

    groupMemberList(id: number){
        return new Packet('group member list',
            { 
                id: id ,
                subscribe: true
            },
            { version: 2 });
    }

    groupJoin(groupName: string, password?: string){
        return new Packet('group join', {
            name: groupName,
            password: password
        });
    }

    groupLeave(groupID: number){
        return new Packet('group leave', {
            id: groupID
        });
    }
    
    //#endregion

    //#region user profile

    preseenceUpdate(state: OnlineState){
        new Packet(
            'subscriber settings update', 
            {
                state:{ 
                    state: state
                }
            }
        )
    }

    userProfile(userID: number, extendedProfile: boolean) {
        return new Packet('subscriber profile', {
            id: userID,
            extended: extendedProfile
        });
    }

    requestAchievements(language: Language = Language.english){
        return new Packet('achievement list', {language: language})
    }

    requestUserAchievements(userID: number){
        return new Packet('achievement subscriber list',{
            id: userID
        });
    }

    updateUserState(state: OnlineState){
        return new Packet('subscriber settings update', { state: { state: state} } );
    }

    updateUserProfile(profile: ExtendedUser){
        return new Packet("subscriber profile update", profile);
    }

    updateUsername(name: string, profile: ExtendedUser){
        profile.nickname = name;
        return new Packet("subscriber profile update", profile);
    }

    updateStatus(status: string, profile: ExtendedUser){
        profile.status = status;
        return new Packet("subscriber profile update", profile);
    }

    updateUserBio(description: string, profile: ExtendedUser){
        profile.extended.about = description;
        return new Packet("subscriber profile update", profile);
    }

    updateName(name: string, profile: ExtendedUser){
        profile.extended.name = name;
        return new Packet("subscriber profile update", profile);
    }

    updateLanguage(language: Language, profile: ExtendedUser){
        profile.extended.language = language;
        return new Packet("subscriber profile update", profile);
    }

    updateBirthday(year: number, month: number, day: number, profile: ExtendedUser){
        profile.extended.dobY = year;
        profile.extended.dobM = month;
        profile.extended.dobD = day;
        return new Packet("subscriber profile update", profile);
    }

    updateGender(gender: Gender, profile: ExtendedUser){
        profile.extended.gender = gender;
        return new Packet("subscriber profile update", profile);
    }

    updateRelationshipStatus(Relationship: RelationshipStatus, profile: ExtendedUser){
        profile.extended.relationshipStatus = Relationship;
        return new Packet("subscriber profile update", profile);
    }

    updateLookingFor(LookingFor: LookingFor, profile: ExtendedUser){
        profile.extended.lookingFor = LookingFor;
        return new Packet("subscriber profile update", profile);
    }

    updateUrls(urls: string[5][], profile: ExtendedUser){
        profile.extended.urls = urls;
        return new Packet("subscriber profile update", profile);
    }

    ///disabled backend
    //updateUserAvatar(avatar: string){
    //    return new Packet('subscriber avatar update', {
    //        avatar: avatar
    //    });
    //}

    //#region charm related packets
    
    requestCharms(){
        return new Packet('charm list');
    }

    requestUserCharmStats(userID: number){
        return new Packet('charm subscriber statistics', {id: userID});
    }

    requestUserActiveCharms(userID: number, offset: number = 0, limit: number = 25){
        return new Packet('charm subscriber active list', {
            id: userID,
            offset: offset,
            limit: limit
        });
    }

    requestUserExpiredCharms(userId: number, offset: number = 0, limit: number = 25){
        return new Packet('charm subscriber expired list',{
            id: userId,
            offset: offset,
            limit: limit
        });
    }

    setSelectedCharm(charm: SelectedList[]){
        return new Packet('charm subscriber set selected',{
            SelectedList: charm
        });
    }
    //#endregion

    //#region contacts

    userAdd(userID: number, Message: string = ''){
        return new Packet('subscriber contact add', {
            id: userID,
            message: Message
        });
    }

    userDelete(userID: number){
        return new Packet('subscriber contact delete', {
            id: userID
        });
    }

    userBlock(userID: number){
        return new Packet('subscriber contact block', {
            id: userID
        });
    }
    //#endregion

    //#region group discover

    requestTopics(language: Language = Language.english, name:string = 'default'){
        return new Packet('topic file', {
            name: name,
            languageId: language
        });
    }

    requestDiscoverGroups(language: Language = Language.english, maxResults: number, offset: number = 0, admin: boolean = false, repLevel?: number, recipieId?: number){
        return new Packet('group discovery list', {
            maxResults: maxResults,
            offset: offset,
            admin: admin,
            reputationLevelOverride: (repLevel > 0 || !isNull(repLevel)) ? repLevel : null,
            language: language,
            recipieId: (recipieId > 0 || !isNull(recipieId)) ? recipieId : null
        });
    }

    //#endregion

    //#region notifications

    notifications(language: Language = Language.english, deviceType: DeviceType){
        return new Packet('notification list', {
            language: language,
            deviceType: deviceType
        });
    }

    clearNotifications(){
        return new Packet('notification list clear');
    }

    notificationSubscribe(language: Language = Language.english, deviceType: DeviceType){
        return new Packet('notification list subscribe', {
            language: language,
            deviceType: deviceType
        });
    }

    //#endregion

    //#region message related packets

    messagePacket(id: number, isGroup: boolean,
        msg: any, mimeType: string, flightId?: string) {
    
        return new Packet('message send', {
            recipient: id,
            data: msg,
            mimeType: mimeType,
            isGroup: isGroup,
            flightId: flightId ? flightId : Math.random().toString(36).substring(7)
        });
    }

    //alec's implimentation of historcal messages still works

    ConversationHistory() {
        return new Packet("message conversation list", null, {
            version: 3
        })
    }
    
    MessageHistory(id: number, from: Date, group: boolean, chronological: boolean) {
        return new Packet(group ? 'message group history list' : 'message private history list', group ? {
            id: id,
            timestapBegin: 1,
            timestampEnd: Extensions.toPalTime(from),
            chronological: chronological
            
        } : { 
            id: id,
            timestampEnd: Extensions.toPalTime(from)
        },
        group ? {
            version: 3
        } : { 
            version: 2 
        });
    }

    //#endregion


    //#region 

    requestAudioSlots(groupID: number, subscribe?: boolean){
        return new Packet('group audio slot list', {
            id: groupID,
            subscribe: subscribe
        });
    }

    slotUpdate(groupID: number, slotID: StageInfo){
        return new Packet('group audio slot update', {
            id: groupID,
            slot: slotID
        });
    }

    broadcast(groupID: number, slotID: number, sdp: any){
        return new Packet('group audio broadcast',{
            id: groupID,
            slotId: slotID,
            sdp: sdp
        });
    }

    consume(groupID: number, slotID: number, sdp: string){
        return new Packet('group audio consume', {
            id: groupID,
            slotid: slotID,
            sdp: sdp
        });
    }

    //#endregion
}