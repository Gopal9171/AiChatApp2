// import { useState } from 'react';
// import './homePage.css';
// import { Link } from "react-router-dom";
// import { TypeAnimation } from 'react-type-animation';
// const HomePage = () => {
//     const { typingStatus, setTypingStatus } = useState("human1");
 
//     const test = async()=>{
//         await fetch("http://localhost:3000/api/test",{
//             method:"GET",
//             credentials:"include",
//         })
//     }
//     return (
//         <div className="homepage">
//             <img src="/orbital.png" alt="" className='orbital' />
//             <div className='left'>
//                 <h1>GAMA AI</h1>
//                 <h2>SuperCharge your creativity and Productivity</h2>
//                 <h3>We’ve trained a model called GAMA AI which interacts in a conversational way. The dialogue format makes it possible for GAMA AI to answer followup questions, admit its mistakes, challenge incorrect premises, and reject inappropriate requests.</h3>
//                 <Link to="/dashboard">Get Started</Link>
//                 <button onClick={test}> TEST ON BACKEND</button>
//             </div>
//             <div className="right">
//                 <div className="imgContainer">
//                     <div className="bgContainer">
//                         <div className="bg"></div>

//                     </div>
//                     <img src="/bot.png" alt="" className='bot' />
//                     <div className="chat">
//                         <img
//                             src={
//                                 typingStatus === "human1"
//                                     ? "/human1.jpeg"
//                                     : typingStatus === "human2"
//                                         ? "/human2.jpeg"
//                                         : "bot.png"
//                             }
//                             alt=""
//                         />
//                         <TypeAnimation
//                             sequence={[
//                                 // Same substring at the start will only be typed out once, initially
//                                 "Human:We produce food for Mice",
//                                 2000,
//                                 () => {
//                                     setTypingStatus("bot");
//                                 },
//                                 "Bot:We produce food for Hamsters",
//                                 2000,
//                                 () => {
//                                     setTypingStatus("human2");
//                                 },
//                                 "Human2:We produce food for Guinea Pigs",
//                                 2000,
//                                 () => {
//                                     setTypingStatus("bot");
//                                 },
//                                 "Bot:We produce food for Chinchillas",
//                                 2000,
//                                 () => {
//                                     setTypingStatus("human1");
//                                 },
//                             ]}
//                             wrapper="span"
//                             repeat={Infinity}
//                             cursor={true}
//                             omitDeletionAnimation={true}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className="terms">
//                 <img src="/logo.png" alt="" />
//                 <div className="links">
//                     <Link to="/">Terms of Service</Link>
//                     <Link to="/">Privacy Policy</Link>
//                 </div>
//             </div>
//         </div>
//     )
// };

// export default HomePage;
import { useState } from 'react';
import './homePage.css';
import { Link } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import { useAuth } from '@clerk/clerk-react';


const HomePage = () => {
    const [typingStatus, setTypingStatus] = useState("human1");
   const {getToken}= useAuth();
   const {userId} = useAuth();
//    console.log("userid ", userId);
//    console.log("Token", getToken);
    // const test = async () => {
    //     await fetch("http://localhost:3000/api/test", {
    //         credentials: "include",
    //     });
    // };
    


    // const test = async () => {
    //     try {
    //         const token = await getToken(); // Get the token from Clerk
    //         if (!token) {
    //             throw new Error("No authentication token available");
    //         }
            
    //         console.log(`Bearer ${token}`); // Log the token for debugging
    
    //         const response = await fetch("http://localhost:3000/api/test", {
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${token}`, // Include token in Authorization header
    //             },
    //             credentials: "include", // Include credentials like cookies
    //         });
    
    //         if (!response.ok) {
    //             // You can handle specific status codes here if needed
    //             if (response.status === 401) {
    //                 throw new Error("Unauthorized - Please log in again");
    //             }
    //             throw new Error(`Error: ${response.statusText}`);
    //         }
    
    //         const data = await response.json(); // Assuming the response returns JSON data
    //         console.log("Request successful, data received:", data);
    //     } catch (error) {
    //         console.error("Error during fetch:", error.message);
    //     }
    // };
    
    
    return (
        <div className="homepage">
            <img src="/orbital.png" alt="" className='orbital' />
            <div className='left'>
                <h1>GAMA AI</h1>
                <h2>SuperCharge your creativity and Productivity</h2>
                <h3>We’ve trained a model called GAMA AI which interacts in a conversational way. The dialogue format makes it possible for GAMA AI to answer follow-up questions, admit its mistakes, challenge incorrect premises, and reject inappropriate requests.</h3>
                <Link to="/dashboard">Get Started</Link>
                {/* <button onClick={test}> TEST ON BACKEND</button> */}
            </div>
            <div className="right">
                <div className="imgContainer">
                    <div className="bgContainer">
                        <div className="bg"></div>
                    </div>
                    <img src="/bot.png" alt="" className='bot' />
                    <div className="chat">
                        <img
                            src={
                                typingStatus === "human1"
                                    ? "/human1.jpeg"
                                    : typingStatus === "human2"
                                        ? "/human2.jpeg"
                                        : "bot.png"
                            }
                            alt=""
                        />
                        <TypeAnimation
                            sequence={[
                                "Human:We produce food for Mice",
                                2000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Bot:We produce food for Hamsters",
                                2000,
                                () => {
                                    setTypingStatus("human2");
                                },
                                "Human2:We produce food for Guinea Pigs",
                                2000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Bot:We produce food for Chinchillas",
                                2000,
                                () => {
                                    setTypingStatus("human1");
                                },
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt="" />
                <div className="links">
                    <Link to="/">Terms of Service</Link>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
