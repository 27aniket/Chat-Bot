import React, { useState, useRef, useEffect } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { LoadingSmall } from "../components/loading";
import { ChatData } from "../context/ChatContext";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSideBar = () => setIsOpen(!isOpen);

  const { fetchResponse, message, prompt, setPrompt, newRequestLoading , loading , chats} =
    ChatData();

  const submitHandler = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  const chatEndRef = useRef(null);

  // Scroll to bottom whenever new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, newRequestLoading]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <SideBar isOpen={isOpen} toggleSideBar={toggleSideBar} />

      {/* Main content */}
      <div className="flex flex-1 flex-col relative">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSideBar}
          className="md:hidden p-4 bg-gray-800 text-2xl"
        >
          <GiHamburgerMenu />
        </button>

        {/* Header */}

        <Header />

        {/* Chat container */}
        <div className="flex flex-1 flex-col justify-between p-6 md:mb-0">
          {/* Chat messages */}
          <div className="flex-1 flex flex-col gap-4 max-h-[600px] overflow-y-auto thin-scrollbar">
            {message && message.length > 0 ? (
              message.map((e, i) => (
                <div key={i} className="flex flex-col gap-2">
                  {/* User message */}
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-300 p-2 rounded-full text-2xl text-orange-600 h-10 w-10 flex items-center justify-center">
                      <CgProfile />
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-500 text-white flex-1">
                      {e.question}
                    </div>
                  </div>

                  {/* Bot message */}
                  <div className="flex items-start gap-4">
                    <div className="bg-green-300 p-2 rounded-full text-2xl text-green-600 h-10 w-10 flex items-center justify-center">
                      <FaRobot />
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-600 text-white flex-1">
                      <p dangerouslySetInnerHTML={{ __html: e.answer }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No Chat Yet</p>
            )}

            {newRequestLoading && <LoadingSmall />}
            <div ref={chatEndRef} />
          </div>

          {/* Input box */}
          {chats && chats.length === 0 ? (
            ""
          ) : (
            <form
              className="flex w-full mt-4 md:w-[100%] ml-auto"
              onSubmit={submitHandler}
            >
              <input
                type="text"
                placeholder="Enter a prompt here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className="flex-1 p-4 bg-gray-700 rounded-l text-white outline-none"
              />
              <button className="p-4 bg-gray-600 rounded-r text-2xl text-white">
                <IoMdSend />
              </button>
            </form>
          )}
          {/* <form
            className="flex w-full mt-4 md:w-[100%] ml-auto"
            onSubmit={submitHandler}
          >
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="flex-1 p-4 bg-gray-700 rounded-l text-white outline-none"
            />
            <button className="p-4 bg-gray-600 rounded-r text-2xl text-white">
              <IoMdSend />
            </button>
          </form> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
