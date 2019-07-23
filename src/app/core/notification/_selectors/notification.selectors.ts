// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';

// State
import { notificationState, adapter } from '../_reducers/notification.reducers';

export const selectNotificationState = createFeatureSelector<notificationState>('notification');

export const getNotification = createSelector(
  selectNotificationState,
  adapter.getSelectors().selectAll
);

export const getNotificationLoading = createSelector(
  selectNotificationState,
  (state: notificationState) => state.notificationLoading
);

export const getNotificationLoaded = createSelector(
  selectNotificationState,
  (state: notificationState) => state.notificationLoaded
);
export const getNotificationError = createSelector(
  selectNotificationState,
  (state: notificationState) => state.notificationError
);