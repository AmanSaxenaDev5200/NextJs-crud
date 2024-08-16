import client from "@/lib/appwrite_client";
import { Databases, ID, Query} from "appwrite";
import { NextResponse } from "next/server";
const database = new Databases(client);
// Create Title
async function createInterpretation(data:{term: string, interpretation: string; }) {
    try {
        const response = await database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "Title",
        ID.unique(),
        data );

        return response;
    } catch (error) {
        console.error("Error creating interpretation", error);
        throw new Error("Failed creating interpretaion");
    }
}

// Fetch Title
async function fetchInterpretation() {
    try {
        const response = await database.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        "Title",
        [Query.orderDesc("$createdAt")]);
        return response.documents;
    } catch (error) {
        console.error("Error fetching interpretation", error);
        throw new Error("Failed fetching interpretation");
    }
}

export async function POST(req: Request){
    try {
        const {term ,interpretation} = await req.json();
        const data = {term,interpretation};
        const response = await createInterpretation(data);
        return NextResponse.json({message: "Interpretation created"})
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed"
            },
            {
                status: 500
            }
        );
    }
}


export async function GET(){
        try {
            const interpretations = await fetchInterpretation();
            return NextResponse.json(interpretations);
        } catch (error) {
            return NextResponse.json(
                {error: "Failed to fetch interpretation"},
                {status: 500}
            );
        }
}