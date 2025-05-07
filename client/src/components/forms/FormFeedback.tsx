import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./forms.css";

interface FormFeedbackProps {
  timeout?: number;
  showSuccess?: boolean;
  onComplete: () => void;
  status: "pending" | "success" |'failed' | '';
}



const FormFeedback = ({ status, onComplete, showSuccess=true, timeout=1000 }: FormFeedbackProps) => {
  const [loading, setLoading] = useState("pending");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (status) {
      setVisible(true);
      setLoading("pending");

      timer = setTimeout(() => {
        setLoading(status);

        if (status === "success" && showSuccess ) {
          setTimeout(() => {
            onComplete();
            setVisible(false);
          }, 1000);
        } 
        
        else {
          onComplete();
          setVisible(false); 
        }
      }, timeout); 
    }

    return () => {clearTimeout(timer)};

  }, [status, onComplete]);


  if (!visible) return null;
  

  return (
    <div className="feedback-popup">
      <div className="feedback-overlay"></div>
        {loading === "pending" && (
          <div className="loader-container">
            <span className="loader"></span>
          </div>
        )}
        {(loading === "success" && showSuccess) &&(
          <div className="feedback-container text-center mt-4">
            <FaCheckCircle className="feedback-icon mx-auto text-success" />
          </div>
        )}
    </div>
  );
};
export default FormFeedback;