import client from "@/lib/appwrite_client";
import { Databases} from "appwrite";
import { NextRequest, NextResponse } from "next/server";

const database = new Databases(client);

// fetch
async function fetchInterpretation(id: string){
    try {
        const interpretation = await database.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Title",
            id
        );
        return interpretation;
    } catch (error) {
        console.error("Error fetching",error);
        throw new Error("Failed to fetch")
    }
}

// Delete
async function deleteInterpretation(id:string) {
    try {
        const response = await database.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Title",
            id
        );
        return response;
    } catch (error) {
        console.error("Error deleting",error);
        throw new Error("Failed to delete")
    }
}

// Updata
async function updateInterpretation(id:string,data: {term: string, interpretation: string}) {
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "Title",
            id,
            data
        );
        return response;
    } catch (error) {
        console.error("Error updating",error);
        throw new Error("Failed to update")
    }
}

// get request handler
export async function GET(req: Request, { params } : {params : {id: string}}){
    try {
        const id = params.id;
        const interpretation = await fetchInterpretation(id);
        return NextResponse.json({interpretation});
    } catch (error) {
        return NextResponse.json(
            {error: "failed"},
            {
                status: 500
            }
        );
    }
}  

// delete
export async function DELETE(req: Request, { params } : {params : {id: string}}){
    try {
        const id = params.id;
        await deleteInterpretation(id);
        return NextResponse.json({message: "Interpretation deleted"});
    } catch (error) {
        return NextResponse.json(
            {error: "failed to delete"},
            {
                status: 500
            }
        );
    }
}

// update
export async function PUT(req: Request, { params } : {params : {id: string}}){
    try {
        const id = params.id;
        const interpretation = await req.json();
        await updateInterpretation(id,interpretation);
        return NextResponse.json({message: "Interpretation updated"});
    } catch (error) {
        return NextResponse.json(
            {error: "failed to update"},
            {
                status: 500
            }
        );
    }
}
