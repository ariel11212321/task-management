import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/AuthContext";
import useHttp from "../../hooks/useHttp";
import config from "../../config.json";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import MessageModal from "../MessageModal";
import JoinOrCreateGroupModal from "../Modals/JoinOrCreateGroupModal";

export default function GroupPage() {
  const { user, setUser } = useUser();
  const { token } = useAuth();
  const { sendRequest, isLoading, error } = useHttp();
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    if (!user?.group) {
      setShowModal(true);
    } else {
        navigate("/groupHome");
    }
  }, [user.group, navigate]);

 
 


  return (
    <>
    {isLoading && <LoadingScreen />}
    {error && <MessageModal type={'error'} message={error} onClose={() => {}} />}
    {!isLoading && !error && (
      <div className="p-4">
        
      {showModal && (
        <JoinOrCreateGroupModal onSubmitCreate={() => {}} onSubmitJoin={() => {}} />
      )}
      
    </div>
    )}

    </>
  );
}