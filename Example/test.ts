import { WolfClient } from '../Source/src/WOLF'
import { ExtendedMessage, ExtendedGroup, ExtendedUser, Message, CGroup } from '../Source/src/Modules/Modules';
import { Plugin } from '../Source/src/EntryPoint';
import { Language, DeviceType, OnlineState, LookingFor, RelationshipStatus, Gender } from '../Source/src/Types/Types';

class Main{
    public bot: WolfClient;


    @Plugin('test')
    static async ExamplePlugin(client: WolfClient, msg: ExtendedMessage, grp: ExtendedGroup){
        //Fetches entire group member list.
        await client.Info.groupMemberList(msg.group.id, (resp) => {
            //logs the current selected user's nickname in the ExtendedUser array.
            console.log(resp[1].sort.nickname);
            //logs every single ExtendedUser in group member list
            console.log(resp);
        });
        //Self explanatory, joins the supplied group.
        await client.Action.joinGroup('palringo', null, (result) => {
            //logs the error/result of the method.
            console.log(result.alreadyInGroup);
        });
        //Self explanatory, preforms admin action on supplied user in supplied group then logs the action result.
        await client.Action.silenceUser(msg.group.id, msg.userProfile.id, (result) => console.log(result.sucess));
        await client.Action.resetUser(msg.group.id, msg.userProfile.id , (result) => console.log(result.sucess));
        //Requests the extended profile of supplied user ID
        await client.Info.requestUser(1, (data) =>{
            console.log(data);
        });
        //Requests all active charms of supplied userID
        await client.Info.requestUserActiveCharms(1, resp =>{
            console.log(resp)
        });       
        //Requests all expired charms of supplied userID
        await client.Info.requestUserExpiredCharms(1, resp =>{
            console.log(resp)
        });
        //Requests charm stats of supplied userID
        await client.Info.requestUserCharmStatistics(1, resp => {
            console.log(resp.subscriberId)
        });
        //Requests the ExtendedGroup of the supplied group.
        //Takes either GroupID or GroupName for the first parameter.
        await client.Info.requestGroup('palringo', resp => console.log(resp))
        await client.Info.requestGroup(2, resp => console.log(resp))
        //Requests group statistics for the supplied groupID
        await client.Info.requestGroupStats(2, callback => console.log(JSON.stringify(callback, null, 4)))
        //Updates the bot's online status to either busy/away/online/invisible
        await client.Info.updateOnlineState(OnlineState.Invisible);
        //Requests all achivements for the supplied userID
        await client.Info.requestUserAchievements(client.Info.ClientProfile.id, resp => console.log(resp));
        //Requests all the achievements, the first paremeter defaults to english if set to null, however you may set your own.
        await client.Info.requestAchievementList(Language.english, resp => console.log(JSON.stringify(resp, null, 4)));
        //Contact actions, currently userBlock is not enabled server side, however I kept it
        //enabled because I suspect it won't be log until it's added back in.
        await client.Info.userAdd(30693197)
        await client.Info.userDelete(30693197)
        await client.Info.userBlock(30693197)
        //This gets all current notifications/news stream.
        client.Info.notifications(Language.english, DeviceType.Web, resp => console.log(resp));
        //self explanatoray, clears all news stream notifications
        await client.Info.clearNotification();
        //Req uests all the current topics, without json.stringify it will not log the ENTIRE response
        //beacuse there's too much data, however all of it is there, it'll just show up as [obj] for the
        //da ta it's unable to display.
        await client.Info.requestTopics(Language.english, resp => console.log(JSON.stringify(resp, null, 4)));
        //requests the discover groups, can change the amount to whatever you like, there are also some optional
        //parameters to mess around with
        await client.Info.requestDiscoverGroups(Language.english, 25, (resp) => console.log(resp));
        //All of these messaging commands support text and image by file or link
        //                       param: groupID, link/txt, optional: is image boolean, if tring to send an image 
        //                       set to true, otherwise if you're trying to send a message leave blank/set to false.
        await client.Messaging.groupMessage(1, 'https://pbs.twimg.com/media/EP512RgWAAYfUNV?format=jpg&name=small', true);
        await client.Messaging.privateMessage(30693197, 'https://pbs.twimg.com/media/EP512RgWAAYfUNV?format=jpg&name=small', true);
        await client.Messaging.reply(msg, './Source/test.jpg', true);
        //Fetches all the recent conversations you've had up to what palringo stores server side. 
        await client.Info.conversationList(callback =>{
            console.log(callback);
        });
        //Fetches all historical messages, this one is a bit messy and to my knowledge
        //can't be simplified much further; it fetches a 5 Message array within the supplied date.
        let dt = new Date();
        dt.setMinutes(dt.getMinutes() - 300);
        //paremeters are as followed: ID of group or user to fetch from Date, is group true or false, Message array callback.
        await client.Info.messageHistory(msg.isGroup ? msg.group.id : msg.userProfile.id, dt, msg.isGroup ? true : false, true, (callback:Message[]) => {
            dt = callback[3].timestamp;
            console.log(callback);
        });
        //Updates group profile
        let edit = new CGroup();
        edit = { 
            description: 'test',
            extended:{
                longDescription: 'this is the really long desc that you see under the group status',
                language: Language.english,
                entryLevel: 10,
                discoverable: true,
                advancedAdmin: true
            },
            password: 'only allowed if premium',
            peekable: true
        }
        edit.description = 'can also update it this way';
        await client.Info.updateGroup(edit)
        //This is how you create a group booleans/language/name cannot be null.
        let create = new CGroup();
        create = { 
            name: 'testgroup',
            description: 'test',
            extended:{
                longDescription: 'this is the really long desc that you see under the group status',
                language: Language.english,
                entryLevel: 10,
                discoverable: true,
                advancedAdmin: true
            },
            password: 'only allowed if premium',
            peekable: true
        }
        await client.Info.createGroup(create);
        //this allows you to mass edit a profile, you can copy another extended user's 
        //profile and set the bots to that with this.
        let prof = new ExtendedUser(); 
        prof = {
            status: 'test status',
            nickname: 'testnickname',
            extended: {
                lookingFor: LookingFor.friendshipDating,
                language: Language.english,
                relationshipStatus: RelationshipStatus.single,
                sex: Gender.male
            }
        }
        await client.Info.updateUserProfile(prof);
        //I've also made individual methods for updating individual parts of the profile.
        await client.Info.updateName('testname');
        //sets the users charm based on charm ID, must own charm
        await client.Info.updateCharm(48);
    }

    async login(){
        //All of this is pretty self explanatory.
        this.bot = new WolfClient();
        this.bot.On.LoginSuccess = (user) =>{
            console.log(user.nickname);
        }
        this.bot.On.LoginFailed = (user) =>{
            console.log("uh oh");
        }
        //This shows a log of all caught errors, good for bug reporting.
        this.bot.On.Log = (data) =>{
            console.log(data);
        }
        this.bot.On.Disconnected = () =>{
            console.log("disconnected");
        }
        this.bot.On.Connected = () =>{
            console.log("connected");
        }

        await this.bot.login("email", "Password");

        //This registers all plugins with a command key e.g '>test' would execute everything in the plugin 'test';
        //you can have as many plugins as you want.
        this.bot.registerPlugins('>');
    }

}
new Main().login();