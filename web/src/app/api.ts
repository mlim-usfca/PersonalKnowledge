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

export const fetchSavedCategories = async (userId: string): Promise<SavedCategory[]> => {
    // if (useMockData) {
    //     return mockCategories;
    // }

    try {
        let userCategories: SavedCategory[] = [];
        const { data: { user } } = await supabase.auth.getUser();
  
        if (!user) {
            alert('User must be logged in to submit links.');
            return userCategories;
        }
        const { data:categoryData, error: categoryError } = await supabase
        .from('categories')
        .select()
        .eq('user_id', user.id);
        if (!categoryData) {
            alert('User does not have any category!');
            return userCategories;
        }

        let links: SavedLink[] = [];
        const { data:linkData, error:linkerror } = await supabase
        .from('category_link_relation')
        .select()
        .eq('creator', user.id);

        if (!linkData) {
            alert('User does not have any link!');
        } else {
            linkData.forEach( (row) => {
                let categoryLink = (): SavedLink => ({
                    id: '',
                    title: '',
                    url: row.link,
                    tags: [],
                    category: row.category
                });
                links.push(categoryLink());
            });
        }

        categoryData.forEach( (element) => {
            let templinks: SavedLink[] = [];
            
            links.forEach( (row) => {
                if (row.category == element.category_name){
                    templinks.push(row);
                }
            });

            let userCategory = (): SavedCategory => ({
                id: element.id,
                name: element.category_name,
                links: templinks,
            });
            userCategories.push(userCategory());
        });
        return userCategories;
    } catch (error) {
        console.error("An error occurred while fetching saved links:", error);
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
