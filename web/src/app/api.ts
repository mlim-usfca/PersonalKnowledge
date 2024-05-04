import { Tags } from './interfaces';
import { mockTags } from './mockData';

export const fetchTags = async (): Promise<Tags[]> => {
    return mockTags;
};
