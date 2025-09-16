import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [datas, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDesc, setUpdatedDesc] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [updateButton, setUpdatedButton] = useState(null);
  const [isDone, setDone] = useState([]);
  const fetchDataCompleted = async () => {
    try {
      const response = await axios.get("http://localhost:3000/database/done");
      setDone(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/database");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchDataCompleted();
  }, []);
  const handlerSubmit = async (e) => {
    e.preventDefault();
    const insert = {
      title: title,
      description: desc,
      due_date: date,
      is_completed: false,
    };
    try {
      await axios.post("http://localhost:3000/database", insert);
      setTitle("");
      setDescription("");
      setDate("");
      fetchData();
    } catch (error) {
      console.error("Error inserting data:", error.response?.data || error);
    }
  };

  const handlerChange = async (e) => {
    e.preventDefault();
    const insert = {
      title: updatedTitle,
      description: updatedDesc,
      due_date: updatedDate,
      is_completed: false,
    };
    try {
      await axios.put(
        `http://localhost:3000/database/${updateButton.id}`,
        insert
      );
      setTitle("");
      setDescription("");
      setDate("");
      setIsOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error inserting data:", error.response?.data || error);
    }
  };
  const handlerDelete = async (items) => {
    await axios.delete(`http://localhost:3000/database/${items.id}`);
    fetchData();
  };
  const handlerDone = async (items) => {
    const insert = {
      title: items.title,
      description: items.description,
      due_date: items.due_date,
      is_completed: true,
    };
    const response = await axios.put(
      `http://localhost:3000/database/${items.id}`,
      insert
    );
    console.log(response);
    fetchData();
    fetchDataCompleted();
  };
  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="items-center flex justify-center fixed inset-0 px-5 ">
            <form
              className="items-center bg-white rounded-lg p-5"
              onSubmit={handlerChange}
            >
              <input
                className="border border-gray-300 outline-none p-3 rounded-lg w-full"
                placeholder="Title Name"
                value={updatedTitle}
                required
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
              <textarea
                className="border border-gray-300 outline-none p-3 rounded-lg w-full mt-3"
                placeholder="Description"
                required
                value={updatedDesc}
                onChange={(e) => setUpdatedDesc(e.target.value)}
              />
              <input
                className="border border-gray-300 p-2 rounded-lg mt-3 w-full"
                type="date"
                required
                value={updatedDate}
                onChange={(e) => setUpdatedDate(e.target.value)}
              />
              <div className="flex gap-2 items-center flex-row">
                <button
                  type="submit"
                  className="bg-blue-400 hover:bg-blue-500 text-white p-3 w-full rounded-lg mt-3"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-red-400 hover:bg-red-500 text-white p-3 w-full rounded-lg mt-3"
                  onClick={() => setIsOpen(false)}
                >
                  Close Modal
                </button>
              </div>
            </form>
          </div>
        </>
        
      )}

      <div className="min-h-screen border flex items-center justify-center text-gray-600 px-3 gap-5 flex-col">
        <h1 className="text-3xl font-bold">Todo List with CRUD Operation</h1>
        <div className="flex items-center flex-row gap-5">
          <form
            className="bg-white border border-gray-300 p-5 rounded-lg w-100"
            onSubmit={handlerSubmit}
          >
            <input
              className="border border-gray-300 outline-none p-3 rounded-lg w-full"
              placeholder="Task Title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="border border-gray-300 outline-none p-3 rounded-lg w-full mt-3"
              placeholder="Task Description"
              required
              value={desc}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="border border-gray-300 p-2 rounded-lg mt-3 w-full"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-white p-3 w-full rounded-lg mt-3"
            >
              Submit
            </button>
          </form>
          <div className="bg-white border border-gray-300 p-5 rounded-lg w-100">
            <h1 className="font-semibold text-2xl">Completed Log</h1>
            <div className="h-53 overflow-y-auto space-y-3 mt-3">
              {isDone.map((items, index) => (
                <div key={index} className="border border-gray-300 p-2 rounded-lg">
                  <p>
                    <strong>Task ID: </strong>
                    {items.id}
                  </p>
                  <p>
                    <strong>Title: </strong>
                    {items.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-100 space-y-4">
          {datas.map((items, index) => (
            <div
              className="bg-white border border-gray-300 p-5 rounded-lg w-100"
              key={index}
            >
              <p>ID: {items.id}</p>
              <p>Title: {items.title}</p>
              <p>Description: {items.description}</p>
              <p>Date: {items.due_date}</p>
              <p>Status: {items.is_completed ? "Complete" : "Incomplete"}</p>
              <button
                onClick={() => handlerDone(items)}
                className="bg-yellow-400 w-full hover:bg-yellow-500 text-white rounded-lg mt-2 p-2"
              >
                Mark as done
              </button>
              <div className="flex gap-2 items-center flex-row">
                <button
                  className="bg-green-400 w-full hover:bg-green-500 text-white rounded-lg mt-2 p-2"
                  onClick={() => {
                    setIsOpen(true);
                    setUpdatedButton(items);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-400 w-full hover:bg-red-500 text-white rounded-lg mt-2 p-2"
                  onClick={() => handlerDelete(items)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
