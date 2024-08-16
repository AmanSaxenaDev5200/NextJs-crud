"use client";

import { useRouter } from "next/navigation"; 
import { useState } from "react"
import { ChangeEvent } from "react"; 

export default function CreatePage(){
    const [formData, setFormData] = useState({term: "", interpretation: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
 
    const router = useRouter();
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        )); 
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.term || !formData.interpretation){
            setError("please fill all the fields");
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/Interpretations', {method: "POST", headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(formData),
        });
        if(!response.ok){
            throw new Error("Failed to create")
        }
        router.push("/");
        } catch (error) {
            console.log(error);
            setError("Something went wrong please try again.")
        }
        finally{
            setIsLoading(false);
        }
    };
        return(
            <div>
                <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
                    <input type="text"
                        name="term"
                        placeholder="Term"
                        value={formData.term}
                        className="py-4 px-1 border rounded-md"
                        onChange={handleInputChange}
                    />

                    <textarea
                        name="interpretation" 
                        rows={4} 
                        placeholder="Interpretation" 
                        value={formData.interpretation} 
                        className="py-4 px-1 border rounded-md resize-none "
                        onChange={handleInputChange}>
                    </textarea>

                    <button 
                        className="bg-green-500 mt-5 px-4 py-2 rounded-md cursor-pointer"
                        type="submit"
                        disabled = {isLoading}>
                        {isLoading ? "Adding..." : "Add Topic" }
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        )
}