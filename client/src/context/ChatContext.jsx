import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);

  async function fetchResponse() {
    if (prompt === "") return alert("Write prompt");
    setNewRequestLoading(true);
    setPrompt("");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBW3E0PJQaPoU_xRm3PucC9aNYiKGIabb4",
        method: "post",
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      });

      const message = {
        question: prompt,
        answer:
          response["data"]["candidates"][0]["content"]["parts"][0]["text"],
      };

      setMessage((prev) => [...prev, message]);
      setNewRequestLoading(false);


      const { data } = await axios.post(`${server}/api/chat/${selected}`, {
        question: prompt,
        answer:
          response["data"]["candidates"][0]["content"]["parts"][0]["text"],
      },{
        headers:{
            token: localStorage.getItem("token")
        }
      });
    } catch (error) {
      alert("something went wrong");
      console.log(error);
      setNewRequestLoading(false);
    }
  }

  const [chats , setChats] = useState([]);

  const [selected , setSelected] = useState(null)

  async function fetchChats() {
    try {
        const {data} = await axios.get(`${server}/api/chat/all`,{
            headers: {
                token: localStorage.getItem("token"),
            }
        });

        setChats(data);
        setSelected(data[0]._id)
    } catch (error) {
        console.log(error)
    }
    
  }

  const [createLoad , setCreateLoad] = useState(false)

  async function createNewChat(){
    setCreateLoad(true)
    try {
        const {data} = await axios.post(`${server}/api/chat/new` ,{} , {
            headers: {
                token: localStorage.getItem("token")
            }
        });

        fetchChats(data)
        setCreateLoad(false)

    } catch (error) {
        toast.error("Something Went Wrong ")
        setCreateLoad(false)
    }
    
  }

  const [loading , setLoading] = useState(false)

  async  function fetchMessages() {
    setLoading(true)
    try {
        const {data} = await axios.get(`${server}/api/chat/${selected}`,{
            headers:{
                token: localStorage.getItem("token")
            }
        })
        setMessage(data)
        setLoading(false)
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
  }

  async function deleteChat(id) {
    try {
        const {data} = await axios.delete(`${server}/api/chat/${id}`, {
            headers: {
                token: localStorage.getItem("token"),
            }
        });
        toast.success(data.message);
        fetchChats();
        window.location.reload()
    } catch (error) {
        console.log(error)
        alert("Something Went Wrong")
        
    }
    
  }

  useEffect(() => {
    fetchChats()
  } , [])

  useEffect(() => {
    fetchMessages()
  } , [selected])

  return (
    <ChatContext.Provider
      value={{ fetchResponse, message, prompt, setPrompt, newRequestLoading , chats , createLoad , createNewChat , selected , setSelected , loading , setLoading , deleteChat}}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
