import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ChatData } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { LoadingSpinner } from "./loading";
import { UserData } from "../context/userContext";


const SideBar = ({ isOpen, toggleSideBar }) => {
  const { chats, createLoad, createNewChat, setSelected , deleteChat } =
    ChatData();

    const {logoutHandler} = UserData();

    const clickEvent = (id) => {
      setSelected(id)
      toggleSideBar()

    }
  return (
    <div
      className={`fixed inset-0 bg-gray-800 p-4 transition-transform transform md:relative md:translate-x-0 md:w-1/4 md:block 
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <button
        className="md:hidden p-2 mb-4 bg-gray-700 rounded text-2xl"
        onClick={toggleSideBar}
      >
        <IoIosCloseCircle />
      </button>

      <div className="text-2xl font-semibold mb-6">ChatBot</div>

      <div className="mb-4">
        <button
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl"
          onClick={createNewChat}
        >
          {createLoad ? <LoadingSpinner /> : "New Chat +"}
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Recent</p>

        <div className="max-h-[500px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar">
          {chats && chats.length > 0 ? (
            chats.map((e) => (
              <button
                key={e._id}
                className="w-full text-left py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded-2xl mt-2 flex justify-between items-center "
                onClick={() => clickEvent(e._id)}
              >
                <span>{e.latestMessage.slice(0, 38)}...</span>
                <button
                  className="bg-red-300 flex justify-center items-center   text-red-800 text-lg px-3 py-2 rounded-lg"
                  onClick={() => deleteChat(e._id)}
                >
                  <MdDelete />
                </button>
              </button>
            ))
          ) : (
            <p>No Chats yet</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0  mb-6 w-full ">
        <button
          className="bg-red-300 flex justify-center items-center gap-3  text-red-800 text-lg font-bold px-3 py-2 rounded-md "
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
