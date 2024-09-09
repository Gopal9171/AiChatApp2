// import Upload from "../upload/upload";
// import "./newPromt.css";
// import { useEffect, useRef, useState } from 'react';
// import { IKImage } from 'imagekitio-react';
// const NewPrompt = () => {
//     const [img, setImg ] = useState({
//         isLoading: false,
//         error: "",
//         dbData: {}
//     })
//     const endRef = useRef(null);

//     useEffect(() => {
//         endRef.current.scrollIntoView({
//             behavior: "smooth"
//         });
//     }, []);
//     return (
//         <>
//             {img.dbData ? filePath && (
//                 <IKImage
//                     urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//                     path={img.dbData ? filePath}
//                 />
//             )}

//             <div className="endChat" ref={endRef}>
//                 <div className="newForm">
//                     <Upload setImg={setImg} />
//                     <input id="file" type="file" multiple={false} hidden />
//                     <input type="text" placeholder="Ask anything..." />
//                     <button>
//                         <img src="/arrow.png" alt="" />
//                     </button>
//                 </div>
//             </div>
//         </>

//     )


// }
// export default NewPrompt;
import Upload from "../upload/upload";
import "./newPromt.css";
import { useEffect, useRef, useState } from 'react';
import { IKImage } from 'imagekitio-react'; // Make sure to import IKImage if not already
import model from "../../lib/gemoni";
import Markdown from "react-markdown"
import { useMutation, useQueryClient } from "@tanstack/react-query";
const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {}
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello, I have 2 dogs in my house" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you , What would you like to know" }]
      }
    ],
    generationConfig: {
      // maxOutputTokens:100,
    },
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({
      behavior: "smooth"
    });
  }, [data,question, answer, img.dbData]);
  const queryClient = useQueryClient();



  const mutation = useMutation({
    mutationFn: async () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
        formRef.current.reset()
        setQuestion("")
        setAnswer("")
        setImg({
          isLoading: false,
          error: "",
          dbData: {},
          aiData: {}
        })
      });
      // console.log("id is ", id)
      // navigate(`/dashboard/chats/${id.chatId}`);
    },
    onError: (err) => {
      console.log(err)
    },
  });

  const add = async (text, isInitial) => {
    // const prompt="write a story about an AI  and magic";
    if(!isInitial)setQuestion(text);
    try {
      const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);

      // const response = await result.response;'
      let aqumulateText = "";
      for await (const chunk of result.stream) {
        const chunText = chunk.text();
        console.log(chunText)
        aqumulateText += chunText;
        setAnswer(aqumulateText);
      }
      mutation.mutate();

    } catch (err) {
      console.log(err)
    }

    // setImg({isLoading: false,
    //   error: "",
    //   dbData: {},
    //   aiData:{}})
    // console.log("text", text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
}
const hasRun = useRef(false);
useEffect(()=>{
  if(!hasRun.current){
    if(data?.history?.length===1){
      add(data.history[0].parts[0].text, true);
    }
  }
  hasRun.current = true;
 
},[])

  // Assuming filePath is a derived value from img.dbData
  // const filePath = img.dbData?.filePath; // Adjust this based on your actual data structure

  return (
    <>
      {/* {img.isLoading && <div className="">Loading....</div>}
      {img.dbData && filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={filePath}
          width="400"
          height="400"
        />
      )} */}
      {/* {img.isLoading && <div>Loading....</div>}
      
      {filePath ? (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={filePath}
          width="400"
          height="400"
        />
      ) : null} */}
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {/* <button onClick={add}>TEST AI</button> */}
      {question && <div className="message user">{question}</div>}
      {answer && <div className="message"><Markdown>{answer}</Markdown></div>}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef} >
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="submit" />
        </button>
      </form>

    </>
  );
}

export default NewPrompt;
