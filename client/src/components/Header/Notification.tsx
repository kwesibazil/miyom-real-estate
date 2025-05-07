
import { useEffect, useState, useRef } from "react";
import { getMessageFromISODate } from "@helpers/utils.helpers";
import { Message } from "@store/features/auth/authStore.interface";
import { useAppSelector } from "@hooks/useRedux.hook";
import { selectMessages } from "@store/features/auth/AuthSlice.store";
import { FaBell } from "react-icons/fa";


import './Header.css'

const Notification = () => {
  const [visible, setVisible] = useState(false);
  const messages = useAppSelector(selectMessages);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  return(
    <div ref={menuRef} className="notification position-relative d-none d-sm-block">
      <FaBell onClick={()=> setVisible(prev => !prev)} className="mx-sm-3 mx-md-4 bell "/>
      {
        (messages?.length === 0) ? <p>No Message</p> :
        <div className={`notification-box shadow-lg ${visible ? '' : 'd-none'}`}>
          <div className="main-title d-flex align-items-center justify-content-between">
            <h2 className="mb-0">Notifications</h2>
            <h5 className="mb-0">{messages?.length || 0}</h5>
          </div>
          <div className="notification-box-content">
            <div className="notification-card-container py-1 ">
              {messages && messages.map((msg) => (
                <NotificationCard key={msg._id} msg={msg} />
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  )
}


const NotificationCard = ({ msg }: { msg: Message }) => {
  const [data, setData] = useState<Message | null> (null)
  
  useEffect(()=>{
    setData({...msg, sent: getMessageFromISODate(msg.sent)});
  },[msg])


  if(!data) return null

  return(
    <div className="notification-card px-2">
      <p className="card-subject">{data.subject}</p>
      <p className="card-content">{data.content}</p>
      <p className="card-sent">{data.sent}</p>
    </div>
  )
}



export default Notification
