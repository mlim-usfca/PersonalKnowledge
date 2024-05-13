import { supabase } from "@/components/supabase";
import { User } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";
import { Document } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";
import { Category, SavedLink } from "../interfaces";

export const fetchCategories = async (userId: string): Promise<Category[]> => {
    try {
        let userCategories: Category[] = [];
        const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select()
            .eq('user_id', userId);
        if (!categoryData) {
            alert('User does not have any category!');
            return userCategories;
        }

        let links: SavedLink[] = [];
        const { data: linkData, error: linkerror } = await supabase
            .from('category_link_relation')
            .select()
            .eq('creator', userId);

        if (!linkData) {
            alert('User does not have any link!');
        } else {
            linkData.forEach((row) => {
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

        categoryData.forEach((element) => {
            let templinks: SavedLink[] = [];

            links.forEach((row) => {
                if (row.category == element.category_name) {
                    templinks.push(row);
                }
            });

            let userCategory = (): Category => ({
                id: element.id,
                name: element.category_name,
                links: templinks.map((link) => {
                    return link.url;
                })
            });
            userCategories.push(userCategory());
        });
        return userCategories;
    } catch (error) {
        console.error("An error occurred while fetching saved links:", error);
        throw error;
    }
};

export const addNewCategory = async (category: string, userId: string) => {
    try {
        const { error: insertError } = await supabase
            .from('categories')
            .insert([
                { category_name: category, user_id: userId }
            ])

        if (insertError) {
            return { error: insertError };
        }
    } catch (error) {
        alert('Couldn\'t submit, try again');
        console.error(error);
        return { error: error };
    }
}

export const fetchExtractedContent = async (url: string) => {
    const response = await supabase.functions.invoke('extractContent', {
        body: JSON.stringify({ url }),
    });
    if (response.error) {
        return { error: response.error };
    }
    return { data: response.data };
}

function errorResponse(message: string, error: {} | '') {
    console.error(`Error: ${message} -- ${error}`);
    return {
        message: message,
        error: error,
    }
}

export const addNewLink = async (link: string, user: User, category: string) => {
    try {
        // Now, call the 'extractContent' edge function
        const { data: data, error: extractError } = await supabase.functions.invoke('extractContent', {
            body: JSON.stringify({ url: link })
        });

        if (extractError) {
            return errorResponse('Extract content failed:', extractError);
        }
        console.log("Extracted content:", data);

        // Proceed to insert the link into the database, including the extracted content
        const { error: insertError } = await supabase
            .from('links')
            .insert([
                { link: link, owner: user?.id, purpose: category, owner_email: user?.email }
            ]);

        // Check if the insert operation was successful and data is returned
        if (insertError) {
            return errorResponse("Embedding creation failed", insertError);
        }

        const { data: link_data } = await supabase
            .from('links')
            .select('id')
            .eq('link', link);
        // Assuming 'id' is the name of your auto-generated primary key column

        if (!link_data || link_data.length === 0) {
            return errorResponse("Link not found", '');
        }
        const linkId = link_data[0].id;

        await createEmbedding(data.content, linkId);

        const { error: categoryLinkError } = await supabase
            .from('category_link_relation')
            .insert([
                { link: link, category: category, creator: user?.id }
            ]);

        if (categoryLinkError) {
            return errorResponse("Creation of category link relation failed", categoryLinkError);
        } else {
            return;
        }

    } catch (error) {
        return errorResponse('Couldn\'t submit, try again', '');
    } finally {
        return;
    }
}

interface Chunk {
    pageContent: string;
    metadata: {
        linkId: string;
    };
}

const createEmbedding = async (extractedContent: string, linkId: string) => {
    try {
        const splitter = new TokenTextSplitter({
            encodingName: "gpt2",
            chunkSize: 300,
            chunkOverlap: 20,
        });

        const contentChunks: Chunk[] = (await splitter.splitDocuments([
            new Document({
                pageContent: extractedContent,
                metadata: { linkId },
            }),
        ]) as Chunk[]);

        const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');

        const embeddingsPromises = contentChunks.map(async (chunk) => {
            try {
                const content = chunk.pageContent;
                const output = await generateEmbedding(content, {
                    pooling: 'mean',
                    normalize: true,
                });
                const embedding = JSON.stringify(Array.from(output.data));
                return { embedding, content };
            } catch (error) {
                console.error("Error generating embedding for chunk:", error);
                throw error;
            }
        });

        const embeddings = await Promise.all(embeddingsPromises);
        await storeEmbeddings(embeddings, linkId);

        console.log("Embeddings created and stored successfully for link ID:", linkId);
    } catch (error) {
        console.error("Error creating and storing embeddings:", error);
        throw error;
    }
};

const storeEmbeddings = async (embeddings: { embedding: string; content: string; }[], linkId: string) => {
    try {
        const { data, error } = await supabase
            .from("document_sections")
            .insert(embeddings.map(({ embedding, content }) => ({
                embedding,
                content,
                link_id: linkId
            })));

        if (error) {
            console.error("Error storing embeddings in Supabase:", error);
            throw error;
        }

        console.log("Embeddings stored in Supabase successfully.");
    } catch (error) {
        console.error("Error storing embeddings in Supabase:", error);
        throw error;
    }
};
