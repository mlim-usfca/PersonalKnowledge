import axios, { AxiosResponse } from 'axios';
import { UserData, SavedLink, SavedCategory, Tags } from './interfaces';
import { mockUser, mockLinks, mockTags } from './mockData';
import { supabase } from '../components/supabase';

const useMockData = process.env.NEXT_PUBLIC_DATA_SOURCE_TYPE === 'mock';

// default config for axios
const API = axios.create({
    baseURL: 'https://backend.api/',
    timeout: 10000, // Request timeout
});

export const fetchUserData = async (userId: string): Promise<UserData> => {
    if (useMockData) {
        return mockUser;
    }

    try {
        const response: AxiosResponse<UserData> = await API.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching user data:", error);
        throw error;
    }
};

export const fetchSavedLinks = async (userId: string): Promise<SavedLink[]> => {
    if (useMockData) {
        return mockLinks;
    }

    try {
        const response: AxiosResponse<SavedLink[]> = await API.get(`/users/${userId}/saved-links`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching saved links:", error);
        throw error;
    }
};

export const addSavedLink = async (userId: string, savedLink: SavedLink): Promise<SavedLink> => {
    if (useMockData) {  
        return savedLink;
    }

    try {
        const response: AxiosResponse<SavedLink> = await API.post(`/users/${userId}/saved-links`, savedLink);
        return response.data;
    } catch (error) {
        console.error("An error occurred while adding saved link:", error);
        throw error;
    }
};

export const updateSavedLink = async (userId: string, linkId: string, updatedLink: SavedLink): Promise<SavedLink> => {
    try {
        const response: AxiosResponse<SavedLink> = await API.patch(`/users/${userId}/saved-links/${linkId}`, updatedLink);
        return response.data;
    } catch (error) {
        console.error("An error occurred while updating saved link:", error);
        throw error;
    }
};

export const deleteSavedLink = async (userId: string, linkId: string) => {
    try {
        await API.delete(`/users/${userId}/saved-links/${linkId}`);
        return;
    } catch (error) {
        console.error("An error occurred while deleting saved link:", error);
        throw error;
    }
};

export const fetchTags = async (): Promise<Tags[]> => {
    if (useMockData) {
        return mockTags;
    }

    try {
        const response: AxiosResponse<Tags[]> = await API.get(`/tags`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching tags:", error);
        throw error;
    }
};
