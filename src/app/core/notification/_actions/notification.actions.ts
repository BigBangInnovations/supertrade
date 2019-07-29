import { Action } from '@ngrx/store'

// Models
import { CommonResponse, CommonResponseDirectData } from '../../common/common.model'

export enum NotificationActionType {
    // Notification
    LOAD_NOTIFICATION = '[Notification] load notification',
    LOAD_NOTIFICATION_SUCCESS = '[Notification] load notification Success',
    LOAD_NOTIFICATION_FAIL = '[Notification] load notification Fail',
    // Approval
    LOAD_APPROVAL = '[Approval] load notification',
    LOAD_APPROVAL_SUCCESS = '[Approval] load notification Success',
    LOAD_APPROVAL_FAIL = '[Approval] load notification Fail',
    //My pending Approval
    LOAD_MYPENDINGAPPROVAL = '[My pending approval] load notification',
    LOAD_MYPENDINGAPPROVAL_SUCCESS = '[My pending approval] load notification Success',
    LOAD_MYPENDINGAPPROVAL_FAIL = '[My pending approval] load notification Fail',
}

//Notification
export class LoadNotification implements Action {
    readonly type = NotificationActionType.LOAD_NOTIFICATION;
    constructor(public payload) { }
}

export class LoadNotificationSuccess implements Action {
    readonly type = NotificationActionType.LOAD_NOTIFICATION_SUCCESS;
    constructor(public payload: CommonResponseDirectData) { }
}

export class LoadNotificationFail implements Action {
    readonly type = NotificationActionType.LOAD_NOTIFICATION_FAIL;
    constructor(public payload: string) {}
}

//Approval
export class LoadApproval implements Action {
    readonly type = NotificationActionType.LOAD_APPROVAL;
    constructor(public payload) { }
}

export class LoadApprovalSuccess implements Action {
    readonly type = NotificationActionType.LOAD_APPROVAL_SUCCESS;
    constructor(public payload: CommonResponseDirectData) { }
}

export class LoadApprovalFail implements Action {
    readonly type = NotificationActionType.LOAD_APPROVAL_FAIL;
    constructor(public payload: string) {}
}

//My Pending Approval
export class LoadMyPendingApproval implements Action {
    readonly type = NotificationActionType.LOAD_MYPENDINGAPPROVAL;
    constructor(public payload) { }
}

export class LoadMyPendingApprovalSuccess implements Action {
    readonly type = NotificationActionType.LOAD_MYPENDINGAPPROVAL_SUCCESS;
    constructor(public payload: CommonResponseDirectData) { }
}

export class LoadMyPendingApprovalFail implements Action {
    readonly type = NotificationActionType.LOAD_MYPENDINGAPPROVAL_FAIL
    constructor(public payload: string) {}
}


export type Action = 
LoadNotification | 
LoadNotificationSuccess | 
LoadNotificationFail | 
LoadApproval | 
LoadApprovalSuccess | 
LoadApprovalFail | 
LoadMyPendingApproval | 
LoadMyPendingApprovalSuccess | 
LoadMyPendingApprovalFail
;