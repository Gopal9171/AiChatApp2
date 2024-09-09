import './chatPage.css';
import NewPrompt from '../../component/newPromt/newPromt';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from "react-router-dom";
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';
const ChatPage = () => {
    const path = useLocation().pathname;
    const chatId = path.split("/").pop()
    console.log("chat id is ", chatId)
    const { isPending, error, data } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
                credentials: "include",
            }).then((res) =>
                res.json(),
            ),
    })

    return (
        <div className="chatpage">
            <div className="wrapper">
                <div className="chat">
                    {/* <div className="message">Test message from AI</div> */}

                    {isPending
                        ? "Loading..."
                        : error
                            ? "Something went wrong!"
                            : data?.history?.map((message, i) => (
                                <>
                                    {message.img && (
                                        <IKImage
                                            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                            path={message.img}
                                            height="300"
                                            width="400"
                                            transformation={[{ height: 300, width: 400 }]}
                                            loading="lazy"
                                            lqip={{ active: true, quality: 20 }}
                                        />
                                    )}
                                    <div
                                        className={
                                            message.role === "user" ? "message user" : "message"
                                        }
                                        key={i}
                                    >
                                        <Markdown>{message.parts[0].text}</Markdown>
                                    </div>
                                </>
                            ))}



                    {/* <NewPrompt /> */}
                    {data && <NewPrompt data={data} />}

                </div>
            </div>
        </div>
    )
};

export default ChatPage;
// import "./chatPage.css";
// import NewPrompt from '../../component/newPromt/newPromt';
// import { useQuery } from "@tanstack/react-query";
// import { useLocation } from "react-router-dom";
// import Markdown from "react-markdown";
// import { IKImage } from "imagekitio-react";

// const ChatPage = () => {
//   const path = useLocation().pathname;
//   const chatId = path.split("/").pop();

//   const { isPending, error, data } = useQuery({
//     queryKey: ["chat", chatId],
//     queryFn: () =>
//       fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
//         credentials: "include",
//       }).then((res) => res.json()),
//   });

//   console.log(data);

//   return (
//     <div className="chatPage">
//       <div className="wrapper">
//         <div className="chat">
//           {isPending
//             ? "Loading..."
//             : error
//             ? "Something went wrong!"
//             : data?.history?.map((message, i) => (
//                 <>
//                   {message.img && (
//                     <IKImage
//                       urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//                       path={message.img}
//                       height="300"
//                       width="400"
//                       transformation={[{ height: 300, width: 400 }]}
//                       loading="lazy"
//                       lqip={{ active: true, quality: 20 }}
//                     />
//                   )}
//                   <div
//                     className={
//                       message.role === "user" ? "message user" : "message"
//                     }
//                     key={i}
//                   >
//                     <Markdown>{message.parts[0].text}</Markdown>
//                   </div>
//                 </>
//               ))}

//            <NewPrompt/>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
