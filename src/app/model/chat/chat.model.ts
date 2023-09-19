import { UserType } from 'src/app/Enums/UserType.enum';

export class MsgNotification {
  senderEmail: string;
  chatGroupId: number;
  count: number;
}
export class AddChatDto {
  senderUserId: string;
  chatGroupId: number;
  message: string;
  linkUrl: string;
  data: string;
  chatType: ChatTypeEnum;
}
export class PublishConfirmationDto {
  chatGroupId: number;
  channelName: string;
  participients: ChatParticipientDtoSignalR[] = [];
}

export class ChatHistoryResponseDto {
  chats: ChatDto[] = [];
  participients: ChatParticipientDto[] = [];
}

export class ChatParticipientDtoSignalR {
  UserId: string;
  FullName: string;
  ShortName: string;
  ReadIndex: number;
  Email: string;
}
export class ChatParticipientDto {
  userId: string;
  fullName: string;
  shortName: string;
  readIndex: number;
  email: string;
}
export class ChatDto {
  id: number;
  message: string;
  linkUrl: string;
  timeStamp: any;
  timeToken: string;
  channelName: string;
  chatGroupId: number;
  senderName: string;
  senderUserId: string;
  sentToAll: boolean;
  viewedByAll: boolean;
  selected!: boolean;
  chatType: ChatTypeEnum;
  data: string;
  participients: ChatParticipientDto[] = [];

  timeLine: {}; // extended
}

export class SessionChatDto {
  username: string;
  connectionId: string;
  message: string;
  date: Date;
  sent: boolean;
  viewed: boolean;
  constructor() {
    this.username = '';
    this.connectionId = '';
    this.message = '';
    this.date = new Date();
    this.sent = false;
    this.viewed = false;
  }
}
export class AppNotification {
  id = 0;
  notificationType: string;
  entityId: number;
  message: string;
  count: number;
  linkUrl: string;
  module: string;
  entity: any;
  timeStamp: any;
  //  description: string;
  //  title: string;
}
export class ChatUserDto {
  appUserId: string;
  name: string;
  userName: string;
  email: string;
  userType: UserType;
}
export class ChatGroupDto {
  id: number;
  title: string;
  channelName: string;
  dateCreated: string;
  facilityId: number;
  facilityName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMsgCount: number;
  isNewGroup: boolean;
  participants = new Array<ChatUserDto>();
}
export interface Extra {
  isPasswordProtected: boolean;
  roomOwner: boolean;
  broadcastId: string;
  userFullName: string;
  _room: { isFull: boolean };
}
export interface IStreamEvent {
  extra: Extra;
  isAudioMuted: boolean;
  mediaElement: any;
  stream: MediaStream;
  streamid: string;
  type: string;
  userid: string;
}
export interface IClassSession {
  srcObject: MediaStream;
  userId: string;
  streamId: string;
  isVideo: boolean;
  isAudio: boolean;
}
export interface IStreamEvent {
  extra: Extra;
  isAudioMuted: boolean;
  mediaElement: any;
  stream: MediaStream;
  streamid: string;
  type: string;
  userid: string;
}

export class AVCallDto {
  callerName: string;
  callerUserName: string;
  participentName: string;
  participentUserName: string;
  roomId: string;
  actionType: CallActionEnum;
}
export enum CallActionEnum {
  AVCall = 1,
  Received,
  Declined,
  OnAnotherCall,
  Dropped,
}
export enum AvChattViewEnum {
  callingOther = 1,
  someOneCallingMe,
  callISActive,
}

export class SearchedChatUsersDto {
  appUserId: string;
  emrId: string;
  fullName: string;
  id: number;
  roles: any;
  userName: string;
}

export enum HubSateEnum {
  Connected = 1,
  'Re Connecting' = 2,
  'Disconnected' = 3,
  'Connection Error' = 4,
}


export enum ChatTypeEnum {
  Text = 0,
  Document,
  Image,
  Audio,
  Video
}

export enum ChatViewType {
  Chat = 1,
  Telephony = 2,
  Both = 3
}
