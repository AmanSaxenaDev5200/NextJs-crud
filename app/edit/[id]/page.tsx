"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState} from "react";
import { ChangeEvent } from "react";

export default function EditPage({params}: {params: {id:string}}){

    const [formData, setFormData] = useState({term: "", interpretation: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const correctDataKeys = (data: any) => ({
        term: data.interpretation?.term || data.interpretaion.term,
        interpretation: data.interpretation?.interpretation || data.interpretaion.interpretation
    });
    const router = useRouter(); 

    useEffect(() =>{
        const fetchData = async ()=>{
            try { 
                const response = await fetch (`/api/Interpretations/${params.id}`);
                if(!response.ok){
                    throw new Error("failed to fetch")
                }
                const data = await response.json();
                console.log("fetched data ",data);
                const correctedData = {
                    term: data.interpretation?.term || data.interpretaion.term,
                    interpretation: data.interpretation?.interpretation || data.interpretaion.interpretation
                };
                setFormData(correctedData);
                } catch (error) { 
                setError("Fail to load") 
            }
        };

        fetchData();    
    },[params.id])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        ));
    };


    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        if(!formData.term || !formData.interpretation){
            setError("please fill all the fields");
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/Interpretations/${params.id}`, {method: "PUT", headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(formData),
        });
        if(!response.ok){
            throw new Error("Failed to update")
        }
        router.push("/");
        } catch (error) {
            console.log(error);
            setError("Something went wrong please try again.")
        }
        finally{
            setIsLoading(false);
        }
    }

    return (
            <div>
                <h2 className="text-2xl font-bold my-8 ">Edit</h2>
                <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
                    <input 
                    type="text" 
                        name="term" 
                        placeholder="Term" 
                        value={formData.term} 
                        onChange={handleInputChange} 
                        className="py-4 px-1 border rounded-md"
                     />

                    <textarea 
                        name="interpretation"
                        rows={4}
                        placeholder="Interpretation"
                        value={formData.interpretation} 
                        onChange={handleInputChange} 
                        className="py-4 px-1 border rounded-md resize-none">
                     </textarea>

                    <button
                        className="bg-green-500 mt-5 px-4 py-2 rounded-md cursor-pointer">
                        {isLoading ? "Updating..." : "Update Topic" }
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        )
    }