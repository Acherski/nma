import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.model';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectAuthCallState = createSelector(selectAuth, (state: AuthState) => state.callState);

export const selectAuthMode = createSelector(selectAuth, (state: AuthState) => state.authMode);
