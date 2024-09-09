// import './dashboardPage.css';

// const DashboardPage=()=>{
//     const handleSubmit = async(e)=>{
//      e.preventDefault();

//      const text = e.target.text.value;
//      if(!text) return
    
//      await fetch("http://localhost:3000/api/chats",{
//         method:"POST",
//         headers:{
//           "Content-Type":"application/json"
//         },
//         body:JSON.stringify({text})
//     }
// }
    
//     return(
//         <div className="dashboardpage">
//             <div className="texts">
//                 <div className="logo">
//                     <img src="/logo.png" alt="" />
//                     <h1>GAMA AI</h1>

//                 </div>
//                  <div className='options'>
//                     <div className="option">
//                         <img src="/chat.png" alt="" />
//                         <span>Ceate a New chat</span>
//                     </div>
//                     <div className="option">
//                         <img src="/image.png" alt="" />
//                         <span>Analyze Image</span>
//                     </div>
//                     <div className="option">
//                         <img src="/code.png" alt="" />
//                         <span>Help me with my code</span>
//                     </div>
//                  </div>
//             </div>
//             <div className="formContainer">
//                 <form onSubmit = {handleSubmit}>
//                     <input type="text" placeholder='Ask me anything...' />
//                     <button>
//                         <img src="/arrow.png" alt="" />
//                     </button>
//                 </form>
//             </div>
//         </div>
//     )
// };

// export default  DashboardPage;
import {  useMutation, useQueryClient } from '@tanstack/react-query';
import './dashboardPage.css';
import {useAuth} from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
const DashboardPage = () => {
  // const navigate = useNavigate()
  // const queryClient = new QueryClient()
  // const mutation = useMutation({
  //   mutationFn: (text)=>{
  //     return  fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
  //       method: "POST",
  //       credentials:"include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ text }),
  //     }).then((res)=>res.json());
  //   },
  //   onSuccess: (id) => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ['userChats'] })
  //     navigate(`/dashboard/chats/${id}`)
  //   },
  // })
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const text = e.target.text.value;
  //   if (!text) return;
  //   mutation.mutate(text);
    
  // };
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async(text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      console.log("id is ", id)
      navigate(`/dashboard/chats/${id.chatId}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };

  return (
    <div className="dashboardpage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>GAMA AI</h1>
        </div>
        <div className='options'>
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create a New chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Analyze Image</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my code</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder='Ask me anything...' /> {/* Added "name" attribute */}
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
