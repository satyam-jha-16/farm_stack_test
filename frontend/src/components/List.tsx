import axios from "axios";
import { useEffect, useState } from "react";


interface Todo {
    title: string;
    desc: string;
}
const List = () => {
    const [list, setList] = useState<Todo[]>([])
    const [formData, setFormData] = useState({ title: '', desc: '' });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData({ ...formData, [id]: value })
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/todo");
                setList(response.data)
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, []);
    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/todo", formData)
            setList([...list, response.data])
            setFormData({ title: '', desc: '' })
        } catch (error) {
            console.log("error creating a new list");

        }
    }
    const handleDelteClick = async (title: string) => {
        // setTodelete(title) 
        try {
            const response = await axios.delete(`http://localhost:8000/api/todo/${title}`)
            // Here was the mistake
            if (response.status === 200) {
                setList(list.filter((lst) => lst.title !== title))
            }
        } catch (error) {
            console.log("error getting response");
        }

    }


    return (
        <div className="grid grid-place-center ">
            <h1 className="text-3xl text-orange-600 text-center mt-20 ">ToDo List</h1>
            <form action="">
                <div className="flex justify-center">
                    <label htmlFor="title " className="my-10 text-xl text-gray-700 px-2 py-1">Title : </label>
                    <input type="text" id="title" className="my-10 text-xl text-gray-700 border-black border-2 rounded-md h-10 max-w-7xl w-[600px] px-2 py-1" onChange={handleInputChange} />
                </div>
                <div className="flex justify-center">
                    <label htmlFor="desc" className=" text-xl text-gray-700 px-2 py-1">Desc : </label>
                    <input type="text" id="desc" className="text-xl text-gray-700 border-black border-2 rounded-md h-10 max-w-7xl w-[600px] px-2 py-1" onChange={
                        handleInputChange
                    } />
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={handleSubmit}
                        className="my-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Todo
                    </button>
                </div>
            </form>
            <button></button>
            <div className="grid grid-cols-1">
                {list &&
                    list?.map((lst) => (
                        <div key={lst.title} className=" bg-yellow-300 m-4 p-4 flex justify-between">
                            <div>
                                <div className="text-md">{lst.title}</div>
                                <div className="text-md">{lst.desc}</div>
                            </div>
                            <div>
                                <div className="bg-red-500 px-2 py-1 cursor-pointer" onClick={() => { handleDelteClick(lst.title) }}>delete</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default List;