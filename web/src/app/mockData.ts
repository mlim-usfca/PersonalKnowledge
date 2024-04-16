import { UserData, Message, SavedLink, SavedCategory, Tags } from './interfaces';

export const mockUser: UserData = {
    id: 'user123',
    name: 'John Doe'
};

export const mockMessages: Message[] = [
    // {
    //     id: '1',
    //     res: {
    //         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit pretium eros quis elementum. Suspendisse libero neque...',
    //     },
    //     user: 'John'
    // },
    // {
    //     id: '2',
    //     res: {
    //         text:
    //             'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis, mi sit amet aliquet consequat, ante tortor hendrerit urna, vitae imperdiet tellus ligula interdum tortor. Mauris fringilla et quam in accumsan. Nunc quis nulla lacus. Integer tincidunt arcu at leo pulvinar suscipit non id sapien. Duis in nisi dui. Cras ullamcorper tempus mollis. In nulla leo, porttitor id maximus non, fermentum mattis ipsum. Vivamus fermentum luctus velit, non volutpat mauris dapibus ac. Nulla luctus eget augue in congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis, mi sit amet aliquet consequat, ante tortor hendrerit urna, vitae imperdiet tellus ligula interdum tortor. Mauris fringilla et',
    //     },
    //     user: 'AI'
    // }
];

export const mockTags: Tags[] = [
    { id: '1', name: 'Restaurants near me', emoji: '🍔' },
    { id: '3', name: 'Sports', emoji: '⚽️' },
    { id: '5', name: 'Science', emoji: '🔬' },
    { id: '10', name: 'to eat', emoji: '🍽️' },
    { id: '12', name: 'to visit', emoji: '🗺️' },
];

export const mockLinks: SavedLink[] = [
    {
        id: 'link1',
        title: 'How to make a burger',
        url: 'https://www.burger.com',
        tags: [
            { id: '10', name: 'to eat', emoji: '🍽️' }
        ],
        category: 'Food'
    },
    {
        id: 'link2',
        title: 'Relativity Theory explained',
        url: 'https://www.relativity.com',
        tags: [
            { id: '12', name: 'to visit', emoji: '🗺️' }
        ],
        category: 'Theory'
    },
    {
        id: 'link3',
        title: 'Top 10 sports teams',
        url: 'https://www.sports.com',
        tags: [
            { id: '12', name: 'to visit', emoji: '🗺️' }
        ],
        category: 'Sport'
    }
];

export const mockCategories: SavedCategory[] = [
    {
        id: 1,
        name: 'Food',
        links: [
            {
                id: 'link1',
                title: 'How to make a burger',
                url: 'https://www.burger.com',
                tags: [
                    { id: '1', name: 'Cooking', emoji: '🍳' },
                    { id: '2', name: 'Food', emoji: '🍔' }
                ],
                category: 'Food'
            },
            {
                id: 'link3',
                title: 'Top 10 sports teams',
                url: 'https://www.sports.com',
                tags: [
                    { id: '3', name: 'Sports', emoji: '⚽️' },
                    { id: '5', name: 'Teams', emoji: '🏆' }
                ],
                category: 'Sport'
            }
        ]
    },
    {
        id: 2,
        name: 'Theory',
        links: [
            {
                id: 'link2',
                title: 'Relativity Theory explained',
                url: 'https://www.relativity.com',
                tags: [
                    { id: '3', name: 'Science', emoji: '🔬' },
                    { id: '4', name: 'Physics', emoji: '⚛️' }
                ],
                category: 'Theory'
            },
        ]
    },
    {
        id: 3,
        name: 'Sport',
        links: [
            {
                id: 'link3',
                title: 'Top 10 sports teams',
                url: 'https://www.sports.com',
                tags: [
                    { id: '3', name: 'Sports', emoji: '⚽️' },
                    { id: '5', name: 'Teams', emoji: '🏆' }
                ],
                category: 'Sport'
            },
        ]
    }
];

export const mockAIResponse: Message = {
    id: `${Date.now() - Math.random()}`,
    res: {
        text: 'Relativity is a theory in physics about the effects of motion on measurements of space and time...'
    },
    user: 'AI'
};
