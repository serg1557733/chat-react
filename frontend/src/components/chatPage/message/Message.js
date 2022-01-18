// import React, { useEffect, useRef } from 'react'

// export const Messages = ({ messages }) => {
//     console.log(messages)

//   const messagesEndRef = useRef(null)

//   const scrollToBottom = () => {
//     messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(scrollToBottom, [messages]);

//   return (
//     <div>
//       <div ref={messagesEndRef} />
//     </div>
//   )
// }

    // const messageWrapper = (messages) => {
    //     <ScrollToBottom >
    //          {
    //         messages.map((item) =>
    //             <div 
    //                 key={item._id}
    //                 className={ (item.userName == user.userName)? 
    //                 'message myMessage' :
    //                 'message'}>
    //                     <span>{item.userName}</span>
    //                     <p>{item.text}</p>  
    //                     <div>{item.createDate}</div>
    //             </div>

    //         )}

    //     </ScrollToBottom>
    // }