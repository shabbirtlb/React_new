import React, { useEffect } from 'react';
import image from './pexel.png';
import { ReactMic } from 'react-mic';
import { useState } from 'react';
import axios from "axios";
const ReactRecorder = () => {
    const [voice, setVoice] = useState(false);
    const [recordBlobLink, setRecordBlobLink] = useState('');
    const [recordBlob, setRecordBlob] = useState(null);
    const [language, setLanguage] = useState('');
    const [transcript, setTranscript] = useState('');
    const [userdata,setUserdata] = useState({});
    const getUser = async() =>{
        try{
            const response = await axios.get("http://localhost:6005/login/success",{withCredentials:true})
            console.log("response",response)
            setUserdata(response.data.user)
            console.log(userdata)
        }catch(error){
            console.log("error",error)
        }
    }
    useEffect(()=>{
        getUser()
    },[])
    const onStop = (recordedBlob) => {
        setRecordBlob(recordedBlob);
        setRecordBlobLink(recordedBlob.blobURL);
    };

    const startHandle = () => {
        setVoice(true)
    }
    const stopHandle = () => {
        setVoice(false)
    }

    const clearHandle = () => {
        setVoice(false)
        setRecordBlobLink(false)
    }
    const Logout = () =>{
        window.location.href = '/';
    }
    const saveRecording = async () => {
        console.log(recordBlob,language,transcript)
        if (recordBlob && language && transcript) {
            console.log("Condition Entered");
            const formData = new FormData();
            formData.append('audio', recordBlob.blob, 'recording.mp3');
            formData.append('language', language);
            formData.append('transcript', transcript);

            try {
                const response = await axios.post('http://localhost:6005/saveRecording', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Saved successfully:', response.data);
            } catch (error) {
                console.error('Error saving recording:', error);
            }
        }
    };
    return (
            <div className='bg-cover h-[100vh] pt-10 text-white' style={{backgroundImage: `url(${image})`}}>
            <div className=" max-w-sm border py-4 px-6 mx-auto my-24 bg-[rgb(0,0,0,0.4)] rounded-3xl ">
            <h1 className=" text-[18px] font-semibold text-[limegreen]">Hi {userdata.displayName} !!</h1>
                <h2 className=" text-[22px] font-semibold text-[red]">Audio Recorder</h2>
                <div className="">
                        <h2 className='text-[yellow] font-bold'>Language</h2>
                        <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[rgb(0,0,0,0.5)] rounded-12 text-[red] font-semibold text-[12px] h-[3.5vh] indent-2" placeholder='Language..'/>
                        <h2 className='text-[yellow] font-bold'>Transcript</h2>
                        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="bg-[rgb(0,0,0,0.5)] rounded-12 text-[red] font-semibold text-[18px] w-[42vh] h-[18vh] indent-1"/>
                    </div>
                <ReactMic
                    record={voice}
                    className="sound-wave w-full "
                    onStop={onStop}
                    strokeColor="red"
                    backgroundColor="black"
                />
                <div className="">
                    {recordBlobLink ? <button onClick={clearHandle} className=" bg-[rgb(0,0,0,0.9)] text-[red] rounded-md my-2 py-1 px-3 font-semibold text-[16px] font-medium text-[16px] "> Clear </button> : ""}
                </div>
                <div className=" mt-2  ">
                    {!voice ? <button onClick={startHandle} className=" bg-[rgb(0,0,0,0.9)] text-[red] rounded-md py-1 px-3 font-semibold text-[16px] ">Start</button> : <button onClick={stopHandle} className=" bg-[rgb(0,0,0,0.9)] text-[red] rounded-md py-1 px-3 font-semibold text-[16px] ">Stop</button>}
                </div>
                <div className="">
                {recordBlobLink && <audio controls src={recordBlobLink} className='mt-6' />}
                {recordBlobLink && <button onClick={saveRecording} className='bg-[rgb(0,0,0,0.9)] text-[red] py-1 px-3 font-medium text-2px rounded-md my-2 mx-auto'>
                        Save Recording
                    </button> }
                <button onClick={Logout} className='bg-[rgb(0,0,0,0.9)] text-[red] py-1 px-3 font-medium text-2px rounded-md my-2 mx-1'>Logout</button>
                </div>

            </div>
        </div>
    );
};

export default ReactRecorder;