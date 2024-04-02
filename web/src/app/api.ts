import axios, { AxiosResponse } from 'axios';
import { Message, UserData, SavedLink, Tags } from './interfaces';
import { mockUser, mockMessages, mockLinks, mockTags } from './mockData';

const useMockData = true;

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

export const fetchMessages = async (userId: string): Promise<Message[]> => {
    if (useMockData) {
        return mockMessages;
    }

    try {
        const response: AxiosResponse<Message[]> = await API.get(`/users/${userId}/messages`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while fetching messages:", error);
        throw error;
    }
};

export const addMessage = async (userId: string, message: Message): Promise<Message> => {
    if (useMockData) {
        return message;
    }
    
    try {
        const response: AxiosResponse<Message> = await API.post(`/users/${userId}/messages`, message);
        return response.data;
    } catch (error) {
        console.error("An error occurred while adding message:", error);
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

export const addSavedLink = async (userId: string, link: SavedLink): Promise<SavedLink> => {
    try {
        const response: AxiosResponse<SavedLink> = await API.post(`/users/${userId}/saved-links`, link);
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