// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import * as notificationAction from '../_actions/notification.actions';
// Models
import { Notification } from '../../Notification/_models/Notification.model';

// tslint:disable-next-line:no-empty-interface
export interface notificationState extends EntityState<Notification> {
    notificationLoading: boolean;
    notificationLoaded: boolean;
    notificationError: string;
}

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>({
    selectId:(Notification:Notification) => Notification.ID,
});

export const initialNotificationsState: notificationState = adapter.getInitialState({
    ids: [],
    entities: {},
    selectedNotificationId: null,
    notificationLoading: false,
    notificationLoaded: false,
    notificationError: ""
});

export function notificationReducer(state = initialNotificationsState, action: notificationAction.Action): notificationState {
    switch (action.type) {
        case notificationAction.NotificationActionType.LOAD_NOTIFICATION: {
            return {
                ...state,
                notificationLoading: true,
                notificationLoaded: false,
              };
        }
        case notificationAction.NotificationActionType.LOAD_NOTIFICATION_SUCCESS: {
            return adapter.addAll(action.payload.data, {
                ...state,
                notificationLoading: false,
                notificationLoaded: true
            });
        }
        case notificationAction.NotificationActionType.LOAD_NOTIFICATION_FAIL: {
            return {
                ...state,
                entities: {},
                notificationLoading: false,
                notificationLoaded: false,
                notificationError: action.payload
              };
        }

        default: return state;
    }
}

export const {
    selectAll,
    selectEntities,
} = adapter.getSelectors();